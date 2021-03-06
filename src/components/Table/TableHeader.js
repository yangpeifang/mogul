import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import styled, { css } from "styled-components";
import { Icon } from "antd";
import { ifProp, switchProp, prop } from "styled-tools";
import { Flex, Item } from "../../utils";
import variable from "../variable";

const HeaderRow = styled(Flex)`
  color: #333;
  background-color: #fafafa;
  ${ifProp(
    "fixHeader",
    css`
      overflow-y: ${ifProp("needScroll", "scroll", "hidden")};
      overflow-x: hidden;
    `,
    css``
  )};
`;

const HeaderCellOuter = styled(Item).attrs({
  shrink: 0
})`
  ${ifProp(
    "bordered",
    css`
      border-right: 1px solid #e8e8e8;
      ${ifProp(
        "index",
        css``,
        css`
          border-left: 1px solid #e8e8e8;
        `
      )};
      border-top: 1px solid #e8e8e8;
    `,
    css``
  )};
  border-bottom: 1px solid #e8e8e8;
`;

const HeaderCellInner = styled(Flex).attrs({
  direction: "column",
  justifyContent: "center"
})`
  height: 100%;
  width: 100%;
  position: relative;
`;

const HeaderCell = styled(Item)`
  font-weight: bold;
  ${switchProp(prop("size", "small"), {
    small: css`
      padding: 6px 12px;
    `,
    middle: css`
      padding: 8px 16px;
    `,
    large: css`
      padding: 12px 18px;
    `
  })};
  ${prop =>
    prop.paddingRight
      ? css`
          padding-right: ${prop.paddingRight}px;
        `
      : ""};
`;

const SortIcon = styled(Icon)`
  font-size: 12px;
  cursor: pointer;
  ${ifProp(
    "highlight",
    css`
      color: ${variable.primary};
    `,
    css`
      color: ${variable.text.second};
    `
  )};
  transition: color 0.3s;
  position: absolute;
  top: 0;
  margin-left: 5px;
  &:hover {
    color: ${variable.primary};
  }
`;

@inject("table")
@observer
export default class extends Component {
  renderTitle({ title, headerMode, headerContainerProps = {} }, index) {
    const {
      table: { size }
    } = this.props;

    if (!headerMode) {
      return (
        <HeaderCell size={size} {...headerContainerProps}>
          {title}
        </HeaderCell>
      );
    }

    switch (headerMode.type) {
      case "sort":
        let sortByAsc = headerMode.value === "asc";
        let sortByDesc = headerMode.value === "desc";
        return (
          <HeaderCell size={size} paddingRight={26} {...headerContainerProps}>
            {title}
            <SortIcon
              highlight={sortByAsc ? "true" : undefined}
              type="caret-up"
              title={"asc"}
              style={{ top: "calc( 50% - 8px)" }}
              onClick={!sortByAsc && headerMode.onChange ? () => headerMode.onChange("asc") : null}
            />
            <SortIcon
              highlight={sortByDesc ? "true" : undefined}
              type="caret-down"
              title={"desc"}
              style={{ top: "calc( 50% - 2px)" }}
              onClick={
                !sortByDesc && headerMode.onChange ? () => headerMode.onChange("desc") : null
              }
            />
          </HeaderCell>
        );
      default:
        return <HeaderCell {...headerContainerProps}>{title}</HeaderCell>;
    }
  }

  render() {
    const {
      table: { columns, bordered, headerHeight, scrollX, scrollY, headerMinHeight },
      fixHeader
    } = this.props;

    return (
      <HeaderRow
        innerRef={header => (this.header = header)}
        fixHeader={fixHeader}
        needScroll={scrollY && scrollY !== "auto"}
        style={{ height: headerHeight, width: scrollX }}>
        {columns.map((column, index) => (
          <HeaderCellOuter
            bordered={bordered}
            key={column.key}
            flex={column.width ? undefined : column.flex ? column.flex : 1}
            style={{ width: column.width, minWidth: column.minWidth, minHeight: headerMinHeight }}
            index={index}>
            <HeaderCellInner>{this.renderTitle(column, index)}</HeaderCellInner>
          </HeaderCellOuter>
        ))}
      </HeaderRow>
    );
  }
}
