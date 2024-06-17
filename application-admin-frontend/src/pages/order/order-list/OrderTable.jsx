import { Table, Tag, Typography } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";

// WAIT,WAIT_DELIVERY,DELIVERY,COMPLETE,CANCELED,RETURNED;
const parseOrderStatus = (status) => {
    switch (status) {
        case "WAIT":
            return <Tag color="default">Chờ xác nhận</Tag>;
        case "WAIT_DELIVERY":
            return <Tag color="processing">Chờ giao hàng</Tag>;
        case "DELIVERY":
            return <Tag color="warning">Đang giao hàng</Tag>;
        case "COMPLETE":
            return <Tag color="success">Hoàn thành</Tag>;
        case "CANCELED":
            return <Tag color="error">Đã hủy</Tag>;
        case "RETURNED":
            return <Tag color="warning">Đã trả hàng</Tag>;
        default:
            return <Tag color="default">Chưa cập nhật</Tag>;
    }
};

const getCustomer = (record) => {
    if (record.user) {
        return (
            <>
                <Tag color="processing">u</Tag>
                <RouterLink to={`/admin/users/${record.user.id}/detail`}>
                    {record.user.name}
                </RouterLink>
            </>
        );
    } else {
        return (
            <>
                <Tag color="warning">a</Tag>
                {record.name}
            </>
        )
    }
}
const getPhone = (record) => record.user ? record.user.phone : record.phone
const getEmail = (record) => record.user ? record.user.email : record.email

const OrderTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            ...getColumnSearchProps('id'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/products/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Khách hàng",
            dataIndex: "",
            key: "customer",
            render: (text, record, index) => {
                return getCustomer(record);
            },
        },
        {
            title: "Email",
            dataIndex: "",
            key: "email",
            render: (text, record, index) => {
                return getEmail(record);
            },
        },
        {
            title: "Số điện thoại",
            dataIndex: "",
            key: "phone",
            render: (text, record, index) => {
                return getPhone(record);
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => {
                return parseOrderStatus(text);
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
export default OrderTable;
