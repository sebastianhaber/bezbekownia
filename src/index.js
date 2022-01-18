import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import App, { API_IP } from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import { HelmetProvider } from 'react-helmet-async'

const client = new ApolloClient({
  uri: `${API_IP}/graphql`,
  cache: new InMemoryCache()
});

ReactDOM.render(
  // <React.StrictMode>
  <HelmetProvider>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </ApolloProvider>
    </HelmetProvider>
  // {/* </React.StrictMode> */}
  ,
  document.getElementById('root')
);
