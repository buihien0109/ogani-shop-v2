import { Button, Form, Input, InputNumber, Modal, Select, Space, message } from "antd";
import React from "react";
import { useUpdateReviewMutation } from "../../../../../app/services/review.service";

const ModalUpdate = (props) => {
    const { review, open, onCancel, onUpdateReview, productId } = props;
    const [updateReview, { isLoading }] = useUpdateReviewMutation();

    const onFinish = (values) => {
        updateReview({ id: review.id, ...values, productId: productId })
            .unwrap()
            .then((data) => {
                onUpdateReview(data);
                message.success("Cập nhật review thành công!");
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
                title="Cập nhật review"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ ...review }}
                >
                    <Form.Item
                        name="rating"
                        rules={[
                            {
                                required: true,
                                message: "Rating không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0 || value > 5) {
                                        return Promise.reject(
                                            "Rating phải lớn hơn 0 và nhỏ hơn hoặc bằng 5!"
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Nhập rating" style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        name="comment"
                        rules={[
                            {
                                required: true,
                                message: 'Nội dung review không được để trống!',
                            },
                        ]}
                    >
                        <Input.TextArea rows={5} placeholder="Nhập nội dung review" />
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái duyệt"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Trạng thái duyệt không được để trống!",
                            },
                        ]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a status"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={[
                                { label: "Chờ duyệt", value: "PENDING" },
                                { label: "Đã duyệt", value: "ACCEPTED" },
                                { label: "Từ chối", value: "REJECTED" },
                            ]}
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
