import 'rc-pagination/assets/index.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useGetProductDetailQuery, useGetRelatedProductsQuery, useGetReviewsByProductQuery } from '../../../app/apis/product.api';
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
    const { productId, productSlug } = useParams();
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const [count, setCount] = useState(1);

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

    useEffect(() => {
        if (shouldRefetch) {
            refetchReview();
            setShouldRefetch(false);
        }
    }, [shouldRefetch]);

    if (isLoadingGetProduct || isLoadingGetReviews || isLoadingGetRelatedProducts) {
        return <Loading />
    }

    if (isErrorGetProduct || isErrorGetReviews || isErrorGetRelatedProducts) {
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

                                <div className={`product__details__price ${product.discountPrice != null} ? 'has-discount' : ''`}>
                                    {product.discountPrice != null && (
                                        <span className={`${product.discountPrice != null} ? 'discount-price' : ''`}>
                                            {formatCurrency(product.discountPrice)}
                                        </span>
                                    )}
                                    <span className={`${product.discountPrice != null} ? 'original-price' : ''`}>
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
                                        <button className="border-0 heart-icon btn-add-to-wishlist">
                                            <span><i className="fa-regular fa-heart"></i></span>
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
                                            {product.attributes.map(attribute => (
                                                <p key={attribute.id}>
                                                    <span>{attribute.name}:</span>&nbsp;
                                                    <span>{attribute.value ?? "Đang cập nhật"}</span>
                                                </p>
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