import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetOrdersQuery } from "../../../app/services/order.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import OrderTable from "./OrderTable";

const breadcrumb = [
    { label: "Danh sách đơn hàng", href: "/admin/orders" },
]
const OrderList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingOrders,
    } = useGetOrdersQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isFetchingOrders) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách đơn hàng</title>
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
                    <RouterLink to="/admin/orders/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo đơn hàng
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/orders">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <OrderTable data={data} />
            </div>

        </>
    );
};

export default OrderList;
