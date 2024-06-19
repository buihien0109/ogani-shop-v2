import { Button, Flex, message, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import ModalAddProduct from './ModalAddProduct';
import ModalCoupon from './ModalCoupon';
import ProductTable from './ProductTable';

function OrderProduct({ data, coupon, onDeleteSelectedProduct, onUpdateSelectedProduct, onGetSelectedProduct, onGetSelectedCoupon }) {
    const [open, setOpen] = useState(false);
    const [openModalCoupon, setOpenModalCoupon] = useState(false);

    return (
        <>
            <Typography.Paragraph>
                Tổng số sản phẩm : <Tag color="blue">{data.length}</Tag>
            </Typography.Paragraph>

            <ProductTable
                data={data}
                coupon={coupon}
                onDeleteSelectedProduct={onDeleteSelectedProduct}
                onUpdateSelectedProduct={onUpdateSelectedProduct}
            />

            <Flex justify="space-between" style={{ marginTop: "1rem" }}>
                <Button
                    style={{ backgroundColor: "rgb(60, 141, 188)" }}
                    type="primary"
                    onClick={() => setOpen(true)}
                >
                    Thêm sản phẩm
                </Button>

                {data.length > 0 && (
                    <Space direction='horizontal'>
                        {coupon && (
                            <Button
                                onClick={() => {
                                    onGetSelectedCoupon(null);
                                    message.success("Hủy mã giảm giá thành công!");
                                }}
                            >
                                Hủy mã giảm giá
                            </Button>
                        )}

                        <Button
                            style={{ backgroundColor: "rgb(243, 156, 18)" }}
                            type="primary"
                            onClick={() => setOpenModalCoupon(true)}
                        >
                            Thêm mã giảm giá
                        </Button>
                    </Space>
                )}
            </Flex>

            {open && (
                <ModalAddProduct
                    open={open}
                    onCancel={() => setOpen(false)}
                    onGetSelectedProduct={onGetSelectedProduct}
                />
            )}

            {openModalCoupon && (
                <ModalCoupon
                    data={data}
                    coupon={coupon}
                    open={openModalCoupon}
                    onCancel={() => setOpenModalCoupon(false)}
                    onGetSelectedCoupon={onGetSelectedCoupon}
                />
            )}
        </>
    )
}

export default OrderProduct