import React from 'react'
import { ErrorType } from 'exonum-explorer'
import { FailType } from '../ui/Fail'
import { getContext } from '../BlockchainContext'

interface requestState<T> {
  loading: boolean,
  data?: T,
  error?: ErrorType
}

export const useRequestState = <T, > (params: any, request: () => Promise<any>) => {
  const [state, setState] = React.useState<requestState<T>>({ loading: true })
  React.useEffect(() => {
    setState({ loading: true })
    request()
      .then((data) => setState({ data, loading: false }))
      .catch(e => setState({ error: e, loading: false }))
  }, params)
  return Object.assign(state, { setState })
}

interface useComponentsParams {
  loader?: JSX.Element
  fail?: FailType,
  error?: ErrorType
}

export const useComponents = ({ loader, error, fail }: useComponentsParams) => {
  const context = getContext()
  const loaderComponent = loader || context.loader
  const failProps = error ? error : { status: 'error', message: 'Unknown error' }
  const failComponent = fail ? fail : context.fail
  return { loaderComponent, failComponent, failProps }
}
