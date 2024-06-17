import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    message,
    theme
} from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
    useDeletePaymentVoucherMutation,
    useGetPaymentVoucherByIdQuery,
    useUpdatePaymentVoucherMutation
} from "../../../app/services/paymentVoucher.service";
import { useGetUsersQuery } from "../../../app/services/user.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const PaymentVoucherDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { paymentVoucherId } = useParams();

    const { data: users, isLoading: isFetchingUsers } = useGetUsersQuery(undefined, {
        // select user has role is ADMIN in the list roles
        selectFromResult: ({ data }) => ({
            data: data?.filter((user) => user.roles.some((role) => role.name === "ADMIN")),
        }),
    });
    const { data: paymentVoucher, isLoading: isFetchingPaymentVoucher } = useGetPaymentVoucherByIdQuery(paymentVoucherId);
    const [updatePaymentVoucher, { isLoading: isLoadingUpdatePaymentVoucher }] = useUpdatePaymentVoucherMutation();
    const [deletePaymentVoucher, { isLoading: isLoadingDeletePaymentVoucher }] = useDeletePaymentVoucherMutation();

    const breadcrumb = [
        { label: "Danh sách phiếu chi", href: "/admin/payment-vouchers" },
        { label: `Phiếu chi #${paymentVoucher?.id}`, href: `/admin/payment-vouchers/${paymentVoucher?.id}/detail` },
    ];

    if (isFetchingUsers || isFetchingPaymentVoucher) {
        return <Spin size="large" fullscreen />;
    }

    const handleUpdate = () => {
        form.validateFields()
            .then((values) => {
                return updatePaymentVoucher({ id: paymentVoucher.id, ...values }).unwrap();
            })
            .then((data) => {
                message.success("Cập nhật thông tin phiếu chi thành công!");
            })
            .catch((error) => {
                console.log(error);
                message.error(error.data.message);
            });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa phiếu chi này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            onOk: () => {
                deletePaymentVoucher(paymentVoucher.id)
                    .unwrap()
                    .then((data) => {
                        message.success("Xóa phiếu chi thành công!");
                        setTimeout(() => {
                            navigate("/admin/payment-vouchers");
                        }, 1500);
                    })
                    .catch((error) => {
                        message.error(error.data.message);
                    });
            },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            ),
        });
    };

    return (
        <>
            <Helmet>
                <title>{`Phiếu chi #${paymentVoucher?.id}`}</title>
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
                        <RouterLink to="/admin/payment-vouchers">
                            <Button type="default" icon={<LeftOutlined />}>
                                Quay lại
                            </Button>
                        </RouterLink>
                        <Button
                            style={{ backgroundColor: "rgb(60, 141, 188)" }}
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleUpdate}
                            loading={isLoadingUpdatePaymentVoucher}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        loading={isLoadingDeletePaymentVoucher}
                    >
                        Xóa phiếu chi
                    </Button>
                </Flex>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{
                        ...paymentVoucher,
                        userId: paymentVoucher?.user?.id,
                    }}
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
            </div >
        </>
    );
};

export default PaymentVoucherDetail;
