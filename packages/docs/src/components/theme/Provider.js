import * as React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import { lightTheme, darkTheme } from './index';
import { baseStyles } from '../styles/GlobalStyles';

const GlobalStyle = createGlobalStyle`
  ${baseStyles}
`

class Themer extends React.Component {
  state = {
    isDarkThemeActive: false,
  };

  componentDidMount() {
    this.retrieveActiveTheme();
  }

  retrieveActiveTheme = () => {
    const isDarkThemeActive = JSON.parse(window.localStorage.getItem('isDarkThemeActive'));

    this.setState({ isDarkThemeActive });
  };

  toggleActiveTheme = () => {
    this.setState(prevState => ({ isDarkThemeActive: !prevState.isDarkThemeActive }));

    window.localStorage.setItem('isDarkThemeActive', JSON.stringify(!this.state.isDarkThemeActive));
  };

  render() {
    const { isDarkThemeActive } = this.state;
    const currentActiveTheme = isDarkThemeActive ? darkTheme : lightTheme;

    return (
      <>
        <GlobalStyle />
        <ThemeProvider theme={currentActiveTheme}>{this.props.children}</ThemeProvider>
      </>
    );
  }
}

export default Themer;
