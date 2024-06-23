import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, message, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateDiscountCampaignMutation } from "../../../app/services/discountCampaign.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách khuyến mại", href: "/admin/discount-campaigns" },
    { label: "Tạo khuyến mại", href: "/admin/discount-campaigns/create" },
];
const DiscountCampaignCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [createDiscountCampaign, { isLoading }] = useCreateDiscountCampaignMutation();

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                // TODO: Làm sao để mất giá trị giờ, phút giây trong LocalDateTime
                const startDate = values.time[0].format("YYYY-MM-DDTHH:mm:ss");
                const endDate = values.time[1].format("YYYY-MM-DDTHH:mm:ss");
                let { time, ...data } = values;
                data = { ...data, startDate, endDate };
                console.log(data);
                return createDiscountCampaign(data).unwrap()
            })
            .then((data) => {
                message.success("Tạo khuyến mại thành công!");
                setTimeout(() => {
                    navigate(`/admin/discount-campaigns/${data.id}/detail`);
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
                <title>Tạo khuyến mại</title>
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
                    <RouterLink to="/admin/discount-campaigns">
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
                        Tạo khuyến mại
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Row>
                        <Col span={8}>
                            <Form.Item
                                label="Tên khuyến mại"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên khuyến mại không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>

                            <Form.Item
                                label="Mô tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Mô tả không được để trống!",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={6}
                                    placeholder="Enter description"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Hình thức giảm"
                                name="type"
                                rules={[
                                    {
                                        required: true,
                                        message: "Hình thức giảm không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a type"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "Phần trăm", value: "PERCENT" },
                                        { label: "Số tiền", value: "AMOUNT" },
                                        { label: "Giá cố định", value: "SAME_PRICE" },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Giá trị giảm"
                                name="value"
                                rules={[
                                    {
                                        required: true,
                                        message: "Giá trị giảm không được để trống!",
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value <= 0) {
                                                return Promise.reject(
                                                    "Giá trị giảm phải lớn hơn 0!"
                                                );
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Enter value" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái"
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Trạng thái không được để trống!",
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
                                        { label: "Ẩn", value: false },
                                        { label: "Kích hoạt", value: true },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Thời gian áp dụng"
                                name="time"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Thời gian áp dụng không được để trống!",
                                    },
                                ]}
                            >
                                <DatePicker.RangePicker
                                    style={{ width: "100%" }}
                                    format={"DD/MM/YYYY"}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default DiscountCampaignCreate;
