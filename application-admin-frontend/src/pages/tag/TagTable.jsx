import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, message, Modal, Row, Space, Table } from "antd";
import React, { useState } from "react";
import { useDeleteTagMutation, useGetAllBlogsByTagIdQuery } from "../../app/services/tag.service";
import useSearchTable from "../../hooks/useSearchTable";
import ModalShowBlogs from "./ModalShowBlogs";
import ModalUpdate from "./ModalUpdate";

const TagTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [openModalShowBlogs, setOpenModalShowBlogs] = useState(false);
    const [tagUpdate, setTagUpdate] = useState(null);
    const [tagShowBlog, setTagShowBlog] = useState(null);

    const { data: blogs, isLoading: isLoadingBlogs } = useGetAllBlogsByTagIdQuery(tagShowBlog?.id, {
        skip: !openModalShowBlogs,
    });
    const [deleteTag, { isLoading: isLoadingDeleteTag }] = useDeleteTagMutation();

    const columns = [
        {
            title: "Tên thể loại",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
            sorter: (a, b) => a.name.localeCompare(b.name, "vi"),
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Số lượng sử dụng",
            dataIndex: "used",
            key: "used",
            sorter: (a, b) => a.used - b.used,
            sortDirections: ["descend", "ascend"],
            render: (text, record, index) => {
                return (
                    <>
                        <span>{text}</span>&nbsp;
                        (<span
                            style={{ color: "#0d6efd", cursor: "pointer" }}
                            onClick={() => {
                                setTagShowBlog(record);
                                setOpenModalShowBlogs(true);
                            }}
                        >Xem danh sách</span>)
                    </>
                )
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
                                    setTagUpdate(record);
                                    setOpenModalUpdate(true);
                                }}
                            ></Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    handleConfirm(record.id);
                                }}
                            ></Button>
                        </Space>
                    </Flex>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa thể loại này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoadingDeleteTag }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteTag(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa thể loại thành công!");
                            resolve(); // Đóng modal sau khi xóa thành công
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject(); // Không đóng modal nếu xóa thất bại
                        });
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

    return (
        <>
            <Row>
                <Col span={12}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                    />
                </Col>
            </Row>
            {openModalUpdate && (
                <ModalUpdate
                    open={openModalUpdate}
                    onCancel={() => setOpenModalUpdate(false)}
                    tag={tagUpdate}
                />
            )}

            {openModalShowBlogs && (
                <ModalShowBlogs
                    open={openModalShowBlogs}
                    onCancel={() => setOpenModalShowBlogs(false)}
                    tag={tagShowBlog}
                    blogs={blogs}
                    loading={isLoadingBlogs}
                />
            )}
        </>
    );
};
export default TagTable;
