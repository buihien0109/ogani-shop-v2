import { Flex, Space, Table, Tag, Typography } from "antd";
import React from "react";
import { formatCurrency } from "../../../utils/functionUtils";

const ProductTable = ({ data, couponDiscount }) => {

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
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.product.id}
                pagination={false}
            />
        </>
    );
};

export default ProductTable;
