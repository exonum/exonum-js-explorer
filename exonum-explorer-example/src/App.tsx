import React from 'react'
import BlocksList from './components/BlocksList/BlocksList'
import { BlockchainExplorer } from 'exonum-explorer-react'

const App: React.FC = () => {
  return (
    <div className='container-fluid'>
      <BlockchainExplorer
        nodes={['https://node1.com', 'https://node2.com']}
        ws={['wss://node1.com/ws','wss:node2.com/ws']}>
        <BlocksList />
      </BlockchainExplorer>
    </div>
  )
}

export default App
