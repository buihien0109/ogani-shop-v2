import { PlusOutlined, ReloadOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetBannersQuery } from "../../../app/services/banner.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import BannerTable from "./BannerTable";

const breadcrumb = [
    { label: "Danh sách banner", href: "/admin/banners" },
]
const BannerList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingBanners,
    } = useGetBannersQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isFetchingBanners) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách banner</title>
            </Helmet>
            <AppBreadCrumb items={breadcrumb} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Space style={{ marginBottom: '1rem' }}>
                    <RouterLink to="/admin/banners/create">
                        <Button
                            style={{ backgroundColor: 'rgb(60, 141, 188)' }}
                            type="primary"
                            icon={<PlusOutlined />}
                        >
                            Tạo banner
                        </Button>
                    </RouterLink>
                    
                    <RouterLink to="/admin/banners/sort">
                    <Button
                        style={{ backgroundColor: "rgb(243, 156, 18)" }}
                        type="primary"
                        icon={<RetweetOutlined />}
                    >
                        Sắp xếp vị trí các banner đang kích hoạt
                    </Button>
                    </RouterLink>

                    <RouterLink to="/admin/banners">
                        <Button
                            style={{ backgroundColor: 'rgb(0, 192, 239)' }}
                            type="primary"
                            icon={<ReloadOutlined />}
                        >
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <BannerTable data={data} />
            </div>

        </>
    );
};

export default BannerList;
