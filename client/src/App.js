import React from 'react'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Title from './components/layout/Title'

import { Layout } from 'antd'
import AddPerson from './components/forms/AddPerson'
import AddBoat from './components/forms/AddBoat'

import './App.css'
import People from './components/lists/People'
import Boats from './components/lists/Boats'

const { Content } = Layout

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App = () => (
  <ApolloProvider client={client}>
    <div className='container'>
      <Content className='App'>
        <Title />
        <AddPerson />
        <People />

        <h1>Boats</h1>
        <AddBoat />
        <Boats />
      </Content>
    </div>
  </ApolloProvider>
)

export default App
