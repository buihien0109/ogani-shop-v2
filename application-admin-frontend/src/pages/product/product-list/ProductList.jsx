import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetProductsQuery } from "../../../app/services/product.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import ProductTable from "./ProductTable";

const breadcrumb = [
    { label: "Danh sách sản phẩm", href: "/admin/products" },
]
const ProductList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingProducts,
    } = useGetProductsQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isFetchingProducts) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách sản phẩm</title>
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
                    <RouterLink to="/admin/products/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo sản phẩm
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/products">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <ProductTable data={data} />
            </div>

        </>
    );
};

export default ProductList;
