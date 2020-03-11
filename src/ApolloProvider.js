import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache  } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({
    uri: 'https://glacial-lake-96580.herokuapp.com/'
});

const authlink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    link: authlink.concat(httpLink),
    cache: new InMemoryCache()
}); // { addTypename: false }



export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);


