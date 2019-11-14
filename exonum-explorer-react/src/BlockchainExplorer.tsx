import React from 'react'
import Loader from './ui/Loader'
import Fail, { FailType } from './ui/Fail'
import { ExonumExplorer, ExonumExplorerProps } from 'exonum-explorer'
import BlockchainContext from './BlockchainContext'

const { Provider } = BlockchainContext

interface BlockchainExplorerProps extends ExonumExplorerProps {
  children: JSX.Element[] | JSX.Element | string,
  loader?: JSX.Element,
  fail?: FailType,
}

const BlockchainExplorer = ({ children, loader, fail, ...rest }: BlockchainExplorerProps) => {
  const explorer = new ExonumExplorer(rest)
  return <Provider value={{
    explorer,
    loader: loader || Loader,
    fail: fail || Fail
  }}>
    {children}
  </Provider>
}

export default BlockchainExplorer
