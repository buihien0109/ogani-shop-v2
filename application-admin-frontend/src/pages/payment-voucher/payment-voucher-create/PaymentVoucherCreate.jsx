import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Spin, message, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreatePaymentVoucherMutation } from "../../../app/services/paymentVoucher.service";
import { useGetUsersQuery } from "../../../app/services/user.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách phiếu chi", href: "/admin/payment-vouchers" },
    { label: "Tạo phiếu chi", href: "/admin/payment-vouchers/create" },
];
const PaymentVoucherCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { data: users, isLoading: isFetchingUsers } = useGetUsersQuery(undefined, {
        // select user has role is ADMIN in the list roles
        selectFromResult: ({ data }) => ({
            data: data?.filter((user) => user.roles.some((role) => role.name === "ADMIN")),
        }),
    });
    const [createPaymentVoucher, { isLoading }] = useCreatePaymentVoucherMutation();

    if (isFetchingUsers) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createPaymentVoucher(values).unwrap()
            })
            .then((data) => {
                message.success("Tạo phiếu chi thành công!");
                setTimeout(() => {
                    navigate(`/admin/payment-vouchers/${data.id}/detail`);
                }, 1500)
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    return (
        <>
            <Helmet>
                <title>Tạo phiếu chi</title>
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
                    <RouterLink to="/admin/payment-vouchers">
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
                        Tạo phiếu chi
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Mục đích chi"
                                name="purpose"
                                rules={[
                                    {
                                        required: true,
                                        message: "Mục đích chi không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter purpose" />
                            </Form.Item>

                            <Form.Item
                                label="Số tiền"
                                name="amount"
                                rules={[
                                    {
                                        required: true,
                                        message: "Số tiền không được để trống!",
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value <= 0) {
                                                return Promise.reject(
                                                    new Error("Số tiền phải lớn hơn 0")
                                                );
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Enter amount" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Ghi chú"
                                name="note"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ghi chú không được để trống!",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Enter note"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Người chi"
                                name="userId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Người chi không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select user"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={users?.map((user) => ({
                                        label: user.name,
                                        value: user.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default PaymentVoucherCreate;
