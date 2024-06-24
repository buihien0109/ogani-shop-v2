import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAddToCartMutation } from '../../app/apis/cart.api';
import { addToCart as addToCartLocal } from '../../app/slices/cart.slice';
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
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const [count, setCount] = useState(1);

    const [addToCart, { isLoading }] = useAddToCartMutation();

    const handleIncreaseQuantity = () => {
        const newCount = count + 1;
        if (newCount <= product.stockQuantity) {
            setCount(count => count + 1);
        } else {
            toast.warn("Số lượng sản phẩm trong kho không đủ");
        }
    };

    const handleDecreaseQuantity = () => {
        if (count > 1) {
            setCount(count => count - 1);
        }
    }

    const handleAddToCart = (productId, quantity) => {
        if (isAuthenticated) {
            addToCart({ productId, quantity })
                .unwrap()
                .then((response) => {
                    handleClose();
                    toast.success("Thêm vào giỏ hàng thành công");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message)
                })
        } else {
            const productInCart = cart.find(item => item.productId == productId);
            if (productInCart) {
                const newQuantity = productInCart.quantity + quantity;
                if (newQuantity <= product.stockQuantity) {
                    dispatch(addToCartLocal({ productId, quantity }));
                    handleClose();
                    toast.success("Thêm vào giỏ hàng thành công");
                } else {
                    toast.warn("Số lượng sản phẩm trong kho không đủ");
                }
            }
        }
    }

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
                                                    onClick={() => handleDecreaseQuantity()}
                                                >-</span>
                                                <input type="text" value={count} disabled />
                                                <span
                                                    className="inc qtybtn"
                                                    onClick={() => handleIncreaseQuantity()}
                                                >+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="border-0 primary-btn btn-add-to-card"
                                        onClick={() => handleAddToCart(product.id, count)}
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