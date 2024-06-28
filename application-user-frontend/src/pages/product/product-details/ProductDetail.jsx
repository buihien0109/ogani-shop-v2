import 'rc-pagination/assets/index.css';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useGetProductDetailQuery, useGetRelatedProductsQuery, useGetReviewsByProductQuery } from '../../../app/apis/product.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import ProductInfo from './components/ProductInfo';
import ProductSlider from './components/ProductSlider';
import RelatedProduct from './components/RelatedProduct';
import ReviewList from './components/ReviewList';
import ReviewOverview from './components/ReviewOverview';

function ProductDetail() {
    const { productId, productSlug } = useParams();
    const [shouldRefetch, setShouldRefetch] = useState(false);
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

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [productId])

    if (isLoadingGetProduct || isLoadingGetReviews || isLoadingGetRelatedProducts) {
        return <Loading />
    }

    if (isErrorGetProduct || isErrorGetReviews || isErrorGetRelatedProducts) {
        return <ErrorPage />
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
                            <ProductInfo
                                product={product}
                                reviews={reviews}
                            />
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
                                                    <div className='col' style={{ flex: "0 0 12%" }}>
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