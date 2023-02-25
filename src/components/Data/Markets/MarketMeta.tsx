import { useTheme } from "styled-components";
import * as Phoenix from "@ellipsis-labs/phoenix-sdk";

import { useSettings } from "../../../providers/SettingsProvider";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { openAccountInExplorer } from "../../../utils/explore";
import { formatPubkey } from "../../../utils/format";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Icon } from "../../Icons";
import { Skeleton } from "../../Loader";
import { useSolana } from "../../../providers/SolanaProvider";

export function MarketMeta({ market }: { market: Phoenix.Market | null }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const {
    settings: { explorer },
  } = useSettings();
  const { cluster } = useSolana();

  return (
    <Flex
      w="100%"
      maxW={isSmallScreen ? undefined : "325px"}
      h="100%"
      my={1}
      p={2}
      bg="contrast"
      radius={1}
      shadow
      column
    >
      <Text variant="label" mb={1}>
        Accounts
      </Text>
      {!market ? (
        <Skeleton rows={3} ribHeight={8} ribSpacing={1} />
      ) : (
        <>
          <Flex mb={1}>
            <Text mr={1 / 2}>Market:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(market.address, explorer, cluster)
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.address)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
          <Flex mb={1}>
            <Text mr={1 / 2}>Authority:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.data.header.authority,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.data.header.authority)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
          <Flex>
            <Text mr={1 / 2}>Fee Recipient:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.data.header.feeRecipient,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.data.header.feeRecipient)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
        </>
      )}
      <Flex mt={1.5} mb={1}>
        <Text variant="label" mr={1 / 2}>
          Base
        </Text>
        <Text fontSize="xs" fontWeight="normal" opacity="disabled">
          ({market?.baseToken.symbol || "N/A"})
        </Text>
      </Flex>
      {!market ? (
        <Skeleton rows={2} ribHeight={8} ribSpacing={2 / 3} />
      ) : (
        <>
          <Flex mb={1}>
            <Text mr={1 / 2}>Mint:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.baseToken.data.mintKey,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.baseToken.data.mintKey)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
          <Flex>
            <Text mr={1 / 2}>Vault:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.baseToken.data.vaultKey,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.baseToken.data.vaultKey)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
        </>
      )}
      <Flex mt={1.5} mb={1}>
        <Text variant="label" mr={1 / 2}>
          Quote
        </Text>
        <Text fontSize="xs" fontWeight="normal" opacity="disabled">
          ({market?.quoteToken.symbol || "N/A"})
        </Text>
      </Flex>
      {!market ? (
        <Skeleton rows={2} ribHeight={8} ribSpacing={2 / 3} />
      ) : (
        <>
          <Flex mb={1}>
            <Text mr={1 / 2}>Mint:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.quoteToken.data.mintKey,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.quoteToken.data.mintKey)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
          <Flex>
            <Text mr={1 / 2}>Vault:</Text>
            <Flex
              centered
              cursor="pointer"
              onClick={() =>
                openAccountInExplorer(
                  market.quoteToken.data.vaultKey,
                  explorer,
                  cluster
                )
              }
            >
              <Text mr={1 / 2} c="primary">
                {formatPubkey(market.quoteToken.data.vaultKey)}
              </Text>
              <Icon name="open-outline" c="primary" fontSize="xs" />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
}
