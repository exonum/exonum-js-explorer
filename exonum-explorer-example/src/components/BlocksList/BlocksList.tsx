import React from 'react'
import { getContext } from 'exonum-explorer-react'
import List from './List'
import { Pagination } from 'react-bootstrap'

export default () => {
  const [page, setPage] = React.useState<number>(1)
  const [pageCount, setPageCount] = React.useState<number | null>(null)
  const { explorer } = getContext()
  const perPage = 500
  const calcPagesCount = React.useCallback(
    ({ count }) => setPageCount(Math.ceil(count / perPage) - 1), [])
  React.useEffect(() => {
    explorer.on('blocksCountUpdated', calcPagesCount)
    return () => {explorer.off('blocksCountUpdated', calcPagesCount)}
  }, [calcPagesCount, explorer])

  const pageSet = (page: number) => () => setPage(page)

  return (<React.Fragment>
    <div className='d-flex justify-content-center mt-2'>
      {pageCount && <Pagination>
        <Pagination.First onClick={pageSet(1)} disabled={page === 1} />
        <Pagination.Prev onClick={pageSet(page - 1)} disabled={page === 1} />
        {page > 3 && <Pagination.Item onClick={pageSet(page - 3)}>{page - 3}</Pagination.Item>}
        {page > 2 && <Pagination.Item onClick={pageSet(page - 2)}>{page - 2}</Pagination.Item>}
        {page > 1 && <Pagination.Item onClick={pageSet(page - 1)}>{page - 1}</Pagination.Item>}
        <Pagination.Item active>{page}</Pagination.Item>
        {page < pageCount && <Pagination.Item onClick={pageSet(page + 1)}>{page + 1}</Pagination.Item>}
        {page + 1 < pageCount && <Pagination.Item onClick={pageSet(page + 2)}>{page + 2}</Pagination.Item>}
        {page + 2 < pageCount && <Pagination.Item onClick={pageSet(page + 3)}>{page + 3}</Pagination.Item>}
        <Pagination.Next onClick={pageSet(page + 1)} disabled={page + 1 > pageCount} />
        <Pagination.Last onClick={pageSet(pageCount)} disabled={page === pageCount} />
      </Pagination>}
    </div>
    <List page={page} perPage={perPage} />
  </React.Fragment>)
}
