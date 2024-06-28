import React from 'react';
import { MAX_RATING } from '../../../../data/constants';
import useCart from '../../../../hooks/useCart';
import useFavorite from '../../../../hooks/useFavorite';
import { formatCurrency } from '../../../../utils/functionUtils';

const parseProductStatus = (status) => {
    switch (status) {
        case "NOT_YET_SOLD":
            return "Chưa bán";
        case "AVAILABLE":
            return "Còn hàng";
        case "UNAVAILABLE":
            return "Hết hàng";
        case "CEASE":
            return "Ngừng kinh doanh";
        default:
            return "Chưa cập nhật";
    }
};

function ProductInfo({ product, reviews }) {
    const { isFavorite, handleFavorite } = useFavorite(product.id);
    const {
        quantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleAddToCart,
    } = useCart(product);

    return (
        <>
            <div className="product__details__text">
                <h3>{product.name}</h3>

                <div className="product__details__rating d-flex align-items-center">
                    <div className="rating me-1">
                        {[...Array(Math.ceil(product.rating))].map((_, index) => (
                            <span key={index} className="active"><i className="fa fa-star"></i></span>
                        ))}
                        {[...Array(MAX_RATING - Math.ceil(product.rating))].map((_, index) => (
                            <span key={index} className="unactive"><i className="fa fa-star"></i></span>
                        ))}
                    </div>
                    <span>(<span className="review-count d-inline-block m-0">{reviews.length}</span> đánh giá)</span>
                </div>

                <div className={`product__details__price ${product.discountPrice != null ? 'has-discount' : ''}`}>
                    {product.discountPrice != null && (
                        <span className={`${product.discountPrice != null ? 'discount-price' : ''}`}>
                            {formatCurrency(product.discountPrice)}
                        </span>
                    )}
                    <span className={`${product.discountPrice != null ? 'original-price' : ''}`}>
                        {formatCurrency(product.price)}
                    </span>
                </div>

                <p dangerouslySetInnerHTML={{ __html: product.description }}></p>

                {product.status == 'AVAILABLE' && (
                    <>
                        <div className="product__details__quantity">
                            <div className="quantity">
                                <div className="pro-qty">
                                    <span
                                        className="dec qtybtn"
                                        onClick={handleDecreaseQuantity}
                                    >-</span>
                                    <input type="text" value={quantity} disabled />
                                    <span
                                        className="inc qtybtn"
                                        onClick={handleIncreaseQuantity}
                                    >+</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="border-0 primary-btn btn-add-to-card"
                            onClick={handleAddToCart}
                        >THÊM VÀO GIỎ HÀNG</button>
                        <button
                            className="heart-icon btn-add-to-wishlist"
                            style={{
                                color: isFavorite ? "#7fad39" : "#6f6f6f",
                                border: isFavorite ? "1px solid #7fad39" : "1px solid transparent"
                            }}
                            onClick={() => handleFavorite()}
                        >
                            <span><i className="fa-solid fa-heart"></i></span>
                        </button>
                    </>
                )}

                <ul>
                    <li>
                        <b>Tình trạng: </b>
                        <span>{parseProductStatus(product.status)}</span>
                    </li>
                    {product.status == 'AVAILABLE' && (
                        <li>
                            <b>Số lượng: </b>
                            <span>{product.stockQuantity}</span>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default ProductInfo