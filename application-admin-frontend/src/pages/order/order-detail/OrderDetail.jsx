import { LeftOutlined, RetweetOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Tag,
    Typography,
    message,
    theme
} from "antd";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
    useGetOrderByIdQuery,
    useUpdateOrderMutation
} from "../../../app/services/order.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { formatCurrency, formatDate } from "../../../utils/functionUtils";
import ProductTable from "./ProductTable";

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

const OrderDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { orderId } = useParams();

    const { data: order, isLoading: isFetchingOrder } = useGetOrderByIdQuery(orderId);
    const [updateOrder, { isLoading: isLoadingUpdateOrder }] = useUpdateOrderMutation();

    const breadcrumb = [
        { label: "Danh sách đơn hàng", href: "/admin/orders" },
        { label: `Đơn hàng #${order?.id}`, href: `/admin/orders/${order?.id}/detail` },
    ];

    if (isFetchingOrder) {
        return <Spin size="large" fullscreen />;
    }

    const handleUpdate = () => {
        form.validateFields()
            .then((values) => {
                const { status } = values;
                if (status === "CANCELED" || status === "RETURNED") {
                    return handleConfirm(values);
                } else {
                    return updateOrder({ id: order?.id, ...values, }).unwrap();
                }
            })
            .then((data) => {
                message.success("Cập nhật thông tin đơn hàng thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const handleConfirm = (values) => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành ${values.status}?`,
                content: "Hành động này không thể hoàn tác!",
                okText: "Xác nhận",
                okType: "danger",
                cancelText: "Hủy",
                okButtonProps: { loading: isLoadingUpdateOrder }, // Hiển thị loading trên nút OK
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        updateOrder({ id: order?.id, ...values })
                            .unwrap()
                            .then(() => {
                                message.success("Cập nhật thông tin đơn hàng thành công!");
                                resolve();
                            })
                            .catch((error) => {
                                message.error(error.data.message);
                                reject(error);
                            });
                    });
                },
                footer: (_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <OkBtn />
                    </>
                ),
            });
        })
    };

    const handleCheckPayment = () => {
        message.warning("Chức năng đang phát triển!");
    };

    return (
        <>
            <Helmet>
                <title>{`Đơn hàng #${order?.id}`}</title>
            </Helmet>
            <AppBreadCrumb items={breadcrumb} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Flex justify="space-between" align="center" style={{ marginBottom: "1rem" }}>
                    <Space>
                        <RouterLink to="/admin/orders">
                            <Button type="default" icon={<LeftOutlined />}>
                                Quay lại
                            </Button>
                        </RouterLink>
                        {["WAIT", "WAIT_DELIVERY", "DELIVERY", "COMPLETE"].includes(order?.status) && (
                            <Button
                                style={{ backgroundColor: "rgb(60, 141, 188)" }}
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleUpdate}
                                loading={isLoadingUpdateOrder}
                            >
                                Cập nhật
                            </Button>
                        )}

                        {["MOMO", "VN_PAY", "ZALO_PAY"].includes(order?.paymentMethod)
                            && ["WAIT", "WAIT_DELIVERY", "DELIVERY", "COMPLETE"].includes(order?.status)
                            && (
                                <Button
                                    style={{ backgroundColor: "rgb(243, 156, 18)" }}
                                    type="primary"
                                    icon={<RetweetOutlined />}
                                    onClick={handleCheckPayment}
                                >
                                    Kiểm tra thanh toán
                                </Button>
                            )}
                    </Space>
                </Flex>

                <Row gutter={[16, 16]} wrap={true}>
                    <Col span={8}>
                        <Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>
                        <Divider />
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Mã đơn hàng:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.id}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Thanh toán:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{parsePaymentMethod(order?.paymentMethod)}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Vận chuyển:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{parseShippingMethod(order?.shippingMethod)}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Ghi chú (KH):</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.customerNote}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Địa chỉ giao hàng</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    {order?.address}, {order?.ward.name}, {order?.district.name}, {order?.province.name}
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Ngày đặt:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{formatDate(order?.createdAt)}</Typography.Paragraph>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
                        <Divider />
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Khách hàng:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    {order?.userType === "USER"
                                        ? <Link to={`/admin/users/${order?.user.id}/detail`}>{order?.name}</Link>
                                        : order?.name
                                    }
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Điện thoại:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.phone}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Email:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>{order?.email}</Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Thành tiền:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Tag color="blue">{formatCurrency(order?.temporaryAmount)}</Tag>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Giảm giá {order?.couponCode ? `(${order?.couponDiscount}%)` : ""}:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Tag color="blue">{formatCurrency(order?.discountAmount)}</Tag>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                <Typography.Paragraph strong>Tổng tiền:</Typography.Paragraph>
                            </Col>
                            <Col span={17}>
                                <Typography.Paragraph>
                                    <Tag color="blue">{formatCurrency(order?.totalAmount)}</Tag>
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Typography.Title level={5}>Trạng thái đơn hàng</Typography.Title>
                        <Divider />

                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            disabled={order?.status === "CANCELED" || order?.status === "RETURNED"}
                            initialValues={{
                                ...order
                            }}
                        >
                            <Form.Item
                                label="Trạng thái đơn hàng"
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Trạng thái đơn hàng không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a status"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "Chờ xác nhận", value: "WAIT" },
                                        { label: "Chờ giao hàng", value: "WAIT_DELIVERY" },
                                        { label: "Đang giao hàng", value: "DELIVERY" },
                                        { label: "Hoàn thành", value: "COMPLETE" },
                                        { label: "Đã hủy", value: "CANCELED" },
                                        { label: "Đã trả hàng", value: "RETURNED" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú đơn hàng (Admin)"
                                name="adminNote"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Enter admin note"
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

                <Divider style={{ borderWidth: 5 }} />

                <Row gutter={[16, 16]} wrap={true}>
                    <Col span={24}>
                        <Typography.Title level={5}>Thông tin sản phẩm</Typography.Title>
                        <ProductTable data={order?.orderItems} couponDiscount={order?.couponDiscount} />
                    </Col>
                </Row>
            </div >
        </>
    );
};

export default OrderDetail;
