import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency } from "../../../utils/functionUtils";

// NOT_YET_SOLD, AVAILABLE, UNAVAILABLE, CEASE
const parseProductStatus = (status) => {
    switch (status) {
        case "NOT_YET_SOLD":
            return <Tag color="default">Chưa bán</Tag>;
        case "AVAILABLE":
            return <Tag color="success">Còn hàng</Tag>;
        case "UNAVAILABLE":
            return <Tag color="error">Hết hàng</Tag>;
        case "CEASE":
            return <Tag color="warning">Ngừng kinh doanh</Tag>;
        default:
            return <Tag color="default">Chưa cập nhật</Tag>;
    }
};

const ProductTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/products/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
            width: "10%",
            render: (text, record, index) => {
                return formatCurrency(text);
            },
        },
        {
            title: "Số lượng",
            dataIndex: "stockQuantity",
            key: "stockQuantity",
            render: (text, record, index) => {
                return text
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            ...getColumnSearchProps('status'),
            render: (text, record, index) => {
                return parseProductStatus(text);
            },
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
            render: (text, record, index) => {
                return <Tag color="blue">{text.name}</Tag>
            },
        },
        {
            title: "Nhà cung cấp",
            dataIndex: "supplier",
            key: "supplier",
            ...getColumnSearchProps('supplier', ['name']),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/suppliers/${text.id}/detail`}>
                        {text.name}
                    </RouterLink>
                );
            },
        }
    ];

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default ProductTable;
