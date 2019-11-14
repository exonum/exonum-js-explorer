import React from 'react'
import { ErrorType } from 'exonum-explorer'

const Fail = ({ status, message }: ErrorType) => {
  return (
    <div>{status}: {message}</div>
  )
}

export type FailType = typeof Fail

export default Fail
