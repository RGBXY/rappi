import ProductCard from '@/components/product/product-card'
import ProductTable from '@/components/product/product-table'
import React from 'react'

const ProductPage = () => {
  return (
    <div className='space-y-8' >
      <ProductCard/>
      <ProductTable/>
    </div>
  )
}

export default ProductPage
