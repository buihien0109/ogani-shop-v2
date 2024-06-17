import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import PaymentVoucherTable from "./PaymentVoucherTable";
import { useGetPaymentVouchersQuery } from "../../../app/services/paymentVoucher.service";

const breadcrumb = [
    { label: "Danh sách phiếu chi", href: "/admin/payment-vouchers" },
]
const PaymentVoucherList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingPaymentVouchers,
    } = useGetPaymentVouchersQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isFetchingPaymentVouchers) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách phiếu chi</title>
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
                    <RouterLink to="/admin/payment-vouchers/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo phiếu chi
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/payment-vouchers">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <PaymentVoucherTable data={data} />
            </div>

        </>
    );
};

export default PaymentVoucherList;
