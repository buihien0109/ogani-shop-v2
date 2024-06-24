import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAddFavoriteMutation, useDeleteFavoriteMutation } from '../../app/apis/favorite.api';
import { addFavorite as addFavoriteLocal, deleteFavorite as deleteFavoriteLocal } from '../../app/slices/favorite.slice';
import { formatCurrency } from '../../utils/functionUtils';
import ModalProductOverview from './ModalProductOverview';

function ProductItem({ product }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const favorites = useSelector(state => state.favorites);
    const [showModal, setShowModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(() => {
        if (!isAuthenticated) {
            return favorites.some(id => id == product.id);
        }
        return false;
    });
    const [addFavorite, { isLoading: isLoadingAddToFavorite }] = useAddFavoriteMutation();
    const [deleteFavorite, { isLoading: isLoadingDeleteFavorite }] = useDeleteFavoriteMutation();

    const handleFavorite = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (isAuthenticated) {
            if (isFavorite) {
                handleDeleteFavorite(product.id);
            } else {
                handleAddFavorite(product.id);
            }
        } else {
            if (isFavorite) {
                handleDeleteFromFavoriteLocal(product.id);
            } else {
                handleAddFavoriteLocal(product.id);
            }
        }
    }

    const handleAddFavorite = (productId) => {
        addFavorite({ productId })
            .unwrap()
            .then((res) => {
                toast.success("Thêm vào yêu thích thành công");
                setIsFavorite(true);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    const handleDeleteFavorite = (productId) => {
        deleteFavorite(productId)
            .unwrap()
            .then((res) => {
                toast.success("Loại khỏi yêu thích thành công");
                setIsFavorite(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    const handleAddFavoriteLocal = (productId) => {
        dispatch(addFavoriteLocal({ productId }));
        toast.success("Thêm vào yêu thích thành công");
        setIsFavorite(true);
    }

    const handleDeleteFromFavoriteLocal = (productId) => {
        dispatch(deleteFavoriteLocal({ productId }));
        toast.success("Loại khỏi yêu thích thành công");
        setIsFavorite(false);
    }


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
                        <li onClick={handleFavorite} className={`${isFavorite ? "active" : ""}`}>
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