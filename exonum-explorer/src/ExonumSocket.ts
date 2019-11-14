import EgComponent from '@egjs/component'

interface ESOptions {
  nodes: string | string[],
  basePath?: string,
  reconnectTimeout?: number,
  reconnectCount?: number
}

export const SocketActions = {
  'newBlock': 'newBlock',
  'unknownMessage': 'unknownMessage',
  'unparsableMessage': 'unparsableMessage',
  'connectionBroken': 'connectionBroken'
}

export class ExonumSocket extends EgComponent {
  private nodes: string[]
  private basePath: string
  private shouldDisconnect: boolean
  private connection!: WebSocket
  private node: number
  private reconnectTimeout: number
  private reconnectCount: number
  private reconnectLeft: number

  constructor ({ nodes, basePath = '/api/explorer/v1/', reconnectTimeout = 1000, reconnectCount = 10 }: ESOptions) {
    super()
    this.nodes = (typeof nodes === 'string' ? [nodes] : nodes)
      .map(item => item
        .replace('https', 'wss')
        .replace('http', 'ws'))
    this.shouldDisconnect = false
    this.node = 0
    this.reconnectTimeout = reconnectTimeout
    this.reconnectLeft = this.reconnectCount = reconnectCount
    this.basePath = basePath

    this.connect()
  }

  private connect = () => {
    const url = this.nodes[this.node]
    this.connection = new WebSocket(`${url}${this.basePath}blocks/subscribe`)
    this.connection.onopen = this.onOpen
    this.connection.onmessage = this.onMessage
    this.connection.onclose = this.onClose
  }

  private retry () {
    if (this.reconnectLeft === 0) {
      this.trigger(SocketActions.connectionBroken)
      return
    }
    const nodesCount = this.nodes.length - 1
    if (this.node < nodesCount) {
      this.node++
    } else if (this.node === nodesCount) {
      this.node = 0
    }
    setTimeout(this.connect, this.reconnectTimeout)
    this.reconnectLeft--
  }

  private onOpen = () => {
    this.reconnectLeft = this.reconnectCount
  }

  private onMessage = (e: MessageEvent) => {
    if (this.shouldDisconnect) return
    try {
      const message = JSON.parse(e.data)
      this.trigger(message.height
        ? SocketActions.newBlock
        : SocketActions.unknownMessage,
        { block: message })
    } catch (e) {
      this.trigger(SocketActions.unparsableMessage, e.data)
    }
  }

  private onClose = () => {
    if (this.shouldDisconnect) return
    this.retry()
  }

  public reconnect () {
    this.shouldDisconnect = false
    this.connect()
  }

  public disconnect () {
    this.shouldDisconnect = true
    this.connection.close()
  }
}
