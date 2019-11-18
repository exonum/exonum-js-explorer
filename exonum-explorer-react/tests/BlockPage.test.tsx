import React from 'react'
import { render } from '@testing-library/react'
import mock from 'xhr-mock'
import { BlockPage, BlockchainExplorer } from '../src/index'

const mockBlock = {
  'block': {
    'proposer_id': 1,
    'height': 12,
    'tx_count': 4,
    'prev_hash': '2aaa5af851e49ecb3b920c1a96ed1243314149524427da3f4c3ca0baa4dbe877',
    'tx_hash': 'c45a529666ff069e65dbbd2c19c30ac95d7a0f0f74366b1833825b46de4dfd0c',
    'state_hash': '54a7841d4c2586b277a8183d0f123318c963daa8a6d4cf4b6df4fb7bfed8674f'
  },
  'time': '2019-10-22T17:56:48.471361350Z'
}

describe('<BlockPage />', () => {
  beforeEach(() => {
    console.error = jest.fn()
    mock.setup()
  })
  afterEach(() => mock.teardown())

  it('without BlockchainExplorer throws', () => {
    expect(() => render(<BlockPage height={12} children={() => <div />} />))
      .toThrow('Should be used inside BlockchainExplorer')
  })

  it('should call child function with response, and render it', async () => {
    mock.get('https://home.com/api/explorer/v1/block?height=12', {
      status: 200,
      body: JSON.stringify(mockBlock)
    })
    const mockChild = jest.fn(() => <div>Hello Blocks</div>)
    const { findByText } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <BlockPage height={12} children={mockChild} />
      </BlockchainExplorer>)

    await findByText(/Hello/)
    expect(mockChild.mock.calls.length).toBe(1)
    expect(mockChild.mock.calls[0]).toEqual([mockBlock])
  })

  it('should show default error screen on 500 error', async () => {
    mock.get('https://home.com/api/explorer/v1/block?height=55', {
      status: 500
    })
    const { findByText } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <BlockPage height={55} children={() => <div />} />
      </BlockchainExplorer>)

    const error = await findByText(/no_response/)
    expect(error.textContent).toBe('no_response: Exonum nodes don\'t respond')
  })

  it('should show default preloader and error screen on 400 error', async () => {
    mock.get('https://home.com/api/explorer/v1/block?height=55', {
      status: 400
    })
    const { findByText, container } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <BlockPage height={55} children={() => <div />} />
      </BlockchainExplorer>)

    expect(container.textContent).toBe('Loading...')

    const error = await findByText(/bad_parameters/)
    expect(error.textContent).toBe('bad_parameters: Incorrect parameters passed')
  })

  it('should show custom preloader and error screen on error', async () => {
    mock.get('https://home.com/api/explorer/v1/block?height=55', {
      status: 400
    })
    const { findByText, container } = render(
      <BlockchainExplorer nodes='https://home.com' socket={false}>
        <BlockPage
          fail={({ message }) =>
            <div>Error is: {message}</div>}
          loader={<div>This is a custom preloader</div>}
          height={55}
          children={() => <div />} />
      </BlockchainExplorer>)

    expect(container.textContent).toBe('This is a custom preloader')

    const error = await findByText(/Error/)
    expect(error.textContent).toBe('Error is: Incorrect parameters passed')
  })
})

