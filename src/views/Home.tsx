import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";

import { useMediaQuery } from "../hooks/useMediaQuery";
import { fireAnimation } from "../styles/animation";
import { Flex, Path } from "../components/Layout";
import { Link, Text } from "../components/Typography";
import { PrimaryButton } from "../components/Buttons";
import { Icon } from "../components/Icons";

const HeroBackground = styled(Flex)<{ isInit: boolean }>`
  background: ${({ isInit, theme }) =>
    isInit
      ? `radial-gradient(
          circle at top,
          transparent 250px,
          ${theme.mode === "dark" ? "#000" : "#fff"} 550px
        )`
      : theme.mode === "dark"
      ? "#000"
      : "#fff"};
  pointer-events: none;
  button,
  a {
    pointer-events: all;
  }
`;

const HeroText = styled(Text)<{ isSmallScreen: boolean }>`
  font-size: ${({ isSmallScreen }) => (isSmallScreen ? "40px" : "70px")};
  line-height: ${({ isSmallScreen }) => (isSmallScreen ? "40px" : "70px")};
  text-align: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  ${fireAnimation};
`;

const HeroSwapElement = styled(Flex)`
  margin-top: 110px;
  border: 2px solid transparent;
  box-shadow: 0 10px 60px -20px ${({ theme }) => theme.palette.secondary};
  * {
    border: inherit;
    box-shadow: inherit;
  }
  &:hover {
    margin-top: 100px;
    border-color: ${({ theme }) => theme.palette.primary};
  }
`;

export function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.view.breakpoint.mobile);
  const [isInit, setIsInit] = useState(false);

  useEffect(() => setIsInit(true), []);

  return (
    <Flex w="95%" maxW={theme.view.gutter + "px"} mx="auto" my={2} column>
      <HeroSwapElement
        position="relative"
        w="95%"
        maxW="375px"
        h="390px"
        mx="auto"
        bg="contrast"
        radius={1}
        shadow
        cursor="pointer"
        transition
        onClick={() => navigate(Path.Swap)}
      >
        <Flex
          position="absolute"
          top={-10}
          left={0}
          w="100%"
          h="35px"
          bg="contrast"
          radius={10}
        />
        <Flex
          position="absolute"
          top={-4.5}
          right={0}
          w="80px"
          mx={1 / 3}
          h="35px"
          bg="contrast"
          radius={1 / 1.35}
        />
      </HeroSwapElement>
      <HeroBackground
        w="100vw"
        h="100%"
        position="absolute"
        top={0}
        posCenterX
        justify="center"
        style={{
          transitionDuration: theme.transition * 4 + "s",
          transitionTimingFunction: "ease-out",
        }}
        isInit={isInit}
      >
        <Flex
          w="100%"
          maxW="700px"
          mt={isInit ? (isSmallScreen ? 25 : 35) : isSmallScreen ? 30 : 40}
          opacity={isInit ? 1 : 0}
          centered
          column
          style={{
            transitionDuration: theme.transition * 8 + "s",
            transitionTimingFunction: "ease",
          }}
        >
          <HeroText c="primary" fontWeight="bold" isSmallScreen={isSmallScreen}>
            The liquidity backbone of DeFi.
          </HeroText>
          <Text
            my={2}
            fontSize={isSmallScreen ? "base" : "xl"}
            opacity="subtle"
          >
            Fully on-chain, non-custodial, and crankless.
          </Text>
          <Flex mb={4} centered column>
            <Link
              mb={1}
              href="https://github.com/Ellipsis-Labs/phoenix-v1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon mr={1 / 2} name="logo-github" />
              Read the code
            </Link>
            <Link
              href="https://twitter.com/ellipsis_labs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon mr={1 / 2} name="logo-twitter" />
              Stay in the loop
            </Link>
          </Flex>
          <PrimaryButton
            w="100%"
            maxW="300px"
            maxH="unset"
            style={{
              fontSize: "28px",
              lineHeight: "28px",
            }}
            onClick={() => navigate(Path.Swap)}
          >
            Let's go
          </PrimaryButton>
        </Flex>
      </HeroBackground>
    </Flex>
  );
}
