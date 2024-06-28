import React from 'react';
import { Modal } from 'react-bootstrap';
import useCart from '../../hooks/useCart';
import ProductSlider from '../../pages/product/product-details/components/ProductSlider';
import { formatCurrency } from '../../utils/functionUtils';

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

const ModalProductOverview = ({ show, handleClose, product }) => {
    const {
        quantity,
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleAddToCart,
    } = useCart(product);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            backdrop="static"
            keyboard={false}
            id="modal-product-overview"
        >
            <Modal.Header closeButton>
                <Modal.Title as={"h5"}>Thông tin sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <ProductSlider
                            product={product}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <div className="product__details__text">
                            <h4 className="mb-3">{product.name}</h4>

                            <div className={`mb-3 product__details__price ${product.discountPrice != null ? 'has-discount' : ''}`}>
                                {product.discountPrice != null && (
                                    <span className={`${product.discountPrice != null ? 'discount-price' : ''}`}>
                                        {formatCurrency(product.discountPrice)}
                                    </span>
                                )}
                                <span className={`${product.discountPrice != null ? 'original-price' : ''}`}>
                                    {formatCurrency(product.price)}
                                </span>
                            </div>

                            <p className="mb-3" dangerouslySetInnerHTML={{ __html: product.description }}></p>

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
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalProductOverview;