import React from 'react'
import { FailType } from './ui/Fail'
import { useComponents, useRequestState } from './hooks'
import { getContext } from './BlockchainContext'
import { BlockResponse } from 'exonum-explorer'

interface BlockPageProps {
  height: number,
  children: (props: BlockResponse) => JSX.Element,
  loader?: JSX.Element,
  fail?: FailType
}

const BlockPage = ({ height, children, loader, fail }: BlockPageProps) => {
  const context = getContext()
  const { loading, data, error } =
    useRequestState<BlockResponse>([height], () => context.explorer.getBlock(height))
  const { loaderComponent, failProps, failComponent } = useComponents({ loader, error, fail })

  if (loading) return loaderComponent
  return data
    ? children(data)
    : failComponent(failProps)
}

export default BlockPage
