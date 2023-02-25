import { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { useTheme } from "styled-components";

import { usePhoenix } from "../../providers/PhoenixProvider";
import { ApiMarketData } from "../../providers/DataProvider";
import { HOUR_PER_DAY } from "../../utils/time";
import { abbreviateTotal } from "../../utils/format";
import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { Skeleton } from "../Loader";

interface Volume {
  date: Date;
  volume: number;
}
interface Series {
  label: string;
  data: Volume[];
}

export function VolumeHistoryChart({
  volumeHistory,
  noData,
  ...baseProps
}: BaseProps & {
  volumeHistory: ApiMarketData["volume"];
  noData?: boolean;
}) {
  const theme = useTheme();
  const { currentMarket } = usePhoenix();
  const data: Series[] = [
    {
      label: "Volume",
      data: volumeHistory.map(({ time, volume_in_quote_units }, i) => ({
        date: new Date(new Date(time).getTime()),
        volume: +volume_in_quote_units,
      })),
    },
  ];
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!!volumeHistory.length) {
      setTimeout(() => setIsInit(true), 500);
    } else {
      setIsInit(false);
    }
  }, [isInit, volumeHistory.length]);

  return (
    <Flex
      position="relative"
      w="100%"
      my={1}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Flex mb={2}>
        <Text variant="label" mr={1 / 2}>
          Volume
        </Text>
        <Text fontSize="xs" fontWeight="normal" opacity="disabled">
          ({currentMarket?.quoteToken.symbol || "N/A"})
        </Text>
      </Flex>
      {!!volumeHistory.length && isInit && (
        <Flex position="absolute" top={1} right={2} justify="flex-end">
          <Flex mr={2} align="flex-end" column>
            <Text mb={1 / 4} fontSize="xs" opacity="disabled">
              24H
            </Text>
            <Text fontSize="xl">
              {abbreviateTotal(
                volumeHistory
                  .slice(0, HOUR_PER_DAY)
                  .reduce((acc, v) => acc + +v.volume_in_quote_units, 0) || 0
              )}
            </Text>
          </Flex>
          <Flex align="flex-end" column>
            <Text mb={1 / 4} fontSize="xs" opacity="disabled">
              TOTAL
            </Text>
            <Text fontSize="xl">
              {abbreviateTotal(
                volumeHistory.reduce(
                  (acc, v) => acc + +v.volume_in_quote_units,
                  0
                ) || 0
              )}
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex position="relative" {...baseProps}>
        {(!isInit || !volumeHistory.length) && !noData && (
          <Skeleton
            position="absolute"
            my={-1}
            ribHeight={2}
            ribSpacing={1}
            rows={7}
          />
        )}
        {!!volumeHistory.length && (
          <Flex w="100%" h="100%" opacity={isInit ? 1 : 0}>
            <Chart
              options={{
                data,
                primaryAxis: {
                  getValue: (datum: any) => datum.date,
                },
                secondaryAxes: [
                  {
                    getValue: (datum: any) => datum.volume,
                  },
                ],
                defaultColors: [theme.palette["primary"]],
                dark: theme.mode === "dark",
                tooltip: false,
              }}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
