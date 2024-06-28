import 'rc-pagination/assets/index.css';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import breadcrumb from "../../../public/breadcrumb.jpg";
import { useGetFavoritesQuery } from '../../app/apis/favorite.api';
import { useGetProductsInIdsQuery } from '../../app/apis/product.api';
import ErrorPage from '../../components/error/ErrorPage';
import Loading from '../../components/loading/Loading';
import ProductItem from '../../components/product/ProductItem';

function Favorite() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const favorites = useSelector(state => state.favorites);
  const {
    data: favoritesUser,
    isLoading: isLoadingGetFavoritesUser,
    isError: isErrorGetFavoritesUser
  } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })

  const {
    data: favoritesLocal,
    isLoading: isLoadingGetFavoritesLocal,
    isError: isErrorGetFavoritesLocal
  } = useGetProductsInIdsQuery(favorites, { skip: isAuthenticated })

  if (isLoadingGetFavoritesUser || isLoadingGetFavoritesLocal) {
    return <Loading />
  }

  if (isErrorGetFavoritesUser || isErrorGetFavoritesLocal) {
    return <ErrorPage />
  }

  const data = isAuthenticated ? favoritesUser : favoritesLocal;
  return (
    <>
      <Helmet>
        <title>Sản phẩm yêu thích</title>
      </Helmet>

      <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <div className="breadcrumb__option">
                  <Link to={"/"}>Trang chủ</Link>
                  <span>Sản phẩm yêu thích</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured spad">
        <div className="container">
          <div className="row" style={{ rowGap: 50 }}>
            {data && data.length > 0 && data?.map((product, index) => (
              <div key={product.id} className="col-lg-3 col-md-6 col-sm-6">
                <ProductItem
                  product={product}
                />
              </div>
            ))}
            {(!data || data.length === 0) && (
              <div className="col-lg-12">
                <h5 className="fst-italic">Không có sản phẩm nào</h5>
              </div>
            )}
          </div>
        </div>
      </section>

    </>
  )
}

export default Favorite