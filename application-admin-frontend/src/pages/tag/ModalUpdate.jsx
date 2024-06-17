import { Button, Form, Input, Modal, Space, message } from "antd";
import React from "react";
import { useUpdateTagMutation } from "../../app/services/tag.service";

const ModalUpdate = (props) => {
    const { tag, open, onCancel } = props;
    const [updateTag, { isLoading }] = useUpdateTagMutation();

    const onFinish = (values) => {
        updateTag({ id: tag.id, name: values.name })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật thể loại thành công!");
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
                title="Cập nhật thể loại"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ name: tag?.name }}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Tên thể loại không được để trống!',
                            },
                        ]}
                    >
                        <Input placeholder="Nhập tên thể loại" />
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
