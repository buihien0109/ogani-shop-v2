import { Button, Form, Input, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateAttributeMutation } from "../../../../../app/services/productAttribute.service";

const ModalUpdate = (props) => {
    const { attribute, productId, open, onCancel } = props;
    const [updateAttribute, { isLoading }] = useUpdateAttributeMutation();

    const onFinish = (values) => {
        updateAttribute({ id: attribute.id, ...values, productId })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật thuộc tính thành công!");
                onCancel();
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Modal
                open={open}
                title="Cập nhật thuộc tính"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={attribute}
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
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default ModalUpdate;
