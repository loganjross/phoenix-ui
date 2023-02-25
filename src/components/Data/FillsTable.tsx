import { useEffect, useState } from "react";

import { useSettings } from "../../providers/SettingsProvider";
import { useSolana } from "../../providers/SolanaProvider";
import { usePhoenix } from "../../providers/PhoenixProvider";
import { useData } from "../../providers/DataProvider";
import { ApiMarketData } from "../../providers/DataProvider";
import { openTxInExplorer } from "../../utils/explore";
import {
  formatDate,
  formatNumberToString,
  formatPubkey,
} from "../../utils/format";
import { MS_PER_SECOND } from "../../utils/time";
import { Flex } from "../Layout";
import { Text } from "../Typography";
import { Input } from "../Fields";
import { Icon } from "../Icons";
import { Skeleton } from "../Loader";

type SortingKey = "date" | "size";

const TABLE_SIZE = 25;

export function FillsTable({
  fills,
  noData,
}: {
  fills: ApiMarketData["fills"];
  noData?: boolean;
}) {
  const {
    settings: { explorer },
  } = useSettings();
  const { cluster } = useSolana();
  const { currentMarket } = usePhoenix();
  const { setCurrentTab, setCurrentTraderAddress } = useData();
  const [fillsToShow, setFillsToShow] = useState<ApiMarketData["fills"]>([]);
  const [sortedFills, setSortedFills] = useState<ApiMarketData["fills"]>([]);
  const [isSortingDesc, setIsSortingDesc] = useState(true);
  const [currentSortingKey, setCurrentSortingKey] =
    useState<SortingKey>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!isInit && !fillsToShow.length) {
      setFillsToShow(fills.slice(0, TABLE_SIZE));
      setIsInit(true);
    }
  }, [isInit, fills, fillsToShow.length]);

  useEffect(() => {
    async function filterFills(): Promise<ApiMarketData["fills"]> {
      const filteredFills: ApiMarketData["fills"] = [];
      for (let i = 0; i < fills.length; i++) {
        const fill = fills[i];
        const date = new Date(
          +fill.unix_timestamp * MS_PER_SECOND
        ).toLocaleDateString();
        const side = fill.trade_direction === 1 ? "Buy" : "Sell";
        if (
          date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          side.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fill.txid === searchQuery ||
          fill.taker === searchQuery ||
          fill.maker === searchQuery
        ) {
          filteredFills.push(fill);
        }
      }

      return filteredFills;
    }

    if (!searchQuery) {
      setFillsToShow(fills.slice(0, TABLE_SIZE));
    } else {
      filterFills().then((filteredFills) =>
        setFillsToShow(filteredFills.slice(0, TABLE_SIZE))
      );
    }
  }, [searchQuery, fills]);

  useEffect(() => {
    if (fillsToShow.length) {
      const sortedFills = fillsToShow.sort((a, b) => {
        if (currentSortingKey === "date") {
          return isSortingDesc
            ? +b.unix_timestamp - +a.unix_timestamp
            : +a.unix_timestamp - +b.unix_timestamp;
        } else {
          return isSortingDesc
            ? +b.base_units_filled - +a.base_units_filled
            : +a.base_units_filled - +b.base_units_filled;
        }
      });

      setSortedFills(sortedFills);
    }
  }, [fillsToShow, currentSortingKey, isSortingDesc]);

  return (
    <Flex
      position="relative"
      w="100%"
      minH="300px"
      my={1}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Text variant="label" mb={2}>
        Recent Trades
      </Text>
      <Input
        position="absolute"
        top={1}
        right={2}
        w="50%"
        maxW="400px"
        placeholder="Search by date, address, side or transaction ID"
        value={searchQuery}
        leftElement={<Icon name="search" />}
        onChange={(query) => setSearchQuery(query)}
        disabled={!fills.length}
      />
      {!fills.length && !noData && <Skeleton ribHeight={30} rows={10} />}
      {!!fills.length && (
        <Flex position="relative" w="100%" mt={1.5} overflow="scroll" column>
          <Flex w="100%" mb={1} px={1}>
            <Flex
              w="100%"
              minW="130px"
              cursor="pointer"
              onClick={() => {
                setCurrentSortingKey("date");
                setIsSortingDesc(!isSortingDesc);
              }}
            >
              <Text fontSize="sm" fontWeight="bold">
                Date
              </Text>
              <Icon
                ml={1 / 2}
                name={isSortingDesc ? "chevron-down" : "chevron-up"}
                opacity={currentSortingKey === "date" ? 1 : "disabled"}
              />
            </Flex>
            <Text w="100%" minW="130px" fontSize="sm" fontWeight="bold">
              TX ID
            </Text>
            <Flex w="100%" minW="130px" centered>
              <Text fontSize="sm" fontWeight="bold">
                Side
              </Text>
            </Flex>
            <Flex w="100%" minW="130px">
              <Text mr={1 / 4} fontSize="sm" fontWeight="bold">
                Price
              </Text>
              <Text fontSize="sm">
                ({currentMarket?.quoteToken.symbol || "N/A"})
              </Text>
            </Flex>
            <Flex
              w="100%"
              minW="130px"
              cursor="pointer"
              onClick={() => {
                setCurrentSortingKey("size");
                setIsSortingDesc(!isSortingDesc);
              }}
            >
              <Text mr={1 / 4} fontSize="sm" fontWeight="bold">
                Size
              </Text>
              <Text fontSize="sm">
                ({currentMarket?.baseToken.symbol || "N/A"})
              </Text>
              <Icon
                ml={1 / 2}
                name={isSortingDesc ? "chevron-down" : "chevron-up"}
                opacity={currentSortingKey === "size" ? 1 : "disabled"}
              />
            </Flex>
            <Text w="100%" minW="130px" fontSize="sm" fontWeight="bold">
              Taker
            </Text>
            <Text w="100%" minW="130px" fontSize="sm" fontWeight="bold">
              Maker
            </Text>
          </Flex>
          <Flex w="100%" h="550px" column>
            {sortedFills.map((fill: any, i) => (
              <Flex
                key={i}
                w="100%"
                p={1}
                bg={!(i % 2) ? "contrast" : undefined}
                align="center"
              >
                <Flex w="100%" minW="130px" column>
                  <Text fontSize="sm" opacity="subtle">
                    {formatDate(fill.unix_timestamp).date}
                  </Text>
                  <Text>{formatDate(fill.unix_timestamp).time}</Text>
                </Flex>
                <Flex
                  w="100%"
                  minW="130px"
                  align="center"
                  cursor="pointer"
                  onClick={() =>
                    openTxInExplorer(fill.txid || "", explorer, cluster)
                  }
                >
                  <Text mr={1 / 2} c="primary">
                    {formatPubkey(fill.txid)}
                  </Text>
                  <Icon name="open-outline" c="primary" fontSize="xs" />
                </Flex>
                <Flex w="100%" minW="130px" centered>
                  <Text c={fill.trade_direction === 1 ? "success" : "error"}>
                    {fill.trade_direction === 1 ? "Buy" : "Sell"}
                  </Text>
                </Flex>
                <Text w="100%" minW="130px">
                  {formatNumberToString(+fill.price)}
                </Text>
                <Text w="100%" minW="130px">
                  {formatNumberToString(+fill.base_units_filled)}
                </Text>
                <Flex
                  w="100%"
                  minW="130px"
                  align="center"
                  cursor="pointer"
                  onClick={() => {
                    setCurrentTraderAddress(fill.taker);
                    setCurrentTab("trader");
                  }}
                >
                  <Text mr={1 / 2} c="secondary">
                    {formatPubkey(fill.taker)}
                  </Text>
                </Flex>
                <Flex
                  w="100%"
                  minW="130px"
                  align="center"
                  cursor="pointer"
                  onClick={() => {
                    setCurrentTraderAddress(fill.maker);
                    setCurrentTab("trader");
                  }}
                >
                  <Text mr={1 / 2} c="secondary">
                    {formatPubkey(fill.maker)}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
