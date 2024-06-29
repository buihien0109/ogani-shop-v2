import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Table } from "antd";
import React, { useState } from "react";
import ModalUpdate from "./ModalUpdate";
import { useDeleteAttributeMutation } from "../../../../../app/services/productAttribute.service";

const AttributeTable = ({ data, productId }) => {
    const [open, setOpen] = useState(false);
    const [attributeUpdate, setAttributeUpdate] = useState(null);
    const [deleteAttribute, { isLoading }] = useDeleteAttributeMutation();

    const columns = [
        {
            title: "Tên thuộc tính",
            dataIndex: "name",
            key: "name",
            width: "15%",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Nội dung",
            dataIndex: "value",
            key: "value",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setAttributeUpdate(record);
                                setOpen(true);
                            }}
                        ></Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                handleConfirm(record.id);
                            }}
                            loading={isLoading}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa thuộc tính này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading },
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteAttribute(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa thuộc tính thành công!");
                            resolve();
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject();
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
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
            />

            {open && (
                <ModalUpdate
                    open={open}
                    onCancel={() => setOpen(false)}
                    attribute={attributeUpdate}
                    productId={productId}
                />
            )}
        </>
    );
};
export default AttributeTable;
