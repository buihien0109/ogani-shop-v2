import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetTransactionsQuery } from "../../../app/services/transaction.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import TransactionTable from "./TransactionTable";

const breadcrumb = [
  { label: "Danh sách nhập hàng", href: "/admin/transactions" },
]
const TransactionList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    isLoading: isFetchingTransactions,
  } = useGetTransactionsQuery();

  if (isFetchingTransactions) {
    return <Spin size="large" fullscreen />
  }

  return (
    <>
      <Helmet>
        <title>Danh sách nhập hàng</title>
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
          <RouterLink to="/admin/transactions/create">
            <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
              Tạo phiếu nhập hàng
            </Button>
          </RouterLink>
          <RouterLink to="/admin/transactions">
            <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
              Refresh
            </Button>
          </RouterLink>
        </Space>

        <TransactionTable data={data} />
      </div>

    </>
  );
};

export default TransactionList;
