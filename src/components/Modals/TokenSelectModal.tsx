import { useState } from "react";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { useSolana } from "../../providers/SolanaProvider";
import { usePhoenix } from "../../providers/PhoenixProvider";
import { useSettings } from "../../providers/SettingsProvider";
import { useModals } from "../../providers/ModalsProvider";
import { formatPubkey } from "../../utils/format";
import { openTokenInExplorer } from "../../utils/explore";
import { Flex } from "../Layout";
import { Input } from "../Fields";
import { Text } from "../Typography";
import { Icon } from "../Icons";
import { Image } from "../Image";
import { Modal } from ".";

export function TokenSelectModal({
  title,
  currentToken,
  tokenOptions,
  onSelect,
}: {
  title?: string;
  currentToken: Phoenix.Token | null;
  tokenOptions: Array<Phoenix.Token>;
  onSelect: (token: Phoenix.Token) => void;
}) {
  const { cluster } = useSolana();
  const { client } = usePhoenix();
  const {
    settings: { explorer },
  } = useSettings();
  const { currentOpenModals, closeModal } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTokenOptions = tokenOptions.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.data.mintKey.toBase58() === searchQuery
  );

  return (
    <Modal
      title={title}
      isOpen={currentOpenModals.includes("token-select")}
      onClose={() => closeModal("token-select")}
    >
      <Input
        placeholder="Search by name, symbol or paste token mint"
        value={searchQuery}
        leftElement={<Icon name="search" />}
        onChange={(query) => setSearchQuery(query)}
      />
      <Flex w="100%" mt={2} centered column>
        {filteredTokenOptions.map((token) => {
          const isCurrentToken =
            currentToken?.data.mintKey.toBase58() ===
            token.data.mintKey.toBase58();

          return (
            <Flex
              key={token.data.mintKey.toBase58()}
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
              onClick={() => onSelect(token)}
            >
              <Flex centered>
                <Image
                  w="40px"
                  src={token.logoUri}
                  alt={`${token.name} Logo`}
                />
                <Flex ml={1} column>
                  <Flex mt={-0.2} centered>
                    <Text>{token.symbol}</Text>
                    <Flex
                      ml={1 / 2}
                      py={1 / 2}
                      px={1}
                      bg="contrast"
                      radius={1 / 2}
                      fontSize="xs"
                      onClick={() =>
                        openTokenInExplorer(
                          token.data.mintKey.toBase58(),
                          explorer,
                          cluster
                        )
                      }
                    >
                      {formatPubkey(token.data.mintKey)}
                      <Icon name="open-outline" ml={1 / 2} fontSize="xs" />
                    </Flex>
                  </Flex>
                  <Text fontSize="xs" opacity="subtle">
                    {token.name}
                  </Text>
                </Flex>
              </Flex>
              {!!client?.trader && (
                <Flex mt={-0.2} align="flex-end" column>
                  <Text fontSize="xs" opacity="subtle">
                    Wallet Balance
                  </Text>
                  <Text>
                    {client.trader.tokenBalances[token.data.mintKey.toBase58()]
                      ?.uiAmount || 0}
                  </Text>
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Modal>
  );
}
