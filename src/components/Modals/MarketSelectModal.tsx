import { useState } from "react";

import { useSettings } from "../../providers/SettingsProvider";
import { useSolana } from "../../providers/SolanaProvider";
import { usePhoenix } from "../../providers/PhoenixProvider";
import { useModals } from "../../providers/ModalsProvider";
import { formatPubkey } from "../../utils/format";
import { openAccountInExplorer } from "../../utils/explore";
import { Flex } from "../Layout";
import { Input } from "../Fields";
import { Text } from "../Typography";
import { Icon } from "../Icons";
import { Image } from "../Image";
import { Modal } from ".";

export function MarketSelectModal() {
  const {
    settings: { explorer },
  } = useSettings();
  const { cluster } = useSolana();
  const { client, currentMarket, changeMarket } = usePhoenix();
  const marketOptions = client?.markets || [];
  const { currentOpenModals, closeModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTokenOptions = marketOptions.filter(
    (market) =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.address.toBase58() === searchQuery
  );

  return (
    <Modal
      title="Select Market"
      isOpen={currentOpenModals.includes("market-select")}
      onClose={() => closeModal("market-select")}
    >
      <Input
        placeholder="Search by name or paste market address"
        value={searchQuery}
        leftElement={<Icon name="search" />}
        onChange={(query) => setSearchQuery(query)}
      />
      <Flex w="100%" mt={2} centered column>
        {filteredTokenOptions.map((market) => {
          const isCurrentToken =
            currentMarket?.address.toBase58() === market.address.toBase58();

          return (
            <Flex
              key={market.address.toBase58()}
              w="100%"
              align="center"
              justify="space-between"
              mb={1}
              py={1}
              px={1.5}
              bg="contrast"
              border={isCurrentToken ? "success" : undefined}
              radius={1}
              shadow={isCurrentToken}
              cursor="pointer"
              onClick={() => changeMarket(market.address.toBase58())}
            >
              <Flex>
                <Image
                  w="40px"
                  src={market.baseToken.logoUri}
                  alt={`${market.name} Logo`}
                />
                <Flex ml={1} column>
                  <Flex mt={-0.2} centered>
                    <Text>{market.name}</Text>
                    <Flex
                      ml={1}
                      py={1 / 2}
                      px={1}
                      bg="contrast"
                      radius={1 / 2}
                      fontSize="xs"
                      onClick={() =>
                        openAccountInExplorer(market.address, explorer, cluster)
                      }
                    >
                      {formatPubkey(market.address)}
                      <Icon name="open-outline" ml={1 / 2} fontSize="xs" />
                    </Flex>
                  </Flex>
                  <Text fontSize="xs" opacity="subtle">
                    {market.baseToken.name}/{market.quoteToken.name}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Modal>
  );
}
