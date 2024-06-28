import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import breadcrumb from "../../../public/breadcrumb.jpg";
import { useGetCartQuery } from '../../app/apis/cart.api';
import { useChangeQuantityCartItemByIdMutation, useDeleteCartItemMutation } from '../../app/apis/cartItem.api';
import { useGetProductsInIdsQuery } from '../../app/apis/product.api';
import { changeQuantityItem, deleteFromCart } from '../../app/slices/cart.slice';
import ErrorPage from '../../components/error/ErrorPage';
import Loading from '../../components/loading/Loading';
import ModalConfirm from '../../components/modal/modal-confirm/ModalConfirm';
import useModalConfirm from '../../components/modal/modal-confirm/useModalConfirm';
import { formatCurrency } from '../../utils/functionUtils';

const getLocalCart = (cartState, products) => {
    const localCart = {};
    const cartItems = [];
    cartState.forEach((cartItem, index) => {
        const product = products?.find(product => product.id === cartItem.productId);
        if (product) {
            cartItems.push({
                id: index + 1,
                product: product,
                quantity: cartItem.quantity,
                totalAmount: product.discountPrice ? product.discountPrice * cartItem.quantity : product.price * cartItem.quantity
            });
        }
    });
    localCart.id = 1;
    localCart.cartItems = cartItems;
    localCart.totalAmount = cartItems.reduce((total, cartItem) => total + cartItem.totalAmount, 0);
    return localCart;
}

function ShoppingCart() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const { isOpen, openModal, closeModal } = useModalConfirm();
    const [cartItemSelected, setCartItemSelected] = useState(null);
    const cart = useSelector(state => state.cart);
    const productIds = cart.map(cartItem => cartItem.productId);

    const {
        data: userCart,
        isLoading: isLoadingGetCart,
        isError: isErrorGetCart,
        refetch: refetchGetCart
    } = useGetCartQuery(undefined, { skip: !isAuthenticated });

    const {
        data: products,
        isLoading: isLoadingGetProducts,
        isError: isErrorGetProducts
    } = useGetProductsInIdsQuery(productIds, { skip: isAuthenticated })

    const [changeQuantityCartItemById, { isLoading: isLoadingChangeQuantityCartItemById }] = useChangeQuantityCartItemByIdMutation();
    const [deleteCartItem, { isLoading: isLoadingDeleteCartItem }] = useDeleteCartItemMutation()

    if (isLoadingGetCart || isLoadingGetProducts) {
        return <Loading />
    }

    if (isErrorGetCart || isErrorGetProducts) {
        return <ErrorPage />
    }

    const localCart = getLocalCart(cart, products);
    const renderCart = isAuthenticated ? userCart : localCart;

    const handleChangeQuantity = (cartItemId, quantity) => {
        const cartItem = renderCart.cartItems.find(item => item.id === cartItemId);
        if (!cartItem) {
            toast.error("Sản phẩm không tồn tại trong giỏ hàng");
            return;
        }

        const newQuantity = cartItem.quantity + quantity;
        if (newQuantity <= 0) {
            toast.error("Số lượng sản phẩm phải lớn hơn 0");
            return;
        }

        if (newQuantity > cartItem.product.stockQuantity) {
            toast.error("Số lượng sản phẩm trong kho không đủ");
            return;
        }

        if (isAuthenticated) {
            changeQuantityCartItemById({ id: cartItemId, quantity })
                .unwrap()
                .then((res) => {
                    refetchGetCart();
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message)
                });
        } else {
            dispatch(changeQuantityItem({ productId: cartItem.product.id, quantity }));
        }
    }

    const handleDeleteItem = (cartItemId) => {
        const cartItem = renderCart.cartItems.find(item => item.id === cartItemId);
        if (!cartItem) {
            toast.error("Sản phẩm không tồn tại trong giỏ hàng");
            return;
        }

        if (isAuthenticated) {
            deleteCartItem(cartItemId)
                .unwrap()
                .then((res) => {
                    toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
                    refetchGetCart();
                    closeModal();
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(error.data.message)
                });
        } else {
            dispatch(deleteFromCart({ productId: cartItem.product.id }));
            closeModal();
        }
    }

    return (
        <>
            <Helmet>
                <title>Giỏ hàng</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>Giỏ hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shoping-cart spad">
                <div className="container">
                    {renderCart && renderCart?.cartItems?.length > 0 && (
                        <>
                            <div className="row shoping-cart-products">
                                <div className="col-lg-12">
                                    <div className="shoping__cart__table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className="shoping__product" style={{ width: "50%" }}>Sản phẩm</th>
                                                    <th style={{ width: "20%" }}>Giá</th>
                                                    <th style={{ width: "13%" }}>Số lượng</th>
                                                    <th style={{ width: "15%" }}>Thành tiền</th>
                                                    <th style={{ width: "2%" }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {renderCart?.cartItems.map((cartItem) => (
                                                    <tr key={cartItem.id}>
                                                        <td className="shoping__cart__item">
                                                            <div className="d-flex align-items-center">
                                                                <img src={cartItem.product.thumbnail} alt={cartItem.product.name} />
                                                                <h5>
                                                                    <Link
                                                                        className="text-muted"
                                                                        to={`/san-pham/${cartItem.product.id}/${cartItem.product.slug}`}>
                                                                        {cartItem.product.name}
                                                                    </Link>
                                                                </h5>
                                                            </div>
                                                        </td>
                                                        <td className={`shoping__cart__price ${cartItem.product.discountPrice ? "has-discount" : ""}`}>
                                                            {cartItem.product.discountPrice && (
                                                                <span className="discount-price">{formatCurrency(cartItem.product.discountPrice)}</span>
                                                            )}
                                                            <span className={`${cartItem.product.discountPrice ? "original-price" : ""}`}>{formatCurrency(cartItem.product.price)}</span>
                                                        </td>
                                                        <td className="shoping__cart__quantity">
                                                            <div className="quantity">
                                                                <div className="pro-qty">
                                                                    <span className="dec qtybtn" onClick={() => handleChangeQuantity(cartItem.id, -1)}>-</span>
                                                                    <input type="text" value={cartItem.quantity} readOnly disabled />
                                                                    <span className="inc qtybtn" onClick={() => handleChangeQuantity(cartItem.id, 1)}>+</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="shoping__cart__total">{formatCurrency(cartItem.totalAmount)}</td>
                                                        <td className="shoping__cart__item__close">
                                                            <span
                                                                className="icon_close"
                                                                onClick={() => {
                                                                    openModal();
                                                                    setCartItemSelected(cartItem);
                                                                }}
                                                            >
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row shoping-cart-info">
                                <div className="col-lg-6">
                                    <div className="shoping__cart__btns">
                                        <Link to={"/"} className="primary-btn cart-btn">Tiếp tục mua hàng</Link>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="shoping__checkout">
                                        <h5>Tổng tiền giỏ hàng</h5>
                                        <ul>
                                            <li>Thành tiền <span className="temporary-amount">{formatCurrency(renderCart.totalAmount)}</span></li>
                                            <li>Tổng tiền <span className="total-amount">{formatCurrency(renderCart.totalAmount)}</span></li>
                                        </ul>
                                        <Link to={"/thanh-toan"} className="primary-btn">THANH TOÁN</Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {(!renderCart || renderCart?.cartItems?.length === 0) && (
                        <div className="row">
                            <div className="col-lg-12">
                                <h5 className="fst-italic mb-3">Không có sản phẩm nào trong giỏ hàng</h5>
                                <div className="shoping__cart__btns">
                                    <Link to={"/"} className="primary-btn">Tiếp tục mua hàng</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {isOpen && (
                <ModalConfirm
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng không?"
                    show={isOpen}
                    handleClose={closeModal}
                    handleConfirm={() => handleDeleteItem(cartItemSelected.id)}
                />
            )}
        </>
    )
}

export default ShoppingCart