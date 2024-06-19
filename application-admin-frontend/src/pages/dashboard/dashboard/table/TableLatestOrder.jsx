import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { formatCurrency } from "../../../../utils/functionUtils";

const parseOrderStatus = (status) => {
    switch (status) {
        case "WAIT":
            return <Tag color="default">Chờ xác nhận</Tag>;
        case "WAIT_DELIVERY":
            return <Tag color="processing">Chờ giao hàng</Tag>;
        case "DELIVERY":
            return <Tag color="warning">Đang giao hàng</Tag>;
        case "COMPLETE":
            return <Tag color="success">Hoàn thành</Tag>;
        case "CANCELED":
            return <Tag color="error">Đã hủy</Tag>;
        case "RETURNED":
            return <Tag color="warning">Đã trả hàng</Tag>;
        default:
            return <Tag color="default">Chưa cập nhật</Tag>;
    }
};

const parsePaymentMethod = (method) => {
    switch (method) {
      case "COD":
        return <Tag color="processing">COD</Tag>;
      case "MOMO":
        return <Tag color="warning">MOMO</Tag>;
      case "VN_PAY":
        return <Tag color="success">VNPAY</Tag>;
      case "ZALO_PAY":
        return <Tag color="blue">ZALO PAY</Tag>;
      case "BANK_TRANSFER":
        return <Tag color="volcano">Chuyển khoản ngân hàng</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  }

const columns = [
    {
        title: "Mã đơn hàng",
        dataIndex: "id",
        key: "id",
        render: (text, record, index) => {
            return (
                <RouterLink to={`/admin/orders/${record?.id}/detail`}>
                    {text}
                </RouterLink>
            );
        },
    },
    {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (text, record, index) => {
            return parseOrderStatus(text);
        },
    },
    {
        title: "Hình thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (text, record, index) => {
            return parsePaymentMethod(text);
        },
    },
    {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (text, record, index) => {
            return formatCurrency(text);
        },
    },
];

function TableLatestOrder({ data }) {
    return (
        <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record?.id}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
        />
    );
}

export default TableLatestOrder;
