import { useTheme } from "styled-components";

import { usePhoenix } from "../../../providers/PhoenixProvider";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { formatNumberToString } from "../../../utils/format";
import { Flex } from "../../Layout";
import { Skeleton } from "../../Loader";
import { Text } from "../../Typography";

const ORDERBOOK_SIDE_LENGTH = 5;

export function Orderbook({
  bids,
  asks,
}: {
  bids: Array<Array<string | number>>;
  asks: Array<Array<string | number>>;
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const { currentMarket } = usePhoenix();
  const slicedAsks = asks
    .slice(0, ORDERBOOK_SIDE_LENGTH - 1)
    .sort((a, b) => +b[0] - +a[0]);
  const slicedBids = bids.slice(0, ORDERBOOK_SIDE_LENGTH - 1);

  return (
    <Flex
      w="100%"
      maxW={isSmallScreen ? undefined : "325px"}
      my={1}
      mr={isSmallScreen ? undefined : 2}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Text variant="label" mb={2}>
        Orderbook
      </Text>
      <Flex w="100%" mb={1} align="center" justify="space-between">
        <Flex w="32.5%" centered>
          <Text fontSize="sm" fontWeight="bold">
            Bids
          </Text>
        </Flex>
        <Flex w="35%" px={1} centered>
          <Text mr={1 / 4} fontSize="sm" fontWeight="bold">
            Price
          </Text>
          <Text fontSize="xs">
            {currentMarket ? `(${currentMarket.quoteToken.symbol})` : ""}
          </Text>
        </Flex>
        <Flex w="32.5%" centered>
          <Text fontSize="sm" fontWeight="bold">
            Asks
          </Text>
        </Flex>
      </Flex>
      {!bids.length && !asks.length ? (
        <Skeleton ribHeight={27} rows={10} />
      ) : (
        <Flex w="100%" h="370px" overflow="scroll" column>
          {Array.from({ length: ORDERBOOK_SIDE_LENGTH }).map((_, i) => {
            const emptyRows = ORDERBOOK_SIDE_LENGTH - slicedAsks.length;

            return (
              <Flex
                key={i}
                w="100%"
                my={1 / 4}
                align="center"
                justify="space-between"
              >
                <Flex
                  w="33%"
                  h="32px"
                  px={1}
                  c="success"
                  bg="contrast"
                  align="center"
                  justify="flex-end"
                ></Flex>
                <Flex w="33%" h="32px" px={1} bg="contrast" centered>
                  {emptyRows > i
                    ? ""
                    : formatNumberToString(+slicedAsks[i - emptyRows][0])}
                </Flex>
                <Flex
                  w="33%"
                  h="32px"
                  px={1}
                  c="error"
                  bg="contrast"
                  align="center"
                  justify="flex-start"
                >
                  {emptyRows > i
                    ? ""
                    : formatNumberToString(+slicedAsks[i - emptyRows][1])}
                </Flex>
              </Flex>
            );
          })}
          {Array.from({ length: ORDERBOOK_SIDE_LENGTH }).map((_, i) => {
            const filledRows = slicedBids.length;

            return (
              <Flex
                key={ORDERBOOK_SIDE_LENGTH + i}
                w="100%"
                my={1 / 4}
                align="center"
                justify="space-between"
              >
                <Flex
                  w="33%"
                  h="32px"
                  px={1}
                  c="success"
                  bg="contrast"
                  align="center"
                  justify="flex-end"
                >
                  {i < filledRows
                    ? formatNumberToString(+slicedBids[i][1])
                    : ""}
                </Flex>
                <Flex w="33%" h="32px" px={1} bg="contrast" centered>
                  {i < filledRows
                    ? formatNumberToString(+slicedBids[i][0])
                    : ""}
                </Flex>
                <Flex
                  w="33%"
                  h="32px"
                  px={1}
                  c="error"
                  bg="contrast"
                  align="center"
                  justify="flex-start"
                ></Flex>
              </Flex>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
}
