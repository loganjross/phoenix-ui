import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { useTheme } from "styled-components";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { Flex } from ".";
import { Text } from "../Typography";
import {
  GhostButton,
  IconButton,
  SettingsButton,
  WalletButton,
} from "../Buttons";
import { Image } from "../Image";
import { Icon } from "../Icons";

interface Route {
  path: Path;
  label: string;
  iconName: string;
  isExternal: boolean;
  disabled: boolean;
}

export enum Path {
  Home = "/",
  Swap = "/swap",
  Data = "/data",
  Docs = "https://ellipsis-labs.gitbook.io/phoenix-dex/tRIkEFlLUzWK9uKO3W2V/getting-started/phoenix-overview",
}

export const ROUTES: Array<Route> = [
  {
    path: Path.Swap,
    label: "Swap",
    iconName: "swap-vertical",
    isExternal: false,
    disabled: false,
  },
  {
    path: Path.Data,
    label: "Stats",
    iconName: "analytics",
    isExternal: false,
    disabled: false,
  },
  {
    path: Path.Docs,
    label: "Docs",
    iconName: "code-slash",
    isExternal: true,
    disabled: false,
  },
];

export const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleNavigate(route: Route) {
    if (route.disabled) return;

    if (route.isExternal) {
      window.open(route.path, "_blank");
    } else {
      navigate(`${route.path}?${createSearchParams(params)}`);
    }
  }

  useEffect(() => {
    const body = document.querySelector("body");
    if (!body) return;

    if (isSmallScreen && isMenuOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }, [isMenuOpen, isSmallScreen]);

  return (
    <>
      {isSmallScreen && (
        <Flex
          position="relative"
          w="100%"
          p={2}
          align="center"
          justify="space-between"
          zIndex={1002}
        >
          <Image
            w="75px"
            src="/img/logomark.png"
            alt="Phoenix Logo"
            onClick={() => {
              navigate(`${Path.Home}?${createSearchParams(params)}`);
              setIsMenuOpen(false);
            }}
          />
          <Flex centered>
            <SettingsButton />
            <WalletButton />
            <IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Icon name={isMenuOpen ? "close" : "menu"} fontSize="xl" />
            </IconButton>
          </Flex>
        </Flex>
      )}
      <Flex
        position={isSmallScreen ? "fixed" : "relative"}
        top={0}
        right={!isSmallScreen || isMenuOpen ? 0 : -120}
        w="100vw"
        maxW={theme.view.gutter + "px"}
        h={isSmallScreen ? "100vh" : "75px"}
        mx="auto"
        p={2}
        align="center"
        justify={isSmallScreen ? "center" : "space-between"}
        column={isSmallScreen}
        transition={isSmallScreen}
        zIndex={1001}
        style={
          isSmallScreen
            ? {
                background: `rgba(${
                  theme.mode === "dark" ? "0, 0, 0" : "255, 255, 255"
                }, 0.95)`,
              }
            : undefined
        }
      >
        {!isSmallScreen && (
          <Flex w="33%" align="center" justify="flex-start">
            <Image
              w="75px"
              src="/img/logomark.png"
              alt="Phoenix Logo"
              onClick={() =>
                navigate(`${Path.Home}?${createSearchParams(params)}`)
              }
            />
          </Flex>
        )}
        <Flex
          w={isSmallScreen ? "100%" : "33%"}
          centered
          column={isSmallScreen}
        >
          {ROUTES.map((route) => (
            <GhostButton
              key={route.label}
              mx={1 / 2}
              my={isSmallScreen ? 2 : undefined}
              bg={route.path === location.pathname ? "contrast" : undefined}
              opacity={route.path !== location.pathname ? "disabled" : 1}
              disabled={route.disabled}
              onClick={() => {
                handleNavigate(route);
                if (isSmallScreen) setIsMenuOpen(false);
              }}
            >
              <Icon name={route.iconName} mr={1 / 2} />
              <Text fontSize={isSmallScreen ? "xl" : undefined}>
                {route.label}
              </Text>
            </GhostButton>
          ))}
        </Flex>
        {!isSmallScreen && (
          <Flex w="33%" align="center" justify="flex-end">
            <SettingsButton />
            <WalletButton />
          </Flex>
        )}
      </Flex>
    </>
  );
};
