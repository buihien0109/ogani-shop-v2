import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, Row, Select, Space, Spin, message, theme } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetSuppliersQuery } from "../../../app/services/supplier.service";
import { useCreateTransactionMutation } from "../../../app/services/transaction.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import TransactionProduct from "./components/TransactionProduct";

const breadcrumb = [
    { label: "Danh sách nhập hàng", href: "/admin/transactions" },
    { label: "Tạo phiếu nhập hàng", href: "/admin/transactions/create" },
];
const TransactionCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const {
        data: suppliers,
        isLoading: isFetchingSuppliers,
    } = useGetSuppliersQuery();

    const [createTransaction, { isLoading }] = useCreateTransactionMutation();

    if (isFetchingSuppliers) {
        return <Spin size="large" fullscreen />
    }

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                if (data.length === 0) {
                    message.warning("Vui lòng chọn sản phẩm");
                    throw new Error("Vui lòng chọn sản phẩm");
                }

                const transactionItems = data.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    purchasePrice: item.purchasePrice
                }));

                return createTransaction({ ...values, transactionItems }).unwrap()
            })
            .then((data) => {
                message.success("Tạo phiếu nhập hàng thành công!");
                setTimeout(() => {
                    navigate(`/admin/transactions/${data.id}/detail`);
                }, 1500)
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    const handleGetSelectedProduct = (value) => {
        const { product } = value;
        if (!product) return;
        const isExist = data.find((item) => item.product.id === product.id);
        if (isExist) {
            message.warning("Sản phẩm đã tồn tại trong danh sách");
        } else {
            setData([...data, value]);
        }
    }

    const handleUpdateSelectedProduct = (value) => {
        const { product } = value;
        const newData = data.map((item) => {
            if (item.product.id === product.id) {
                return {
                    ...item,
                    quantity: value.quantity,
                    purchasePrice: value.purchasePrice
                }
            }
            return item;
        });
        setData(newData);
    }

    const handleDeleteSelectedProduct = (index) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    }

    return (
        <>
            <Helmet>
                <title>Tạo phiếu nhập hàng</title>
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
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        loading={isLoading}
                    >
                        Tạo phiếu nhập hàng
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
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
                                data={data}
                                onDeleteSelectedProduct={handleDeleteSelectedProduct}
                                onUpdateSelectedProduct={handleUpdateSelectedProduct}
                                onGetSelectedProduct={handleGetSelectedProduct}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default TransactionCreate;
