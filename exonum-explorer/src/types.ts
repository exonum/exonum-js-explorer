export interface Block {
  proposer_id: number;
  height: number;
  tx_count: number;
  prev_hash: string;
  tx_hash: string;
  state_hash: string;
}

export interface BlockResponse {
  block: Block[],
  precommits: string[];
  txs: string[];
  time: string;
}

export interface TxResponse {
  type: string,
  content: {
    debug: {
      time: string
    }
    message: string;
  },
  location: {
    block_height: number;
    position_in_block: number;
  },
  location_proof: any,
  status: {
    type: string;
  }
}

export interface BlockListResponse {
  range: {
    start: number;
    end: number;
  }
  blocks: Block[]
}

export interface ErrorType {
  status: string,
  message: string
}
