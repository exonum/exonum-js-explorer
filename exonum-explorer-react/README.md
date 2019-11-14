# Exonum Explorer React

[SIZE-IMG]: https://img.shields.io/bundlephobia/minzip/exonum-explorer-react
[SIZE-LINK]: https://bundlephobia.com/result?p=exonum-explorer-react
[![Size][SIZE-IMG]][SIZE-LINK]

###  Installation

```
npm i exonum-explorer-react
```

### Usage

```javascript
import { BlockchainExplorer, BlockPage, TxPage, BlockList } from 'exonum-explorer-react'

const Explorer = ()=> {
    return (
        <BlockchainExplorer nodes={['https://node1.com', 'https://node2.com']}>
          
          /* Block page */
          <BlockPage height='BLOCK_HEIGHT'>
            /* Block rendering function */
            {block => <div>{block.height}</div>}
          </BlockPage>

          /* Transaction page */
          <TxPage hash='TX_HASH'>
            /* Transaction rendering function */
            {tx => <div>{tx.type}</div>}
          </TxPage>

          /* Block list page */
          <BlockList page={1} perPage={200}>
            /* Block list rendering function */
            {({blocks})=>
                {<div>{blocks.map(
                  block => <div>{block.height}</div>)}
                </div>}}
          </BlockList>
        </BlockchainExplorer>)
}
```
