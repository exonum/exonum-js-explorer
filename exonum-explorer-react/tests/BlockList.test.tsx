import React from 'react'
import { BlockList, BlockchainExplorer } from '../src/index'
import { render } from '@testing-library/react'
import BlockList1 from './mock/BlockList1.json'
import BlockList2 from './mock/BlockList2.json'
import mock from 'xhr-mock'
import WS from 'jest-websocket-mock'

describe('<BlockList />', () => {
  beforeEach(() => {
    console.error = jest.fn()
    mock.setup()
  })
  afterEach(() => mock.teardown())
  it('without BlockchainExplorer throws', () => {
    expect(() => render(<BlockList page={1} children={() => <div />} />))
      .toThrow('Should be used inside BlockchainExplorer')
  })
  it('should call child function with response, and render it', async () => {
    mock.get('https://home.com/api/explorer/v1/blocks?count=100', {
      status: 200,
      body: JSON.stringify(BlockList1)
    })
    const mockChild = jest.fn(({ blocks }) => <div>{blocks[0].height}</div>)
    const { container, findByText } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <BlockList page={1} perPage={100} children={mockChild} />
      </BlockchainExplorer>)
    expect(container.textContent).toBe('Loading...')
    await findByText('99')
    expect(mockChild.mock.calls.length).toBe(1)
    expect(mockChild.mock.calls[0]).toMatchSnapshot()
  })
  it('after first render should update on new socket blocks', async () => {
    mock.get('https://home.com/api/explorer/v1/blocks?count=100', {
      status: 200,
      body: JSON.stringify(BlockList1)
    })
    const server = new WS('wss://home.com/api/explorer/v1/blocks/subscribe')
    const mockChild = jest.fn(({ blocks }) => <div>{blocks[0].height}</div>)
    const { container, findByText } = render(
      <BlockchainExplorer nodes='https://home.com'>
        <BlockList page={1} perPage={100} children={mockChild} />
      </BlockchainExplorer>
    )
    await findByText('99')
    await server.connected
    server.send(JSON.stringify(BlockList2.blocks[BlockList2.blocks.length - 1]))
    await findByText('100')

    expect(mockChild.mock.calls.length).toBe(2)
    expect(mockChild.mock.calls[1]).toMatchSnapshot()
  })
})
