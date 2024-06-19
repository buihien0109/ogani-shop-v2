import { Button, Form, Input, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateParentCategoryMutation } from "../../app/services/category.service";

const ModalParentUpdate = (props) => {
    const { category, open, onCancel } = props;
    const [updateParentCategory, { isLoading }] = useUpdateParentCategoryMutation();

    const onFinish = (values) => {
        updateParentCategory({ id: category.id, name: values.name })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật danh mục sản phẩm cha thành công!");
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
                title="Cập nhật danh mục sản phẩm cha"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ name: category?.name }}
                >
                    <Form.Item
                        label="Danh mục cha"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Tên danh mục không được để trống!",
                            },
                        ]}
                    >
                        <Input placeholder="Enter name" />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                            >
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default ModalParentUpdate;
