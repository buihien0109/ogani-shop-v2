import 'rc-pagination/assets/index.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useAddFavoriteMutation, useCheckProductExistsInFavoriteQuery, useDeleteFavoriteMutation } from '../../../app/apis/favorite.api';
import { useGetProductDetailQuery, useGetRelatedProductsQuery, useGetReviewsByProductQuery } from '../../../app/apis/product.api';
import { addFavorite as addFavoriteLocal, deleteFavorite as deleteFavoriteLocal } from '../../../app/slices/favorite.slice';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { MAX_RATING } from '../../../data/constants';
import { formatCurrency } from '../../../utils/functionUtils';
import ProductSlider from './components/ProductSlider';
import RelatedProduct from './components/RelatedProduct';
import ReviewList from './components/ReviewList';
import ReviewOverview from './components/ReviewOverview';

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

function ProductDetail() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    const favorites = useSelector(state => state.favorites);
    const { productId, productSlug } = useParams();
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [count, setCount] = useState(1);
    const [isFavorite, setIsFavorite] = useState(() => {
        if (!isAuthenticated) {
            return favorites.some(id => id == productId);
        }
        return false;
    });

    const {
        data: product,
        isLoading: isLoadingGetProduct,
        isError: isErrorGetProduct
    } = useGetProductDetailQuery({ productId, productSlug })
    const {
        data: reviews,
        isLoading: isLoadingGetReviews,
        isError: isErrorGetReviews,
        refetch: refetchReview
    } = useGetReviewsByProductQuery({ productId })
    const {
        data: relatedProducts,
        isLoading: isLoadingGetRelatedProducts,
        isError: isErrorGetRelatedProducts
    } = useGetRelatedProductsQuery({ productId })
    const {
        data: productExistsInFavorite,
        isLoading: isLoadingCheckProductExistsInFavorite,
        isError: isErrorCheckProductExistsInFavorite
    } = useCheckProductExistsInFavoriteQuery(productId, { refetchOnMountOrArgChange: true, skip: !isAuthenticated });

    const [addFavorite, { isLoading: isLoadingAddToFavorite }] = useAddFavoriteMutation();
    const [deleteFavorite, { isLoading: isLoadingDeleteFavorite }] = useDeleteFavoriteMutation();

    useEffect(() => {
        if (isAuthenticated && productExistsInFavorite) {
            setIsFavorite(productExistsInFavorite.isExists);
        }
    }, [productExistsInFavorite]);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsFavorite(favorites.some(id => id == productId));
        }
    }, [location])

    useEffect(() => {
        if (shouldRefetch) {
            refetchReview();
            setShouldRefetch(false);
        }
    }, [shouldRefetch]);

    if (isLoadingGetProduct || isLoadingGetReviews || isLoadingGetRelatedProducts || isLoadingCheckProductExistsInFavorite) {
        return <Loading />
    }

    if (isErrorGetProduct || isErrorGetReviews || isErrorGetRelatedProducts || isErrorCheckProductExistsInFavorite) {
        return <ErrorPage />
    }

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

    const handleFavorite = (productId) => {
        if (isAuthenticated) {
            if (isFavorite) {
                handleDeleteFavorite(productId);
            } else {
                handleAddFavorite(productId);
            }
        } else {
            if (isFavorite) {
                handleDeleteFromFavoriteLocal(productId);
            } else {
                handleAddFavoriteLocal(productId);
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


    return (
        <>
            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <Link
                                        to={`/danh-muc/${product.category.parent.slug}?sub=${product.category.slug}`}>
                                        {product.category.name}
                                    </Link>
                                    <span>{product.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-details spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <ProductSlider
                                product={product}
                            />
                        </div>
                        <div className="col-lg-6 col-md-6">
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
                                        <button className="border-0 primary-btn btn-add-to-card">THÊM VÀO GIỎ HÀNG</button>
                                        <button
                                            className="heart-icon btn-add-to-wishlist"
                                            style={{
                                                color: isFavorite ? "#7fad39" : "#6f6f6f",
                                                border: isFavorite ? "1px solid #7fad39" : "1px solid transparent"
                                            }}
                                            onClick={() => handleFavorite(product.id)}
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
                        </div>
                    </div>
                </div>
            </section>

            <section className="review-section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product__details__tab">
                                <ul className="nav nav-tabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="#tabs-1" type="button" role="tab" aria-controls="tabs-1" aria-selected="true">Thông tin sản phẩm</a>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link active" id="profile-tab" data-bs-toggle="tab" data-bs-target="#tabs-2" type="button" role="tab" aria-controls="tabs-2" aria-selected="false">
                                            Đánh giá&nbsp;
                                            <span>
                                                (<span className="review-count d-inline-block m-0">{reviews.length}</span>)
                                            </span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane fade" id="tabs-1" role="tabpanel">
                                        <div className="product__details__tab__desc">
                                            <h6>Thông tin sản phẩm</h6>
                                            {product.attributes.map((attribute) => (
                                                <div key={attribute.id} className='row'>
                                                    <div className='col' style={{flex: "0 0 12%"}}>
                                                        <p><b>{attribute.name}:</b></p>
                                                    </div>
                                                    <div className='col'>
                                                        <p>{attribute.value ?? "Đang cập nhật"}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="tab-pane fade show active" id="tabs-2" role="tabpanel">
                                        <div className="product__details__tab__desc">
                                            <ReviewOverview
                                                reviews={reviews}
                                                product={product}
                                                onSetShouldRefetch={() => setShouldRefetch(true)}
                                            />
                                            <ReviewList
                                                reviews={reviews}
                                                product={product}
                                                onSetShouldRefetch={() => setShouldRefetch(true)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <RelatedProduct
                products={relatedProducts}
            />
        </>
    )
}

export default ProductDetail