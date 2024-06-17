import { Button, Flex, message, Modal, Table } from "antd";
import React from "react";
import { useUpdateProductQuantityMutation } from "../../../../app/services/product.service";

const ModalUpdateQuantity = ({ data, open, onCancel }) => {
    const [updateProductQuantity, { isLoading }] = useUpdateProductQuantityMutation();

    const handleConfirm = () => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn cập nhật số lượng sản phẩm trong kho?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xác nhận",
            okType: "primary",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoading }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    const requestData = data.map((item) => {
                        return {
                            productId: item.product.id,
                            quantity: item.quantity,
                        };
                    });

                    updateProductQuantity(requestData)
                        .unwrap()
                        .then(() => {
                            message.success("Cập nhật số lượng sản phẩm trong kho thành công!");
                            onCancel();
                            resolve();
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject(); // Không đóng modal nếu xóa thất bại
                        });

                });
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    }

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
            title: "Tên sản phẩm",
            dataIndex: "product",
            key: "name",
            render: (text, record, index) => {
                return text.name
            },
        },
        {
            title: "Số lượng đang có",
            dataIndex: "product",
            key: "stockQuantity",
            render: (text, record, index) => {
                return text.stockQuantity;
            },
        },
        {
            title: "Số lượng nhập",
            dataIndex: "quantity",
            key: "quantity",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Tổng cộng",
            dataIndex: "",
            key: "total",
            render: (text, record, index) => {
                return record.product.stockQuantity + record.quantity;
            },
        },
    ];

    return (
        <>
            <Modal
                open={open}
                title={`Cập nhật số lượng sản phẩm trong kho`}
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
                width={1000}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.product.id}
                    pagination={false}
                />

                <Flex justify="end" style={{ marginTop: "1rem" }}>
                    <Button
                        type="primary"
                        onClick={handleConfirm}
                        loading={isLoading}
                    >
                        Cập nhật
                    </Button>
                </Flex>
            </Modal>
        </>
    )
};
export default ModalUpdateQuantity;
