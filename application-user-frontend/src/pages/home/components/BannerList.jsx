import React from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

function BannerList({ banners }) {
    return (
        <>
            <Swiper
                slidesPerView={2}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <img
                            src={banner.thumbnail}
                            alt={banner.name}
                            style={{ height: "350px", objectFit: "cover", width: "100%" }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}

export default BannerList