import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";

const BannerTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Tên banner",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/banners/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text ? <Tag color="success">Kích hoạt</Tag> : <Tag color="warning">Vô hiệu hóa</Tag>;
            },
        },
        {
            title: "Link điều hướng",
            dataIndex: "linkRedirect",
            key: "linkRedirect",
            render: (text, record, index) => {
                return (
                    <RouterLink to={text}>
                        {text}
                    </RouterLink>
                );
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
export default BannerTable;
