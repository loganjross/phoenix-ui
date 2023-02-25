import { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { useTheme } from "styled-components";

import { usePhoenix } from "../../../providers/PhoenixProvider";
import { ApiMarketData, useData } from "../../../providers/DataProvider";
import { MS_PER_SECOND } from "../../../utils/time";
import { BaseProps } from "../../../styles/base";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Skeleton } from "../../Loader";

interface Price {
  date: Date;
  price: number;
}
interface Series {
  label: string;
  data: Price[];
}

const FIFTEEN_MIN_SNAPSHOT_INTERVAL = 30;

export function PriceHistoryChart(baseProps: BaseProps) {
  const theme = useTheme();
  const { currentMarket } = usePhoenix();
  const { currentMarketData } = useData();
  const [priceHistory, setPriceHistory] = useState<
    ApiMarketData["priceHistory"]
  >([]);
  const isPriceUp = priceHistory.length
    ? priceHistory[priceHistory.length - 1].price < priceHistory[0].price
    : false;
  const data: Series[] = [
    {
      label: "Price",
      data: priceHistory.map(({ unix_timestamp, price }) => ({
        date: new Date(+unix_timestamp * MS_PER_SECOND),
        price: +price,
      })),
    },
  ];
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (currentMarketData) {
      setPriceHistory(
        currentMarketData.priceHistory.filter(
          (_, i) => i % FIFTEEN_MIN_SNAPSHOT_INTERVAL === 0
        )
      );
    }
  }, [currentMarketData]);

  useEffect(() => {
    if (!!priceHistory.length) {
      setTimeout(() => setIsInit(true), 500);
    } else {
      setIsInit(false);
    }
  }, [priceHistory.length]);

  return (
    <Flex w="100%" my={1} p={2} bg="contrast" radius={1} shadow column>
      <Flex mb={2}>
        <Text variant="label" mr={1 / 2}>
          Price
        </Text>
        <Text fontSize="xs" fontWeight="normal" opacity="disabled">
          ({currentMarket?.quoteToken.symbol || "N/A"})
        </Text>
      </Flex>
      <Flex position="relative" {...baseProps}>
        {(!isInit || !priceHistory.length) && (
          <Skeleton
            position="absolute"
            my={-1}
            ribHeight={2}
            ribSpacing={1}
            rows={7}
          />
        )}
        {!!priceHistory.length && (
          <Flex w="100%" h="100%" opacity={isInit ? 1 : 0}>
            <Chart
              options={{
                data,
                primaryAxis: {
                  getValue: (datum: any) => datum.date,
                },
                secondaryAxes: [
                  {
                    getValue: (datum: any) => datum.price,
                  },
                ],
                defaultColors: [theme.palette[isPriceUp ? "success" : "error"]],
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
