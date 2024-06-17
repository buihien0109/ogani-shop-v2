import { Table } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency } from "../../../utils/functionUtils";

const ProductTable = ({ data, type, value, onGetProductToDelete }) => {
  const { getColumnSearchProps } = useSearchTable();

  // Discount Campaign Type: PERCENT, AMOUNT, SAME_PRICE
  const calculateDiscountPrice = (price, type, value) => {
    switch (type) {
      case "PERCENT":
        return price - (price * value) / 100;
      case "AMOUNT":
        return price - value;
      case "SAME_PRICE":
        return value;
      default:
        return price;
    }
  }

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),
      render: (text, record, index) => {
        return (
          <RouterLink to={`/admin/products/${record.id}/detail`}>
            {text}
          </RouterLink>
        );
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => {
        return formatCurrency(text)
      },
    },
    {
      title: "Giá khuyến mại",
      dataIndex: "price",
      key: "discountPrice",
      render: (text, record, index) => {
        return formatCurrency(calculateDiscountPrice(text, type, value));
      },
    },
  ];

  return (
    <Table
      rowSelection={
        {
          type: 'checkbox',
          selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE
          ],
          onChange: (selectedRowKeys, selectedRows) => {
            onGetProductToDelete(selectedRowKeys)
          }
        }
      }
      columns={columns}
      dataSource={data}
      rowKey={(record) => record.id}
    />
  );
}
export default ProductTable;
