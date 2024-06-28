import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import breadcrumb from "../../../../public/breadcrumb.jpg";
import ErrorPage from '../../../components/error/ErrorPage';
import { IconFail, IconSuccess, IconWaiting } from '../../../components/icon/Icon';
import Loading from '../../../components/loading/Loading';
import { formatCurrency, formatDate } from '../../../utils/functionUtils';
import { useGetOrderByIdQuery } from '../../../app/apis/order.anonymous.api';

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

const getOrderMessage = (order) => {
    const messages = [
        {
            status: "WAIT",
            icon: <IconWaiting />,
            title: "Đặt hàng thành công!",
            content: `Cảm ơn bạn đã đặt thành công đơn hàng #${order.id}. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể để xác nhận đơn hàng`
        },
        {
            status: "WAIT_DELIVERY",
            icon: <IconWaiting />,
            title: "Đơn hàng đang trong quá trình chuẩn bị!",
            content: `Đơn hàng #${order.id} đang được chuẩn bị. Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao cho đơn vị vận chuyển`
        },
        {
            status: "DELIVERY",
            icon: <IconWaiting />,
            title: "Đơn hàng đang được giao!",
            content: `Đơn hàng #${order.id} đang được giao đến địa chỉ của bạn. Vui lòng kiểm tra thông tin đơn hàng`
        },
        {
            status: "COMPLETE",
            icon: <IconSuccess />,
            title: "Đơn hàng đã được giao thành công!",
            content: `Đơn hàng #${order.id} đã được giao thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi`
        },
        {
            status: "CANCELED",
            icon: <IconFail />,
            title: "Đơn hàng đã bị hủy!",
            content: `Đơn hàng #${order.id} đã bị hủy. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết`
        },
        {
            status: "RETURNED",
            icon: <IconFail />,
            title: "Đơn hàng đã được trả lại!",
            content: `Đơn hàng #${order.id} đã được trả lại. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết`
        }
    ]
    return messages.find(message => message.status === order.status);
}

function ConfirmOrder() {
    const { orderId } = useParams();
    const { data: order, isLoading, isError, error } = useGetOrderByIdQuery(orderId);
    console.log(order);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    const message = getOrderMessage(order);
    return (
        <>
            <Helmet>
                <title>Xác nhận đơn hàng</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>Xác nhận đơn hàng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="spad">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center mb-5">
                        {message.icon}
                        <div className="text-center">
                            <h4 className="fw-bold">{message.title}</h4>
                            <p className="my-2">{message.content}</p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-5">
                            <div className="order-detail__title">
                                <h5 className="mb-3 fw-bold">Thông tin khách hàng</h5>
                                <div style={{ fontSize: 15 }}>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Họ tên:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.name} </span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">SĐT:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.phone}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Email:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{order.email}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Địa chỉ:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{`${order.address}, ${order.ward.name}, ${order.district.name}, ${order.province.name}`}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Ngày đặt:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Trạng thái:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parseOrderStatus(order.status)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Vận chuyển:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parseShippingMethod(order.shippingMethod)}</span>
                                        </div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-2" style={{ width: 110 }}>
                                            <span className="font-weight-bold">Thanh toán:</span>
                                        </div>
                                        <div className="col-10" style={{ flex: 1 }}>
                                            <span>{parsePaymentMethod(order.paymentMethod)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-7">
                            <div className="order-detail__title">
                                <h5 className="mb-3 fw-bold">Thông tin sản phẩm</h5>
                                <table id="order-history-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th style={{width: "45%"}}>Sản phẩm</th>
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
                                            <td>Giảm giá</td>
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
                </div>
            </section>
        </>
    )
}

export default ConfirmOrder