import { Col, Row } from 'antd'
import React from 'react'
import ProductChart from './ProductChart'
import RevenueExpenseChart from './RevenueExpenseChart'

function ViewChart({ bestSellingProducts, revenueAndExpenseList }) {
    return (
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <ProductChart data={bestSellingProducts} />
            </Col>
            <Col span={12}>
                <RevenueExpenseChart data={revenueAndExpenseList} />
            </Col>
        </Row>
    )
}

export default ViewChart