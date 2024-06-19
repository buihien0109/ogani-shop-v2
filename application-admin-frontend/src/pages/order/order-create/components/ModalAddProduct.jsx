import { Button, Form, InputNumber, message, Modal, Select, Space } from 'antd';
import React from 'react';
import { useGetProductsQuery } from '../../../../app/services/product.service';

function ModalAddProduct({ open, onCancel, onGetSelectedProduct }) {
    const [form] = Form.useForm();
    const { data: products } = useGetProductsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data?.filter((product) => product.status === "AVAILABLE" && product.stockQuantity > 0),
        }),
    });

    const onFinish = values => {
        const product = products.find((product) => product.id === values.productId);

        if (!product) {
            message.error("Sản phẩm không tồn tại!");
            return;
        }

        if (product.stockQuantity < values.quantity) {
            message.warning("Số lượng sản phẩm không đủ!");
            return;
        }

        onGetSelectedProduct({
            product: product,
            quantity: values.quantity,
        });
        onCancel();
    }

    return (
        <>
            <Modal
                open={open}
                title="Chọn sản phẩm"
                footer={null}
                onCancel={onCancel}
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
                                label: `${product.name} - (${product.stockQuantity} sản phẩm)`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[
                            {
                                required: true,
                                message: "Số lượng không được để trống!",
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

                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
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