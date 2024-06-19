import { Col, Row } from 'antd';
import React from 'react';
import { formatCurrency } from '../../../../utils/functionUtils';
import SummaryBox from '../../../dashboard/dashboard/summary/SummaryBox';

function ReportSummary({ totalRevenue, totalPayment, profit }) {
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
                    className="warning"
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
        </Row>
    )
}

export default ReportSummary