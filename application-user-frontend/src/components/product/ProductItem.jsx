import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFavorite from '../../hooks/useFavorite';
import { formatCurrency } from '../../utils/functionUtils';
import ModalProductOverview from './ModalProductOverview';

function ProductItem({ product }) {
    const [showModal, setShowModal] = useState(false);
    const { isFavorite, handleFavorite } = useFavorite(product.id);

    const handleShowProductOverview = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowModal(true);
    }
    return (
        <>
            <Link to={`/san-pham/${product.id}/${product.slug}`} className="product__item">
                <div
                    className="product__item__pic set-bg"
                    style={{ backgroundImage: `url(${product.thumbnail})` }}
                >
                    <ul className="product__item__pic__hover">
                        <li
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleFavorite();
                            }}
                            className={`${isFavorite ? "active" : ""}`}>
                            <span><i className="fa-solid fa-heart"></i></span>
                        </li>
                        <li onClick={handleShowProductOverview}>
                            <span><i className="fa-regular fa-eye"></i></span>
                        </li>
                    </ul>
                </div>
                <div className="product__item__text">
                    <h6>{product.name}</h6>
                    <div className={`${product.discountPrice != null ? 'product-item-price' : ''}`}>
                        {product.discountPrice != null && (
                            <h5 className="discount-price">{formatCurrency(product.discountPrice)}</h5>
                        )}
                        <h5 className={`${product.discountPrice != null ? 'original-price' : ''}`}>
                            {formatCurrency(product.price)}
                        </h5>
                    </div>
                </div>
            </Link>

            {showModal && (
                <ModalProductOverview
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    product={product}
                />
            )}
        </>
    )
}

export default ProductItem