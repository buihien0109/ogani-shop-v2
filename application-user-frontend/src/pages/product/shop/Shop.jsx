import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useGetProductsQuery } from '../../../app/apis/product.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import { formatCurrency } from '../../../utils/functionUtils';
import ProductItem from '../../../components/product/ProductItem';

function Shop() {
    const categories = useSelector(state => state.categories)
    const { parentSlug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    let page = searchParams.get('page') || 1;
    let limit = searchParams.get('limit') || 6;
    let sub = searchParams.get('sub');

    const { data: productData, isLoading: isLoadingGetProducts, isError: isErrorGetProducts } = useGetProductsQuery({
        page: page,
        limit: limit,
        parentSlug: parentSlug,
        subSlug: sub
    }, { refetchOnMountOrArgChange: true })

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [searchParams])

    if (isLoadingGetProducts) {
        return <Loading />
    }

    if (isErrorGetProducts) {
        return <ErrorPage />
    }

    const handlePageChange = (page) => {
        const params = Object.fromEntries([...searchParams]);
        params.page = page;
        setSearchParams(params);
    };

    const parentCategory = categories.find(c => c?.slug === parentSlug);
    const subCategories = categories.filter(c => c?.parent?.slug === parentSlug);

    return (
        <>
            <Helmet>
                <title>{parentCategory?.name}</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>{parentCategory?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="product spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-5">
                            <div className="sidebar">
                                <div className="sidebar__item">
                                    <h4>{parentCategory.name}</h4>
                                    <ul>
                                        {subCategories.map(subCategory => (
                                            <li key={subCategory.id}>
                                                <Link
                                                    to={`/danh-muc/${parentSlug}?sub=${subCategory.slug}`}
                                                    className={`${subCategory.slug === sub ? 'active' : ''}`}
                                                >{subCategory.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-7">
                            {productData.totalElements > 0 && (
                                <div className="filter__item">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6">
                                            <div className="filter__sort">

                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="filter__found">
                                                <h6><span>{productData.totalElements}</span> sản phẩm</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row" style={{rowGap: 50}}>
                                {productData.totalElements === 0 && (
                                    <h4 className="font-italic">Sản phẩm đang được cập nhật</h4>
                                )}
                                {productData.totalElements > 0 && productData.content.map(product => (
                                    <div key={product.id} className="col-lg-4 col-md-6 col-sm-6">
                                        <ProductItem product={product} />
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-center align-items-center" style={{marginTop: 50}}>
                                {productData?.totalPages > 1 && (
                                    <Pagination
                                        current={page}
                                        total={productData.totalElements}
                                        pageSize={productData.size}
                                        onChange={handlePageChange}
                                        className='text-center'
                                        hideOnSinglePage={true}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Shop