import { Button, Form, InputNumber, message, Modal, Select, Space } from 'antd';
import React from 'react';
import { useGetProductsQuery } from '../../../../app/services/product.service';
import { useCreateTransactionItemMutation } from '../../../../app/services/transaction.service';

function ModalAddProduct({ transactionId, open, setOpen }) {
    const [form] = Form.useForm();
    const { data: products } = useGetProductsQuery();
    const [createTransactionItem, { isLoading }] = useCreateTransactionItemMutation();

    const onFinish = (values) => {
        createTransactionItem({ id: transactionId, ...values })
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpen(false);
                message.success("Thêm sản phẩm thành công");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    }

    return (
        <>
            <Modal
                open={open}
                title="Chọn sản phẩm"
                footer={null}
                onCancel={() => setOpen(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Chọn sản phẩm"
                        name="productId"
                        rules={[
                            {
                                required: true,
                                message: "Sản phẩm không được để trống!",
                            },
                        ]}
                    >
                        <Select
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select a product"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                            options={products?.map((product) => ({
                                value: product.id,
                                label: product.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng nhập"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Số lượng nhập không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject(
                                            new Error("Số lượng phải lớn hơn 0")
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter quantity" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Giá nhập"
                        name="purchasePrice"
                        rules={[
                            {
                                required: true,
                                message: "Giá nhập không được để trống!",
                            },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject(
                                            new Error("Giá nhập phải lớn hơn 0")
                                        );
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <InputNumber placeholder="Enter purchase price" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                            >
                                Xác nhận
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default ModalAddProduct