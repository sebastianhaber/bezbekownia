import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import App, { API_IP } from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

const client = new ApolloClient({
  uri: `http://${API_IP}:1337/graphql`,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
