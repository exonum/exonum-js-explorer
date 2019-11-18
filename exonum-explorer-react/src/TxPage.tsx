import React from 'react'
import { TxResponse } from 'exonum-explorer'
import { FailType } from './ui/Fail'
import { getContext } from './BlockchainContext'
import { useComponents, useRequestState } from './hooks'

interface TxPageProps {
  hash: string,
  children: (props: TxResponse) => JSX.Element,
  loader?: JSX.Element,
  fail?: FailType
}

const TxPage = ({ hash, children, loader, fail }: TxPageProps) => {
  const context = getContext()
  const { loading, data, error } =
    useRequestState<TxResponse>([hash], () => context.explorer.getTx(hash))
  const { loaderComponent, failProps, failComponent } = useComponents({ loader, error, fail })

  if (loading) return loaderComponent
  return data
    ? children(data)
    : failComponent(failProps)
}

export default TxPage
