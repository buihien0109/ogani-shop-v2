import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useGetProductsByCategoryQuery } from '../../../app/apis/product.api';
import ErrorPage from '../../../components/error/ErrorPage';
import { IconLoading } from '../../../components/icon/Icon';
import ProductItem from '../../../components/product/ProductItem';

function ProductsByCategory({ item }) {
    const { category, data } = item;
    const [products, setProducts] = useState(data?.content ?? []);
    const [page, setPage] = useState(1);
    const remaining = data?.totalElements - products.length;

    const {
        data: productData,
        isLoading,
        isFetching,
        isError
    } = useGetProductsByCategoryQuery({
        page: page,
        limit: 8,
        parentSlug: category.slug,
    }, { refetchOnMountOrArgChange: true, skip: page === 1 })

    useEffect(() => {
        if (productData) {
            setProducts([...products, ...productData.content]);
        }
    }, [productData])

    if (isError) {
        return <ErrorPage />
    }

    const handleLoadmoreProduct = () => {
        setPage(page + 1);
    }
    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title mt-5">
                            <h2>{category.name}</h2>
                        </div>
                    </div>
                </div>
                <div className="row product-list" style={{ rowGap: 50 }}>
                    {products.map((product, index) => (
                        <div key={index} className="col-lg-3 col-md-6 col-sm-6">
                            <ProductItem
                                product={product}
                            />
                        </div>
                    ))}
                </div>
                {remaining > 0 && (
                    <div className="row load-more-row" style={{ marginTop: 50 }}>
                        <div className="col-lg-12 text-center">
                            <div className="loadmore__btn">
                                <Button
                                    type="submit"
                                    className="border-0 primary-btn"
                                    disabled={isLoading || isFetching}
                                    onClick={handleLoadmoreProduct}
                                >
                                    {isLoading ? <IconLoading /> : null}
                                    Xem thêm&nbsp;<span className="remain-count">{remaining}</span>&nbsp;sản phẩm&nbsp;
                                    <span>{category.name}</span>
                                    <span className="loadmore-icon"><i className="fa-solid fa-angle-down"></i></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductsByCategory