import React from 'react'
import { FailType } from './ui/Fail'
import { ExonumExplorer } from 'exonum-explorer'

interface ContextProps {
  explorer: ExonumExplorer,
  loader: JSX.Element,
  fail: FailType
}

const context = React.createContext<ContextProps | null>(null)

export const getContext = () => {
  const ctx = React.useContext(context)
  if (ctx === null) throw new Error(' Should be used inside BlockchainExplorer')
  return ctx
}

export default context
