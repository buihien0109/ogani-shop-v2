import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Spin, message } from "antd";
import React, { useState } from "react";
import { useCreateAttributeMutation, useGetAttributesByProductQuery } from "../../../../../app/services/productAttribute.service";
import AttributeTable from "./AttributeTable";

const AttributeList = ({ productId }) => {
    const { data, isLoading: isFetchingAttributes } = useGetAttributesByProductQuery(productId);
    const [createAttribute, { isLoading: isLoadingCreate }] = useCreateAttributeMutation();

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    if (isFetchingAttributes) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = (values) => {
        createAttribute({...values, productId})
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpen(false);
                message.success("Tạo thuộc tính sản phẩm thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Space style={{ marginBottom: "1rem" }}>
                <Button
                    style={{ backgroundColor: "rgb(60, 141, 188)" }}
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setOpen(true)}
                >
                    Tạo thuộc tính
                </Button>
            </Space>

            <AttributeTable data={data} productId={productId}/>
            <Modal
                open={open}
                title="Tạo thuộc tính"
                footer={null}
                onCancel={() => setOpen(false)}
                confirmLoading={isLoadingCreate}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreate}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên thuộc tính"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Tên thuộc tính không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung"
                        name="value"
                        rules={[
                            {
                                required: true,
                                message: "Nội dung không được để trống!",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Enter value"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoadingCreate}
                            >
                                Lưu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AttributeList;
