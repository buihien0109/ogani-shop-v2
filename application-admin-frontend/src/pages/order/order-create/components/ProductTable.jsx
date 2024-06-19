import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, message, Modal, Space, Table, Tag, Typography } from "antd";
import React, { useState } from "react";
import { formatCurrency } from "../../../../utils/functionUtils";
import ModalUpdateProduct from "./ModalUpdateProduct";

const ProductTable = ({ data, coupon, onDeleteSelectedProduct, onUpdateSelectedProduct }) => {
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [productUpdate, setProductUpdate] = useState(null);

    const columns = [
        {
            title: "STT",
            dataIndex: "",
            key: "index",
            render: (text, record, index) => {
                return index + 1;
            },
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "product",
            key: "product",
            render: (text, record, index) => {
                return text.name;
            },
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Giá sản phẩm",
            dataIndex: "product",
            key: "price",
            render: (text, record, index) => {
                return formatCurrency(text.price);
            },
        },
        {
            title: "Giá khuyến mại (nếu có)",
            dataIndex: "",
            key: "",
            render: (text, record, index) => {
                return "";
            },
        },
        {
            title: "Thành tiền",
            dataIndex: "",
            key: "amount",
            render: (text, record, index) => {
                return formatCurrency(record.quantity * record.product.price);
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Flex justify={"end"}>
                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setProductUpdate(record);
                                    setOpenModalUpdate(true);
                                }}
                            ></Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    handleConfirm(index);
                                }}
                            ></Button>
                        </Space>
                    </Flex>
                );
            },
        },
    ];

    const handleConfirm = (index) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                return new Promise((resolve, reject) => {
                    onDeleteSelectedProduct(index);
                    message.success("Xóa sản phẩm thành công!");
                    resolve();
                });
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    const handleUpdate = (value) => {
        onUpdateSelectedProduct(value);
    };

    const calculateTemporaryAmount = () => {
        return data.reduce((total, record) => total + (record.quantity * record.product.price), 0);
    };

    const calculateDiscountAmount = () => {
        if(coupon) {
            return calculateTemporaryAmount() * (coupon.discount / 100);
        }
        return 0;
    }

    const calculateTotalAmount = () => {
        return calculateTemporaryAmount() - calculateDiscountAmount();
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.product.id}
                pagination={false}
                footer={() => {
                    if (data.length === 0) return null;
                    return (
                        <Flex justify={"end"}>
                            <Space direction="vertical" align="end">
                                <Typography.Paragraph>
                                    Thành tiền: <Tag color="success">{formatCurrency(calculateTemporaryAmount())}</Tag>
                                </Typography.Paragraph>
                                <Typography.Paragraph>
                                    Giảm giá: <Tag color="success">{formatCurrency(calculateDiscountAmount())}</Tag>
                                </Typography.Paragraph>
                                <Typography.Paragraph style={{ marginBottom: 0 }}>
                                    Tổng tiền: <Tag color="success">{formatCurrency(calculateTotalAmount())}</Tag>
                                </Typography.Paragraph>
                            </Space>
                        </Flex>
                    )
                }}
            />
            {openModalUpdate && (
                <ModalUpdateProduct
                    open={openModalUpdate}
                    onCancel={() => setOpenModalUpdate(false)}
                    data={productUpdate}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
};

export default ProductTable;
