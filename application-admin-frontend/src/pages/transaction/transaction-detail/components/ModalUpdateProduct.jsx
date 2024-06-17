import { Button, Form, InputNumber, message, Modal, Select, Space } from "antd";
import React from "react";
import { useGetProductsQuery } from "../../../../app/services/product.service";
import { useUpdateTransactionItemMutation } from "../../../../app/services/transaction.service";

const ModalUpdateProduct = ({ data, open, onCancel, transactionId }) => {
    const [form] = Form.useForm();
    const { data: products } = useGetProductsQuery();
    const [updateTransactionItem, { isLoading }] = useUpdateTransactionItemMutation();

    const onFinish = (values) => {
        updateTransactionItem({ id: transactionId, itemId: data.id, ...values })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật sản phẩm thành công!");
                onCancel();
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    }

    return (
        <>
            <Modal
                open={open}
                title="Cập nhật sản phẩm"
                footer={null}
                onCancel={onCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{
                        productId: data.product.id,
                        quantity: data.quantity,
                        purchasePrice: data.purchasePrice
                    }}
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
                            disabled
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
};
export default ModalUpdateProduct;
