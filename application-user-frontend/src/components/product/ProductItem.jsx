import React from 'react'
import { formatCurrency } from '../../utils/functionUtils'
import { Link } from 'react-router-dom'

function ProductItem({ product }) {
    return (
        <div className="product__item">
            <div
                className="product__item__pic set-bg"
                style={{ backgroundImage: `url(${product.thumbnail})` }}
            >
                <ul className="product__item__pic__hover">
                    <li>
                        <span><i className="fa fa-heart"></i></span>
                    </li>
                    <li>
                        <span><i className="fa fa-shopping-cart"></i></span>
                    </li>
                </ul>
            </div>
            <div className="product__item__text">
                <h6>
                    <Link to={`/san-pham/${product.id}/${product.slug}`}>{product.name}</Link>
                </h6>
                <div className={`${product.discountPrice != null ? 'product-item-price' : ''}`}>
                    {product.discountPrice != null && (
                        <h5 className="discount-price">{formatCurrency(product.discountPrice)}</h5>
                    )}
                    <h5 className={`${product.discountPrice != null ? 'original-price' : ''}`}>
                        {formatCurrency(product.price)}
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default ProductItem