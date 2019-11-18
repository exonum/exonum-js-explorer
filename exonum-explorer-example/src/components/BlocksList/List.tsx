import React from 'react'
import { BlockList } from 'exonum-explorer-react'

interface ListProps {
  page: number,
  perPage: number
}

export default ({ page, perPage }: ListProps) => {
  return (
    <BlockList page={page} perPage={perPage}>
      {({ blocks }) => {
        return <div className='d-flex justify-content-center flex-wrap'>
          {blocks.map(item => {
            return <div
              className='border m-1 p-1'
              style={{ width: 140 }}
              key={item.height}>
              <h5>{item.height}</h5>
              <h6>{item.tx_count}</h6>
              <p>transactions</p>
            </div>
          })}</div>
      }}
    </BlockList>
  )
}
