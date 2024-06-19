import { LeftOutlined, PlusOutlined, RetweetOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Select, Space, Typography, message, theme } from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetDistrictsQuery, useGetWardsQuery } from "../../../app/services/address.service";
import { useCreateOrderMutation } from "../../../app/services/order.service";
import { useGetAddressesByUserQuery } from "../../../app/services/userAddress.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import ModalChoseAddress from "./components/ModalChoseAddress";
import ModalChoseUser from "./components/ModalChoseUser";
import OrderProduct from "./components/OrderProduct";

const breadcrumb = [
    { label: "Danh sách đơn hàng", href: "/admin/orders" },
    { label: "Tạo đơn hàng", href: "/admin/orders/create" },
];
const OrderCreate = () => {
    const { provinces } = useSelector(state => state.address);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openModalChoseUser, setOpenModalChoseUser] = useState(false);
    const [openModalChoseAddress, setOpenModalChoseAddress] = useState(false);
    const [provinceCode, setProvinceCode] = useState(null);
    const [districtCode, setDistrictCode] = useState(null);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const { data: districts } = useGetDistrictsQuery(provinceCode, { skip: !provinceCode });
    const { data: wards } = useGetWardsQuery(districtCode, { skip: !districtCode });
    const { data: userAddresses } = useGetAddressesByUserQuery(selectedUser?.id, { skip: !selectedUser, refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (provinceCode) {
            form.setFieldsValue({ district: null, ward: null });
        }
    }, [provinceCode])

    useEffect(() => {
        if (districtCode) {
            form.setFieldsValue({ ward: null });
        }
    }, [districtCode])

    useEffect(() => {
        form.resetFields();
        if (selectedUser) {
            form.setFieldValue('name', selectedUser.name);
            form.setFieldValue('email', selectedUser.email);
            form.setFieldValue('phone', selectedUser.phone);
        }
    }, [selectedUser])

    useEffect(() => {
        if (selectedAddress) {
            form.setFieldValue('province', selectedAddress.province.code);
            form.setFieldValue('district', selectedAddress.district.code);
            form.setFieldValue('ward', selectedAddress.ward.code);
            form.setFieldValue('address', selectedAddress.detail);
        } else {
            form.setFieldValue('province', null);
            form.setFieldValue('district', null);
            form.setFieldValue('ward', null);
            form.setFieldValue('address', null);
        }
    }, [selectedAddress])


    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createOrder(values).unwrap()
            })
            .then((data) => {
                message.success("Tạo đơn hàng thành công!");
                setTimeout(() => {
                    navigate(`/admin/orders/${data.id}/detail`);
                }, 1500)
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    const handleSetSelectedUser = (value) => {
        setSelectedUser(value)
    }

    const handleGetSelectedProduct = (value) => {
        const { product } = value;
        if (!product) return;
        const isExist = data.find((item) => item.product.id === product.id);
        if (isExist) {
            message.warning("Sản phẩm đã tồn tại trong danh sách");
        } else {
            setData([...data, value]);
            message.success("Thêm sản phẩm thành công");
        }
    }

    const handleUpdateSelectedProduct = (value) => {
        const { product, quantity } = value;
        const newData = data.map((item) => {
            if (item.product.id === product.id) {
                return {
                    ...item,
                    quantity: quantity,
                }
            }
            return item;
        });
        setData(newData);
        message.success("Cập nhật sản phẩm thành công!");
    }

    const handleDeleteSelectedProduct = (index) => {
        const newData = data.filter((_, i) => i !== index);
        setData(newData);
    }

    const handleGetSelectedCoupon = (value) => {
        setSelectedCoupon(value);
    }

    const handleGetSelectedAddress = (value) => {
        setProvinceCode(prev => value?.province?.code);
        setDistrictCode(prev => value?.district?.code);
        setSelectedAddress(prev => value);
    }

    return (
        <>
            <Helmet>
                <title>Tạo đơn hàng</title>
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
                <Space style={{ marginBottom: "1rem" }}>
                    <RouterLink to="/admin/orders">
                        <Button type="default" icon={<LeftOutlined />}>
                            Quay lại
                        </Button>
                    </RouterLink>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        loading={isLoading}
                    >
                        Tạo đơn hàng
                    </Button>
                    <Button
                        style={{ backgroundColor: "rgb(243, 156, 18)" }}
                        type="primary"
                        icon={<RetweetOutlined />}
                        onClick={() => setOpenModalChoseUser(true)}
                    >
                        Chọn user
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    {selectedUser && (
                        <>
                            <Row gutter={[16, 16]} wrap={true}>
                                <Col span={24}>
                                    <Typography.Title level={5}>Khách hàng đang chọn: {selectedUser?.name}</Typography.Title>
                                    <Typography.Paragraph
                                        style={{ color: "rgb(13, 110, 253)", cursor: "pointer" }}
                                        onClick={() => setOpenModalChoseAddress(true)}
                                    >
                                        Các địa chỉ nhận hàng của khách hàng
                                    </Typography.Paragraph>
                                    <Button
                                        type="primary"
                                        danger
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        Hủy chọn khách hàng
                                    </Button>
                                </Col>
                            </Row>
                            <Divider />
                        </>
                    )}
                    <Row gutter={[16, 16]} wrap={true}>
                        <Col span={8}>
                            <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
                            <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Email không được để trống!",
                                    },
                                    {
                                        type: "email",
                                        message: "Email không đúng định dạng!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Số điện thoại không được để trống!",
                                    },
                                    {
                                        pattern: new RegExp(/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/),
                                        message: 'Số điện thoại di động không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter phone" />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú đơn hàng (khách hàng)"
                                name="customerNote"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Enter customer note"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Typography.Title level={5}>Thông tin địa chỉ</Typography.Title>
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name="province"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Tỉnh/Thành phố không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a province"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={provinces?.map(province => ({
                                        label: province.name,
                                        value: province.code
                                    }))}
                                    onChange={(value) => {
                                        setProvinceCode(value)
                                        setDistrictCode(null)
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Quận/Huyện"
                                name="district"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Quận/Huyện không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a district"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={districts?.map(district => ({
                                        label: district.name,
                                        value: district.code
                                    }))}
                                    onChange={(value) => {
                                        setDistrictCode(value)
                                    }}
                                    disabled={!provinceCode}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Xã/Phường"
                                name="ward"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Xã/Phường không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a ward"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={wards?.map(ward => ({
                                        label: ward.name,
                                        value: ward.code
                                    }))}
                                    disabled={!districtCode}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ giao hàng"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: "Địa chỉ giao hàng không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter address" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Typography.Title level={5}>Thanh toán / Vận chuyển</Typography.Title>
                            <Form.Item
                                label="Phương thức thanh toán"
                                name="paymentMethod"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Phương thức thanh toán không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a payment method"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "Thanh toán khi nhận hàng", value: "COD" },
                                        { label: "Momo", value: "MOMO" },
                                        { label: "ZaloPay", value: "ZALO_PAY" },
                                        { label: "VNPay", value: "VN_PAY" },
                                        { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Phương thức vận chuyển"
                                name="shippingMethod"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Phương thức vận chuyển không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a shipping method"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "Tiêu chuẩn", value: "STANDARD" },
                                        { label: "Nhanh", value: "EXPRESS" },
                                    ]}
                                />
                            </Form.Item>

                            <Typography.Title level={5}>Ghi chú đơn hàng</Typography.Title>
                            <Form.Item
                                label="Ghi chú đơn hàng (Admin)"
                                name="adminNote"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Enter admin note"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Divider />

                <Typography.Title level={5}>Sản phẩm</Typography.Title>
                <OrderProduct
                    data={data}
                    coupon={selectedCoupon}
                    onDeleteSelectedProduct={handleDeleteSelectedProduct}
                    onUpdateSelectedProduct={handleUpdateSelectedProduct}
                    onGetSelectedProduct={handleGetSelectedProduct}
                    onGetSelectedCoupon={handleGetSelectedCoupon}
                />

                {openModalChoseUser && (
                    <ModalChoseUser
                        open={openModalChoseUser}
                        onCancel={() => setOpenModalChoseUser(false)}
                        onSetSelectedUser={handleSetSelectedUser}
                    />
                )}

                {openModalChoseAddress && selectedUser && (
                    <ModalChoseAddress
                        data={userAddresses}
                        currentAddress={selectedAddress}
                        open={openModalChoseAddress}
                        onCancel={() => setOpenModalChoseAddress(false)}
                        onGetSelectedAddress={handleGetSelectedAddress}
                    />
                )}
            </div>
        </>
    );
};

export default OrderCreate;
