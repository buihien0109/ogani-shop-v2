import { Modal, Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../hooks/useSearchTable";
import { formatDate } from "../../utils/functionUtils";

const ModalShowBlogs = (props) => {
    const { tag, blogs, loading, open, onCancel } = props;

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
            title: "Tác giả",
            dataIndex: "user",
            key: "user",
            ...getColumnSearchProps('user', ["name"]),
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/users/${text.id}/detail`}>
                        {text.name}
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
                return text ? <Tag color="success">Công khai</Tag> : <Tag color="warning">Nháp</Tag>;
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
    return (
        <>
            <Modal
                open={open}
                title={`Danh sách bài viết của thể loại ${tag.name}`}
                footer={null}
                onCancel={onCancel}
                confirmLoading={loading}
                width={1100}
            >
                <Table columns={columns} dataSource={blogs} rowKey={(record) => record.id} />
            </Modal>
        </>
    )
};
export default ModalShowBlogs;
