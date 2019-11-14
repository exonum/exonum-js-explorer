import React from 'react'
import { getContext } from './BlockchainContext'
import { Block, BlockListResponse } from 'exonum-explorer'
import { FailType } from './ui/Fail'
import { useRequestState, useComponents } from './hooks'

type BlockListChild = (props: { blocks: Block[], blocksCount: number }) => JSX.Element

interface BlockListProps {
  children: BlockListChild,
  page: number,
  perPage?: number,
  loader?: JSX.Element,
  fail?: FailType
}

interface BlockListSocketProps {
  children: BlockListChild,
  blockList: Block[],
  page: number
}

const BlockList = ({ children, page, perPage = 500, loader, fail }: BlockListProps) => {
  const context = getContext()
  const { loading, data, error } = useRequestState<BlockListResponse>([page, perPage],
    () => context.explorer.getBlocks(page, perPage))
  const { loaderComponent, failProps, failComponent } = useComponents({ loader, error, fail })

  if (loading) return loaderComponent
  return data
    ? <BlockListSocket page={page} blockList={data.blocks}>{children}</BlockListSocket>
    : failComponent(failProps)
}

const BlockListSocket = ({ children, blockList, page }: BlockListSocketProps) => {
  const { explorer } = getContext()
  const [blocks, setBlocks] = React.useState(blockList)
  const blockSocket = React.useCallback(({ block }: any) => {
    setBlocks(blocks => {
      return ([block, ...blocks.splice(0, blocks.length - 1)])
    })
  }, [])

  React.useEffect(() => {
    if (explorer.socket && page === 1) explorer.socket.on('newBlock', blockSocket)
    return () => {
      if (explorer.socket) explorer.socket.off('newBlock', blockSocket)
    }
  }, [page])
  return children({ blocks, blocksCount: explorer.blocksCount })
}

export default BlockList
