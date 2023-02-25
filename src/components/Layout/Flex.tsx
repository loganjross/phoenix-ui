import styled from "styled-components";

import { BaseProps, baseStyles } from "../../styles/base";

/**
 * Flex Properties
 * @description Layout options for the flexbox
 *
 * @property {boolean} centered - centers the content
 * @property {boolean} column - sets `flex-direction` to `column`
 * @property {boolean} wrapped - Sets `flex-wrap` to `wrap`
 * @property {string} justify - `justify-content`
 * @property {string} align - `align-items`
 * @property {string} overflow - `overflow`
 * @property {string} overflowY - `overflow-y`
 * @property {string} overflowX - `overflow-x`
 */
export interface FlexProps extends React.HTMLProps<HTMLDivElement> {
  centered?: boolean;
  column?: boolean;
  wrapped?: boolean;
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-evenly";
  align?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-evenly";
  overflow?: "hidden" | "scroll" | "auto";
  overflowY?: "hidden" | "scroll" | "auto";
  overflowX?: "hidden" | "scroll" | "auto";
}

export const Flex = styled.div<BaseProps & FlexProps>`
  display: flex;
  width: ${({ w }) => w || ""};
  height: ${({ h }) => h || ""};
  align-items: ${({ centered, align }) =>
    centered ? "center" : align || "flex-start"};
  justify-content: ${({ centered, justify }) =>
    centered ? "center" : justify || "flex-start"};
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  flex-wrap: ${({ wrapped }) => (wrapped ? "wrap" : "nowrap")};
  overflow: ${({ overflow }) => overflow || ""};
  overflow-y: ${({ overflowY }) => overflowY || ""};
  overflow-x: ${({ overflowX }) => overflowX || ""};

  ${baseStyles}
`;
