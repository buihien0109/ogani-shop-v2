import React from 'react';
import { Helmet } from 'react-helmet';
import { useGetBannersQuery } from '../../app/apis/banner.api';
import { useGetProductsQuery } from '../../app/apis/product.api';
import ErrorPage from '../../components/error/ErrorPage';
import Loading from '../../components/loading/Loading';
import BannerList from './components/BannerList';
import ProductList from './components/ProductList';

function Home() {
  const {
    data: banners,
    isLoading: isLoadingGetBanners,
    isError: isErrorGetBanners
  } = useGetBannersQuery();
  const {
    data,
    isLoading: isLoadingGetProducts,
    isError: isErrorGetProducts
  } = useGetProductsQuery({ limit: 8 });

  if (isLoadingGetBanners || isLoadingGetProducts) {
    return <Loading />
  }

  if (isErrorGetBanners || isErrorGetProducts) {
    return <ErrorPage />
  }

  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div className="banner">
        <div className="container">
          <div className="banners__pic__slider owl-carousel owl-theme">
            <BannerList banners={banners} />
          </div>
        </div>
      </div>

      <ProductList data={data} />
    </>
  )
}

export default Home