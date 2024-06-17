import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetSuppliersQuery } from "../../../app/services/supplier.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import SupplierTable from "./SupplierTable";

const breadcrumb = [
    { label: "Danh sách nhà cung cấp", href: "/admin/suppliers" },
]
const SupplierList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingSuppliers,
    } = useGetSuppliersQuery(undefined, { refetchOnMountOrArgChange: true });

    if (isFetchingSuppliers) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Danh sách nhà cung cấp</title>
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
                    <RouterLink to="/admin/suppliers/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo nhà cung cấp
                        </Button>
                    </RouterLink>
                    <RouterLink to="/admin/suppliers">
                        <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <SupplierTable data={data} />
            </div>

        </>
    );
};

export default SupplierList;
