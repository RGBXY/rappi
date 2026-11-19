import StockCard from '@/components/stok/stok-card'
import StockTable from '@/components/stok/stok-table'
import React from 'react'

const ProductPage = () => {
  return (
    <div className='space-y-8' >
      <StockCard />
      <StockTable />
    </div>
  )
}

export default ProductPage
