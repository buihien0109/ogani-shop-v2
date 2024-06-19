import { Button, message, Modal, Table } from 'antd';
import React from 'react';

function ModalChoseAddress({ data, currentAddress, open, onCancel, onGetSelectedAddress }) {
    const columns = [
        {
            title: "STT",
            dataIndex: "",
            key: "index",
            render: (text, record, index) => {
                return index + 1;
            },
        },
        {
            title: "Địa chỉ",
            dataIndex: "",
            key: "address",
            render: (text, record, index) => {
                return `${record.detail}, ${record.ward.name}, ${record.district.name}, ${record.province.name}`
            },
        },
        {
            title: "Mặc định",
            dataIndex: "isDefault",
            key: "isDefault",
            render: (text, record, index) => {
                return record.isDefault ? "Mặc định" : "";
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Button
                        type={currentAddress && currentAddress.id === record.id ? "default" : "primary"}
                        onClick={() => {
                            if (currentAddress && currentAddress.id === record.id) {
                                onGetSelectedAddress(null);
                                message.success("Hủy áp dụng địa chỉ giao hàng thành công!");
                            } else {
                                onGetSelectedAddress(record);
                                message.success("Áp dụng địa chỉ giao hàng thành công!");
                            }
                            onCancel();
                        }}
                    >{currentAddress && currentAddress.id === record.id ? "Hủy áp dụng" : "Áp dụng"}</Button>
                );
            },
        },
    ];
    return (
        <>
            <Modal
                open={open}
                title={`Chọn địa chỉ giao hàng`}
                footer={null}
                onCancel={onCancel}
                width={1100}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.id}
                    pagination={false}
                />
            </Modal>
        </>
    )
}

export default ModalChoseAddress