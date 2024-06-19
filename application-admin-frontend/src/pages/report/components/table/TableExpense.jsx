import { Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency, formatDate } from "../../../../utils/functionUtils";

const TableExpense = ({ data }) => {
    const columns = [
        {
            title: "Mã phiếu chi",
            dataIndex: "id",
            key: "id",
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/payment-vouchers/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Nội dung chi",
            dataIndex: "purpose",
            key: "purpose",
            render: (text, record, index) => {
                return text
            },
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            render: (text, record, index) => {
                return formatCurrency(text);
            },
        },
        {
            title: "Người chi",
            dataIndex: "user",
            key: "user",
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/users/${text.id}/detail`}>
                        {text.name}
                    </RouterLink>
                );
            },
        },
        {
            title: "Ghi chú",
            dataIndex: "note",
            key: "note",
            render: (text, record, index) => {
                return text
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return formatDate(text);
            },
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default TableExpense;
