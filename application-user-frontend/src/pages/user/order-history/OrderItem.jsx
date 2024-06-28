import React, { useState } from 'react'
import { formatCurrency, formatDate } from '../../../utils/functionUtils'
import ModalOrderDetails from './ModalOrderDetails'

const parseOrderStatus = (status) => {
    switch (status) {
        case 'WAIT':
            return <span className="badge text-bg-warning fw-normal text-white">Chờ xác nhận</span>
        case 'WAIT_DELIVERY':
            return <span className="badge text-bg-info fw-normal text-white">Chờ giao hàng</span>
        case 'DELIVERY':
            return <span className="badge text-bg-primary fw-normal">Đang giao hàng</span>
        case 'COMPLETE':
            return <span className="badge text-bg-success fw-normal">Hoàn thành</span>
        case 'CANCELED':
            return <span className="badge text-bg-secondary fw-normal">Đã hủy</span>
        case 'RETURNED':
            return <span className="badge text-bg-danger fw-normal">Đã trả hàng</span>
        default:
            return <span className="badge text-bg-primary fw-normal">Không xác định</span>
    }
}

const parsePaymentMethod = (paymentMethod) => {
    switch (paymentMethod) {
        case "COD":
            return <span className="badge text-bg-danger fw-normal">COD</span>
        case 'MOMO':
            return <span className="badge text-bg-primary fw-normal">Momo</span>
        case 'ZALO_PAY':
            return <span className="badge text-bg-success fw-normal">ZaloPay</span>
        case 'VN_PAY':
            return <span className="badge text-bg-warning fw-normal text-white">VNPay</span>
        case 'BANK_TRANSFER':
            return <span className="badge text-bg-info fw-normal text-white">Chuyển khoản ngân hàng</span>
        default:
            return <span className="badge text-bg-secondary fw-normal">Không xác định</span>
    }
}

function OrderItem({ order }) {
    const [show, setShow] = useState(false)
    return (
        <>
            <tr>
                <td>
                    <span
                        onClick={() => setShow(true)}
                        className="text-primary"
                        style={{ cursor: 'pointer' }}
                    >{order.id}</span>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>{formatCurrency(order.totalAmount)}đ</td>
                <td>{parsePaymentMethod(order.paymentMethod)}</td>
                <td>{parseOrderStatus(order.status)}</td>
            </tr>

            <ModalOrderDetails
                order={order}
                show={show}
                handleClose={() => setShow(false)}
            />
        </>
    )
}

export default OrderItem