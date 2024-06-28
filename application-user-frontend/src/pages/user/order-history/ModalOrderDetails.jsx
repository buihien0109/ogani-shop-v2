import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCancelOrderByCustomerMutation } from '../../../app/apis/order.api';
import { formatCurrency, formatDate } from '../../../utils/functionUtils';
import useModalConfirm from '../../../components/modal/modal-confirm/useModalConfirm';
import ModalConfirm from '../../../components/modal/modal-confirm/ModalConfirm';

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

const parseShippingMethod = (shippingMethod) => {
    switch (shippingMethod) {
        case 'STANDARD':
            return <span className="badge text-bg-primary fw-normal">Giao hàng tiêu chuẩn</span>
        case 'EXPRESS':
            return <span className="badge text-bg-success fw-normal">Giao hàng nhanh</span>
        default:
            return <span className="badge text-bg-secondary fw-normal">Không xác định</span>
    }
}

function ModalOrderDetails({ order, show, handleClose }) {
    const { isOpen, openModal, closeModal } = useModalConfirm();
    const [cancelOrderByCustomer, { isLoading }] = useCancelOrderByCustomerMutation();

    const handleCancelOrder = (orderId) => {
        cancelOrderByCustomer(orderId)
            .unwrap()
            .then(() => {
                toast.success("Hủy đơn hàng thành công");
                closeModal();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
    }
    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết đơn hàng #{order.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12">
                            <div className="order-detail__title mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="fw-medium fs-5">Thông tin khách hàng</h5>
                                    {order.status === 'WAIT' && (
                                        <button
                                            onClick={() => openModal()}
                                            className="primary-btn bg-secondary border-0"
                                        >Hủy đơn hàng</button>
                                    )}
                                </div>

                                <div style={{ fontSize: 16 }}>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Họ tên:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.name} </span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">SĐT:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.phone}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Email:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.email}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Địa chỉ:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{`${order.address}, ${order.ward.name}, ${order.district.name}, ${order.province.name}`}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Ngày đặt:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Trạng thái:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parseOrderStatus(order.status)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Vận chuyển:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parseShippingMethod(order.shippingMethod)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 120 }}>
                                            <span className="font-weight-bold">Thanh toán:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parsePaymentMethod(order.paymentMethod)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="order-detail__title">
                                <h5 className="mb-2 fw-medium fs-5">Thông tin sản phẩm</h5>
                                <table id="order-history-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th style={{ width: "45%" }}>Sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Giá tiền</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {order.orderItems.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <span>{index + 1}</span>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/san-pham/${item.product.id}/${item.product.slug}`}
                                                        className="text-primary"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span>{item.quantity}</span>
                                                </td>
                                                <td>{formatCurrency(item.price)}</td>
                                                <td>{formatCurrency(item.quantity * item.price)}</td>
                                            </tr>
                                        ))}
                                        <tr className="fw-bold">
                                            <td colSpan="3"></td>
                                            <td>Thành tiền</td>
                                            <td>
                                                <span>{formatCurrency(order.temporaryAmount)}</span>
                                            </td>
                                        </tr>
                                        <tr className="fw-bold">
                                            <td colSpan="3"></td>
                                            <td>Giảm giá {order.couponCode ? `(${order.couponDiscount}%)` : ""}</td>
                                            <td colSpan="2">
                                                <span>{formatCurrency(order.discountAmount)}</span>
                                            </td>
                                        </tr>
                                        <tr className="fw-bold">
                                            <td colSpan="3"></td>
                                            <td>Tổng tiền</td>
                                            <td colSpan="2">
                                                <span>{formatCurrency(order.totalAmount)}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {isOpen && (
                <ModalConfirm
                    title="Xác nhận hủy đơn hàng"
                    message="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                    show={isOpen}
                    handleClose={closeModal}
                    handleConfirm={() => handleCancelOrder(order.id)}
                    okText="Xác nhận"
                />
            )}
        </>
    )
}

export default ModalOrderDetails