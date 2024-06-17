import { Table, Tag } from "antd";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useSearchTable from "../../../hooks/useSearchTable";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";

// Discount Campaign Type: PERCENT, AMOUNT, SAME_PRICE
const parseDiscountCampaignType = (type) => {
    switch (type) {
        case "PERCENT":
            return <Tag color="success">Phần trăm</Tag>;
        case "AMOUNT":
            return <Tag color="warning">Số tiền</Tag>;
        case "SAME_PRICE":
            return <Tag color="default">Giá cố định</Tag>;
        default:
            return <Tag color="default">Chưa cập nhật</Tag>;
    }
};

const parseDiscountCampaignValue = (type, value) => {
    switch (type) {
        case "PERCENT":
            return `${value}%`;
        case "AMOUNT":
        case "SAME_PRICE":
            return formatCurrency(value);
        default:
            return "Chưa cập nhật";
    }

}

const DiscountCampaignTable = ({ data }) => {
    const { getColumnSearchProps } = useSearchTable();

    const columns = [
        {
            title: "Tên khuyến mại",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name, 'vi'),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return (
                    <RouterLink to={`/admin/discount-campaigns/${record.id}/detail`}>
                        {text}
                    </RouterLink>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                if (record.status) {
                    return <Tag color="success">Kích hoạt</Tag>;
                } else {
                    return <Tag color="default">Ẩn</Tag>;
                }
            },
        },
        {
            title: "Hình thức giảm",
            dataIndex: "type",
            key: "type",
            ...getColumnSearchProps('type'),
            render: (text, record, index) => {
                return parseDiscountCampaignType(text);
            },
        },
        {
            title: "Giá trị giảm",
            dataIndex: "value",
            key: "value",
            render: (text, record, index) => {
                return parseDiscountCampaignValue(record.type, text);
            },
        },
        {
            title: "Thời gian",
            dataIndex: "",
            key: "date",
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            sortDirections: ['descend', 'ascend'],
            render: (text, record, index) => {
                return (
                    <>
                        <Tag color="blue" style={{ marginRight: 0 }}>{formatDate(record.startDate)}</Tag>
                        &nbsp;-&nbsp;
                        <Tag color="blue">{formatDate(record.endDate)}</Tag>
                    </>
                );
            },
        },
        {
            title: "Số sản phẩm",
            dataIndex: "products",
            key: "products",
            render: (text, record, index) => {
                return text.length;
            },
        },
        {
            title: "Ngày tạo",
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
export default DiscountCampaignTable;
