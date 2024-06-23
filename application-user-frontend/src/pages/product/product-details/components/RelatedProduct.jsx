import React from 'react'
import ProductItem from '../../../../components/product/ProductItem'

function RelatedProduct({ products }) {
    return (
        <section className="related-product">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title related__product__title">
                            <h2>Sản phẩm liên quan</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                            <ProductItem
                                key={product.id}
                                product={product}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RelatedProduct