import { Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";


const TransactionListBySupplier = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const columns = [
        {
            title: "Mã giao dịch",
            dataIndex: "id",
            key: "id",
            ...getColumnSearchProps('id'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/transactions/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Người nhận",
            dataIndex: "receiverName",
            key: "receiverName",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Người gửi",
            dataIndex: "senderName",
            key: "senderName",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return formatCurrency(text);
            },
        },
        {
            title: "Ngày giao hàng",
            dataIndex: "transactionDate",
            key: "transactionDate",
            sorter: (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return formatDate(text);
            },
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default TransactionListBySupplier;
