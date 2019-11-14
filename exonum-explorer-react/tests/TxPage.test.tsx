import React from 'react'
import mock from 'xhr-mock'
import { render } from '@testing-library/react'
import { BlockchainExplorer, TxPage } from '../src'

const hash = 'a798cbf9a2c7e7728da9e7f2433d377d210bbc8a481e6aeabbcf748b78d85864'
const mockTx = {
  'type': 'committed',
  'content': {
    'debug': { 'time': '2019-10-22T17:56:47.678218926Z' }
  },
  'location': { 'block_height': 12, 'position_in_block': 3 },
  'status': { 'type': 'success' }
}

describe('<TxPage />', () => {
  beforeEach(() => {
    console.error = jest.fn()
    mock.setup()
  })
  afterEach(() => mock.teardown())

  it('without BlockchainExplorer throws', () => {
    expect(() => render(
      <TxPage hash={hash} children={() => <div />} />))
      .toThrow('Should be used inside BlockchainExplorer')
  })

  it('should call child function with response, and render it', async () => {
    mock.get(`https://home.com/api/explorer/v1/transactions?hash=${hash}`, {
      status: 200,
      body: JSON.stringify(mockTx)
    })
    const mockChild = jest.fn(() => <div>Hello Tx</div>)
    const { findByText } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <TxPage hash={hash} children={mockChild} />
      </BlockchainExplorer>)

    await findByText(/Hello/)
    expect(mockChild.mock.calls.length).toBe(1)
    expect(mockChild.mock.calls[0]).toEqual([mockTx])
  })

  it('should show default error screen on 500 error', async () => {
    mock.get('https://home.com/api/explorer/v1/block?height=55', {
      status: 500
    })
    const { findByText } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <TxPage hash={hash} children={() => <div />} />
      </BlockchainExplorer>)

    const error = await findByText(/no_response/)
    expect(error.textContent).toBe('no_response: Exonum nodes don\'t respond')
  })
})
