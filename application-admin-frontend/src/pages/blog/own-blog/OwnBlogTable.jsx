import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatDate } from "../../../utils/functionUtils";

const OwnBlogTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps('title'),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/blogs/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Thể loại",
            dataIndex: "tags",
            key: "tags",
            render: (text, record, index) => {
                return text.map((tag) => (
                    <Tag color={"geekblue"} key={tag.id} style={{ marginBottom: 7 }}>
                        {tag.name}
                    </Tag>
                ));
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return text ? <Tag color="success">Công khai</Tag> : <Tag color="warning">Nháp</Tag>;;
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
export default OwnBlogTable;
