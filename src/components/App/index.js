import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Provider, Observer } from "mobx-react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import styled from "styled-components";
import { Transition } from "react-spring";
import configuration from "../configuration";
import { Spin } from "../Indicator";
import { Flex, Item, flex } from "../../utils/grid";
import Sider from "./Sider";
const FullPageOverlay = styled(Flex).attrs({
  alignItems: "center",
  justifyContent: "center"
})`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.66);
  top: 0;
  left: 0;
`;

const RootContainer = styled(Flex).attrs({})`
  min-height: 100%;
  min-width: 960px;
`;

const AppContainer = styled(Item).attrs({
  flex: 1
})`
  ${flex({
    direction: "column"
  })};
`;

const Header = styled.div`
  height: 64px;
  padding: 0 30px;
  background-color: #fff;
`;

const Content = styled.div`
  padding: 20px 30px;
  background-color: #f0f2f5;
`;

const Footer = styled.div`
  background: #f0f2f5;
  padding: 24px 50px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
`;

export default class App extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    footer: PropTypes.any,
    header: PropTypes.any
  };

  static defaultProps = {
    loading: false
  };

  renderRoutes(routes) {
    let routeComponents = [];

    routes.forEach(
      ({ type, name = "", children = [], visible = true, disabled = false, ...route }) => {
        if (children.length > 0) {
          routeComponents = [...routeComponents, ...this.renderRoutes(children)];
        } else {
          switch (type) {
            case "redirect":
              routeComponents.push(<Redirect key={"redirect"} {...route} />);
              break;
            case "route":
            default:
              routeComponents.push(<Route key={name ? name : route.path} {...route} />);
              break;
          }
        }
      }
    );

    return routeComponents;
  }

  render() {
    const { children, footer, header } = this.props;
    const routes = children();
    return (
      <Fragment>
        <BrowserRouter>
          <Provider mogul={configuration}>
            <RootContainer>
              <Sider routes={routes.filter(route => route.type !== "redirect")} />
              <AppContainer direction={"column"} flex={1}>
                <Header>{header}</Header>
                <Content>
                  <Switch>{this.renderRoutes(routes)}</Switch>
                </Content>
                {footer ? <Footer style={{ textAlign: "center" }}>{footer}</Footer> : null}
              </AppContainer>
            </RootContainer>
          </Provider>
        </BrowserRouter>

        <Observer>
          {() => (
            <Transition
              from={{
                opacity: 0
              }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}>
              {configuration.fullPageLoading
                ? ({ opacity }) => (
                    <FullPageOverlay style={{ opacity }}>
                      <Spin size={100} />
                    </FullPageOverlay>
                  )
                : () => null}
            </Transition>
          )}
        </Observer>
      </Fragment>
    );
  }
}