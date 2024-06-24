import React from 'react'
import DiscountedProducts from './DiscountedProducts'
import ProductsByCategory from './ProductsByCategory'

function ProductList({ data }) {
    return (
        <>
            <section className="featured spad">
                <DiscountedProducts />
                {data.map((item, index) => (
                    <ProductsByCategory key={index} item={item} />
                ))}
            </section>
        </>
    )
}

export default ProductList