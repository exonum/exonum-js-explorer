import EgComponent from '@egjs/component'
import { ExonumSocket } from './ExonumSocket'
import { BlockResponse, TxResponse, BlockListResponse, Block } from './types'
import fetch from 'unfetch'

export interface ExonumExplorerProps {
  nodes: string | string[],
  ws?: string | string[],
  basePath?: string,
  socket?: boolean
}

const status = {
  noResponse: { status: 'no_response', message: 'Exonum nodes don\'t respond' },
  badParameters: { status: 'bad_parameters', message: 'Incorrect parameters passed' }
}

export const ExplorerActions = {
  'blocksCountUpdated': 'blocksCountUpdated'
}

export class ExonumExplorer extends EgComponent {
  private nodes: string[]
  private basePath: string
  blocksCount: number
  socket?: ExonumSocket

  constructor ({ nodes, basePath = '/api/explorer/v1/', ws, socket = true }: ExonumExplorerProps) {
    super()
    this.nodes = typeof nodes === 'string' ? [nodes] : nodes
    this.basePath = basePath
    if (socket) {
      this.socket = new ExonumSocket({ nodes: ws ? ws : this.nodes, basePath })
      this.socket.on('newBlock', ({ block }) => this.setCount(block.height))
    }
    this.blocksCount = 0
  }

  private setCount = (count: number) => {
    if (count <= this.blocksCount) return
    this.blocksCount = count
    this.trigger(ExplorerActions.blocksCountUpdated, { count })
  }

  private makeRequest (link: string, nodeId = 0, tryCount = 1): Promise<any> {
    const url = this.nodes[nodeId]
    return fetch(`${url}${this.basePath}${link}`)
      .then(r => {
        if (r.ok) return r.json()
        if (r.status >= 400 && r.status < 500) throw 400
        if (r.status >= 500) throw 500
      })
      .catch((e) => {
        if (e === 400) throw status.badParameters
        const nodeLength = this.nodes.length
        if (nodeId < nodeLength - 1) return this.makeRequest(link, nodeId + 1, tryCount + 1)
        if (nodeLength === tryCount) throw status.noResponse
      })
  }

  public getBlock (height: number): Promise<BlockResponse> {
    return this.makeRequest(`block?height=${height}`)
  }

  public getTx (hash: string): Promise<TxResponse> {
    return this.makeRequest(`transactions?hash=${hash}`)
  }

  public getBlocks (page: number, perPage: number): Promise<BlockListResponse> {
    let latest = ''
    if (page !== 1) {
      let latestPageBlock = this.blocksCount - (perPage * page)
      if (latestPageBlock < 0) throw Error(`Page ${page} don't exist`)
      latest = '&latest=' + latestPageBlock
    }
    return this.makeRequest(`blocks?count=${perPage}${latest}`)
      .then(data => {
        this.setCount(data.range.end - 1)
        return data
      })
  }
}
