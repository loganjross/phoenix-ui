import { useTheme } from "styled-components";

import { usePhoenix } from "../../../providers/PhoenixProvider";
import { ApiMarketData, useData } from "../../../providers/DataProvider";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { formatNumberToString, formatPubkey } from "../../../utils/format";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Skeleton } from "../../Loader";

const MAX_TOP_MAKERS = 5;

export function TopMakersTable({
  topMakers,
}: {
  topMakers: ApiMarketData["topMakers"];
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const { currentMarket } = usePhoenix();
  const { setCurrentTab, setCurrentTraderAddress } = useData();

  return (
    <Flex
      w="100%"
      maxW={isSmallScreen ? undefined : "420px"}
      h="100%"
      my={1}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Text variant="label" mb={2}>
        Top Makers
      </Text>
      <Flex w="100%" align="center" justify="space-between" mb={1}>
        <Flex
          w="50%"
          pl={1}
          fontSize="sm"
          fontWeight="bold"
          align="center"
          justify="flex-start"
        >
          Address
        </Flex>
        <Flex
          w="50%"
          pr={1}
          fontSize="sm"
          fontWeight="bold"
          align="center"
          justify="flex-end"
        >
          <Text mr={1 / 2} fontSize="sm" fontWeight="bold">
            Volume
          </Text>
          <Text fontSize="xs" fontWeight="normal" opacity="disabled">
            ({currentMarket?.quoteToken.symbol || "N/A"})
          </Text>
        </Flex>
      </Flex>
      {!topMakers.length ? (
        <Skeleton ribHeight={25} rows={6} />
      ) : (
        <Flex w="100%" h="250px" column>
          {topMakers
            .sort((a, b) => +b.total_volume - +a.total_volume)
            .slice(0, MAX_TOP_MAKERS)
            .map((topMaker, i) => (
              <Flex
                key={i}
                w="100%"
                mb={1 / 2}
                p={1}
                bg={!(i % 2) ? "contrast" : undefined}
                justify="space-between"
                align="center"
              >
                <Flex
                  w="50%"
                  cursor="pointer"
                  align="center"
                  justify="flex-start"
                  onClick={() => {
                    setCurrentTraderAddress(topMaker.maker);
                    setCurrentTab("trader");
                  }}
                >
                  <Text mr={1 / 2} opacity="disabled">
                    {i + 1}.
                  </Text>
                  <Text mr={1 / 2} c="secondary">
                    {formatPubkey(topMaker.maker)}
                  </Text>
                </Flex>
                <Flex w="50%" align="center" justify="flex-end">
                  <Text>{formatNumberToString(+topMaker.total_volume, 2)}</Text>
                </Flex>
              </Flex>
            ))}
        </Flex>
      )}
    </Flex>
  );
}
