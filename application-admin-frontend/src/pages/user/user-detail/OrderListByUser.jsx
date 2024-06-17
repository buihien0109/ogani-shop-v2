import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";

// OrderStatus: WAIT, WAIT_DELIVERY, DELIVERY, COMPLETE, CANCELED, RETURNED;
const parseOrderStatus = (status) => {
  switch (status) {
    case "WAIT":
      return <Tag color="default">Chờ xác nhận</Tag>;
    case "WAIT_DELIVERY":
      return <Tag color="processing">Chờ giao hàng</Tag>;
    case "DELIVERY":
      return <Tag color="processing">Đang giao hàng</Tag>;
    case "COMPLETE":
      return <Tag color="success">Hoàn thành</Tag>;
    case "CANCELED":
      return <Tag color="error">Đã hủy</Tag>;
    case "RETURNED":
      return <Tag color="warning">Đã trả hàng</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
}

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

// ShippingMethod: STANDARD, EXPRESS;
const parseShippingMethod = (method) => {
  switch (method) {
    case "STANDARD":
      return <Tag color="processing">Tiêu chuẩn</Tag>;
    case "EXPRESS":
      return <Tag color="success">Nhanh</Tag>;
    default:
      return <Tag color="default">Không xác định</Tag>;
  }
}


const OrderListByUser = ({ data }) => {
  const { getColumnSearchProps } = useSearchTable();
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps('id'),
      render: (text, record, index) => {
        return (
          <RouterLink to={`/admin/orders/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status, 'vi'),
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return parseOrderStatus(text);
      },
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod, 'vi'),
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return parsePaymentMethod(text);
      },
    },
    {
      title: "Hình thức giao hàng",
      dataIndex: "shippingMethod",
      key: "shippingMethod",
      sorter: (a, b) => a.shippingMethod.localeCompare(b.shippingMethod, 'vi'),
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return parseShippingMethod(text);
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return formatCurrency(text);
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortDirections: ['descend', 'ascend'],
      render: (text, record, index) => {
        return formatDate(text);
      },
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey={(record) => record.id} />;
}
export default OrderListByUser;
