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
import ModalChoseUser from "./ModalChoseUser";

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

    const [selectedUser, setSelectedUser] = useState(null);
    const [openModalChoseUser, setOpenModalChoseUser] = useState(false);
    const [provinceCode, setProvinceCode] = useState(null);
    const [districtCode, setDistrictCode] = useState(null);
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const { data: districts } = useGetDistrictsQuery(provinceCode, { skip: !provinceCode });
    const { data: wards } = useGetWardsQuery(districtCode, { skip: !districtCode });
    const { data: userAddresses } = useGetAddressesByUserQuery(selectedUser?.id, { skip: !selectedUser, refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (provinceCode) {
            form.setFieldsValue({ district: null, ward: null });
            setDistrictCode(null);
        }
    }, [provinceCode])

    useEffect(() => {
        if (setDistrictCode) {
            form.setFieldsValue({ ward: null });
        }
    }, [setDistrictCode])

    useEffect(() => {
        if (selectedUser) {
            form.setFieldValue('name', selectedUser.name);
            form.setFieldValue('email', selectedUser.email);
            form.setFieldValue('phone', selectedUser.phone);
        }
    }, [selectedUser])

    useEffect(() => {
        if(!userAddresses) return;
        const defaultAddress = userAddresses?.find(address => address?.isDefault);
        if(defaultAddress) {
            setProvinceCode(defaultAddress?.province?.code);
            setDistrictCode(defaultAddress?.district?.code);
            form.setFieldsValue({
                province: defaultAddress?.province?.code,
                district: defaultAddress?.district?.code,
                ward: defaultAddress?.ward?.code,
                address: defaultAddress?.detail,
            });
        }

    }, [userAddresses])


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
        console.log(value);
        setSelectedUser(value)
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
                                        value: ward.name
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
                        </Col>
                    </Row>
                </Form>

                {openModalChoseUser && (
                    <ModalChoseUser
                        open={openModalChoseUser}
                        setOpen={setOpenModalChoseUser}
                        onSetSelectedUser={handleSetSelectedUser}
                    />
                )}
                <Divider />
            </div>
        </>
    );
};

export default OrderCreate;
