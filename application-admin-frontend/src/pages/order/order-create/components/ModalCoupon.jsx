import { Button, message, Modal, Table } from 'antd';
import React from 'react';
import { useGetValidCouponsQuery } from '../../../../app/services/coupon.service';
import { formatCurrency } from '../../../../utils/functionUtils';

const calculateTotalAmount = (data) => {
    return data.reduce((total, item) => total + item.quantity * item.product.price, 0);
};
function ModalCoupon({ data, coupon: currentCoupon, open, onCancel, onGetSelectedCoupon }) {
    const { data: coupons, isLoading } = useGetValidCouponsQuery();

    const columns = [
        {
            title: "Mã giảm giá",
            dataIndex: "code",
            key: "code",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Mức giảm",
            dataIndex: "discount",
            key: "discount",
            render: (text, record, index) => {
                return `${text}%`
            },
        },
        {
            title: "Tổng tiền",
            dataIndex: "",
            key: "totalAmout",
            render: (text, record, index) => {
                return formatCurrency(calculateTotalAmount(data));
            },
        },
        {
            title: "Tổng tiền sau khi giảm",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record, index) => {
                return formatCurrency(calculateTotalAmount(data) * (1 - record.discount / 100));
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            onGetSelectedCoupon(record);
                            onCancel();
                            message.success("Áp dụng mã giảm giá thành công!");
                        }}
                        disabled={currentCoupon && currentCoupon.id === record.id}
                    >{currentCoupon && currentCoupon.id === record.id ? "Đang áp dụng" : "Áp dụng"}</Button>
                );
            },
        },
    ];
    return (
        <>
            <Modal
                open={open}
                title={`Chọn mã giảm giá`}
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
                width={1100}
            >
                <Table
                    columns={columns}
                    dataSource={coupons}
                    rowKey={(record) => record.id}
                    pagination={false}
                />
            </Modal>
        </>
    )
}

export default ModalCoupon