import { useEffect, useState } from "react";
import styled from "styled-components";

import {
  DEFAULT_RPC_ENDPOINTS,
  useSettings,
} from "../../../providers/SettingsProvider";
import { getAveTps } from "../../../utils/solana";
import { validateRpcUrl } from "../../../utils/validate";
import { Theme } from "../../../styles/theme";
import { Flex } from "../../Layout";
import { Text } from "../../Typography";
import { Input } from "../../Fields";
import { Icon } from "../../Icons";

const TpsIndicator = styled(Flex)`
  &::before {
    content: "";
    position: absolute;
    border-radius: 50px;
    background: inherit;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0.2;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      top: -2px;
      left: -2px;
    }
    50% {
      opacity: ${({ theme }) => theme.opacity.disabled};
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      top: -4px;
      left: -4px;
    }
    100% {
      opacity: 0.2;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      top: -2px;
      left: -2px;
    }
  }
`;

export function RpcSettings() {
  const {
    settings: { rpcEndpoint },
    updateSetting,
  } = useSettings();
  const [rpcsAveTps, setRpcsAveTps] = useState<Record<string, number>>({});
  const [newCustomEndpoint, setNewCustomEndpoint] = useState(
    rpcEndpoint.custom.replace("https://", "").replace("http://", "")
  );

  const endpointOptions: Record<string, string> = {
    "mainnet-beta": DEFAULT_RPC_ENDPOINTS["mainnet-beta"],
    devnet: DEFAULT_RPC_ENDPOINTS.devnet,
    custom: rpcEndpoint.custom,
  };

  useEffect(() => {
    async function setAveTps() {
      for (const endpoint in endpointOptions) {
        const aveTps = await getAveTps(endpointOptions[endpoint]);
        rpcsAveTps[endpoint] = aveTps;
        setRpcsAveTps({ ...rpcsAveTps });
      }
    }

    setAveTps();
    const tpsInterval = setInterval(setAveTps, 10000);

    return () => clearInterval(tpsInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rpcEndpoint.custom]);

  return (
    <Flex w="100%" pt={1 / 2} align="center" justify="space-between" wrapped>
      {Object.keys(endpointOptions).map((option: string) => {
        const isConnected = rpcEndpoint.connected === endpointOptions[option];
        const tps = rpcsAveTps[option];
        let tpsColor: keyof Theme["palette"] = "text";
        if (tps > 0) {
          tpsColor = tps < 1200 ? "error" : "success";
        }

        return (
          <Flex
            key={option}
            w="100%"
            align="center"
            justify="space-between"
            mb={1}
            py={1}
            px={1.5}
            bg="contrast"
            border={isConnected ? "success" : undefined}
            radius={1}
            shadow={isConnected}
            cursor="pointer"
            onClick={() => {
              if (option === "custom" && !rpcEndpoint.custom) return;

              updateSetting("rpcEndpoint", {
                ...rpcEndpoint,
                connected: endpointOptions[option],
              });
            }}
          >
            <Flex centered>
              {!!tps && (
                <TpsIndicator
                  position="relative"
                  w="10px"
                  h="10px"
                  mr={1}
                  bg={tpsColor}
                  radius="round"
                />
              )}
              <Text
                pr={1 / 2}
                c={tpsColor}
                fontSize="sm"
                fontWeight="bold"
                opacity={!!tps ? 1 : "disabled"}
                style={{ whiteSpace: "nowrap" }}
              >
                {!!tps ? `${tps} TPS` : "N/A"}
              </Text>
            </Flex>
            <Flex w="75%" align="flex-end" column>
              {option === "custom" ? (
                <Flex w="100%">
                  <Input
                    w="100%"
                    value={newCustomEndpoint
                      .replace("https://", "")
                      .replace("http://", "")}
                    placeholder="your-rpc-endpoint.com"
                    leftElement={
                      <Text
                        pr={1 / 2}
                        c={isConnected ? "success" : "text"}
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        https://
                      </Text>
                    }
                    rightElement={
                      <Icon
                        name="wifi"
                        pr={1 / 2}
                        c={isConnected ? "success" : "text"}
                      />
                    }
                    onChange={(value: string) => {
                      const fullUrl =
                        "https://" +
                        value.replace("https://", "").replace("https://", "");
                      setNewCustomEndpoint(fullUrl);
                      validateRpcUrl(fullUrl).then((isValid) => {
                        updateSetting("rpcEndpoint", {
                          connected: isValid ? fullUrl : rpcEndpoint.connected,
                          custom: isValid ? fullUrl : rpcEndpoint.custom,
                        });
                      });
                    }}
                    onBlur={() => {
                      validateRpcUrl(newCustomEndpoint).then((isValid) => {
                        if (!isValid) {
                          updateSetting("rpcEndpoint", {
                            connected: DEFAULT_RPC_ENDPOINTS["mainnet-beta"],
                            custom: "",
                          });
                        }
                      });
                    }}
                  />
                </Flex>
              ) : (
                <Text mb={1 / 2}>
                  {option.includes("mainnet")
                    ? "Mainnet Beta"
                    : option[0].toUpperCase() + option.slice(1)}
                </Text>
              )}
              {option !== "custom" && (
                <Text
                  c={isConnected ? "success" : undefined}
                  opacity={isConnected ? 1 : "disabled"}
                  fontSize="xs"
                >
                  {isConnected ? "Connected" : "Not connected"}
                </Text>
              )}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
}
