import { LeftOutlined, RetweetOutlined, SaveOutlined, SnippetsOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  theme
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGetSuppliersQuery } from "../../../app/services/supplier.service";
import { useGetTransactionByIdQuery, useUpdateTransactionMutation } from "../../../app/services/transaction.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { formatDate } from "../../../utils/functionUtils";
import TransactionProduct from "./components/TransactionProduct";
import ModalUpdateQuantity from "./components/ModalUpdateQuantity";

const TransactionDetail = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const { transactionId } = useParams();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const { data: transaction, isLoading: isFetchingTransaction } = useGetTransactionByIdQuery(transactionId);
  const { data: suppliers, isLoading: isFetchingSuppliers, } = useGetSuppliersQuery();

  const [updateTransaction, { isLoading: isLoadingUpdateTransaction }] = useUpdateTransactionMutation();

  if (isFetchingSuppliers || isFetchingTransaction) {
    return <Spin size="large" fullscreen />
  }

  const breadcrumb = [
    { label: "Danh sách nhập hàng", href: "/admin/transactions" },
    { label: `Phiếu nhập hàng #${transaction?.id}`, href: `/admin/transactions/${transaction?.id}/detail` },
  ];

  if (isFetchingTransaction || isFetchingSuppliers) {
    return <Spin size="large" fullscreen />;
  }

  const handleUpdate = () => {
    form.validateFields()
      .then((values) => {
        return updateTransaction({
          id: transaction.id,
          ...values,
          transactionDate: values.transactionDate.format('YYYY-MM-DDTHH:mm:ss'),
        }).unwrap()
      })
      .then((data) => {
        message.success("Cập nhật phiếu nhập hàng thành công!");
      })
      .catch((error) => {
        if (error?.data?.message) {
          message.error(error.data.message);
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>{`Phiếu nhập hàng #${transaction?.id}`}</title>
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
        <Space style={{ marginBottom: "1rem" }}>
          <RouterLink to="/admin/transactions">
            <Button type="default" icon={<LeftOutlined />}>
              Quay lại
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleUpdate}
            loading={isLoadingUpdateTransaction}
          >
            Cập nhật
          </Button>
          <Button
            style={{ backgroundColor: "rgb(243, 156, 18)" }}
            type="primary"
            icon={<RetweetOutlined />}
            onClick={() => setOpen(true)}
          >
            Cập nhật sản phẩm trong kho
          </Button>
          <Button
            style={{ backgroundColor: "#52c41a" }}
            type="primary"
            icon={<SnippetsOutlined />}
          >
            Xuất báo cáo
          </Button>
        </Space>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{
            ...transaction,
            supplierId: transaction.supplier.id,
            transactionDate: dayjs(formatDate(transaction.transactionDate), 'DD/MM/YYYY'),
          }}
        >
          <Row gutter={[16, 16]} wrap={true}>
            <Col span={8}>
              <Form.Item
                label="Tên người gửi"
                name="senderName"
                rules={[
                  {
                    required: true,
                    message: "Tên người gửi không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Enter sender name" />
              </Form.Item>

              <Form.Item
                label="Tên người nhận"
                name="receiverName"
                rules={[
                  {
                    required: true,
                    message: "Tên người nhận không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Enter receive name" />
              </Form.Item>

              <Form.Item
                label="Nhà cung cấp"
                name="supplierId"
                rules={[
                  {
                    required: true,
                    message: "Nhà cung cấp không được để trống!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  showSearch
                  placeholder="Select a type"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={suppliers.map((supplier) => ({
                    value: supplier.id,
                    label: supplier.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Ngày giao dịch"
                name="transactionDate"
                rules={[
                  {
                    required: true,
                    message: "Ngày giao dịch không được để trống!",
                  }
                ]}
              >
                <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
              </Form.Item>
            </Col>

            <Col span={16}>
              <TransactionProduct
                transactionId={transaction.id}
                data={transaction.transactionItems}
              />
            </Col>
          </Row>
        </Form>
      </div>

      {open && (
        <ModalUpdateQuantity
          open={open}
          onCancel={() => setOpen(false)}
          data={transaction.transactionItems}
        />
      )}
    </>
  );
};

export default TransactionDetail;
