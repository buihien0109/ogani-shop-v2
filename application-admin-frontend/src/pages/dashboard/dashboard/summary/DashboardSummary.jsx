import { Col, Row } from 'antd';
import React from 'react';
import SummaryBox from './SummaryBox';
import { formatCurrency } from '../../../../utils/functionUtils';

function DashboardSummary({ totalRevenue, totalPayment, profit, newOrders, newUsers, newBlogs }) {
    return (
        <Row gutter={[16, 16]}>
            <Col span={8}>
                <SummaryBox
                    title={`Doanh thu`}
                    content={formatCurrency(totalRevenue)}
                    className="primary"
                    link="/admin/orders"
                />
            </Col>
            <Col span={8}>
                <SummaryBox
                    title={`Chi phí`}
                    content={formatCurrency(totalPayment)}
                    className="info"
                    link="/admin/payment-vouchers"
                />
            </Col>
            <Col span={8}>
                <SummaryBox
                    title={`Lợi nhuận`}
                    content={formatCurrency(profit)}
                    className="info"
                    link="#"
                />
            </Col>
            <Col span={8}>
                <SummaryBox
                    title={`Đơn hàng mới`}
                    content={newOrders}
                    className="warning"
                    link="/admin/orders"
                />
            </Col>
            <Col span={8}>
                <SummaryBox
                    title={`User mới`}
                    content={newUsers}
                    className="warning"
                    link="/admin/users"
                />
            </Col>
            <Col span={8}>
                <SummaryBox
                    title={`Bài viết mới`}
                    content={newBlogs}
                    className="danger"
                    link="/admin/blogs"
                />
            </Col>
        </Row>
    )
}

export default DashboardSummary