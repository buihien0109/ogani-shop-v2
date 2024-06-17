import { Avatar, Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";


const SupplierTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Logo",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (text, record, index) => {
                return <Avatar size={64} src={<img src={text} alt="logo" />} />;
            },
        },
        {
            title: "Tên nhà cung cấp",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/suppliers/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            width: "10%",
            render: (text, record, index) => {
                return text
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text, record, index) => {
                return text
            },
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
            render: (text, record, index) => {
                return text
            },
        }
    ];

    return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default SupplierTable;
