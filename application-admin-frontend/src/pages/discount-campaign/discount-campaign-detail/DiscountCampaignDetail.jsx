import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Typography,
    message,
    theme
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../app/services/category.service";
import { useGetDiscountCampaignByIdQuery, useUpdateDiscountCampaignMutation } from "../../../app/services/discountCampaign.service";
import { useGetProductsQuery } from "../../../app/services/product.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { formatDate } from "../../../utils/functionUtils";
import ProductTable from "./ProductTable";

const DiscountCampaignDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const { campaignId } = useParams();

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);
    const [type, setType] = useState(null);
    const [value, setValue] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const { data: campaign, isLoading: isFetchingCampaign } = useGetDiscountCampaignByIdQuery(campaignId);
    const { data: products, isLoading: isFetchingProducts } = useGetProductsQuery();
    const { data: categories, isLoading: isFetchingCategories } = useGetCategoriesQuery(undefined, {
        selectFromResult: ({ data }) => ({
            data: data?.filter((category) => category.parent !== null),
        }),
    });
    const [updateDiscountCampaign, { isLoading: isLoadingUpdateDiscountCampaign }] = useUpdateDiscountCampaignMutation();

    const breadcrumb = [
        { label: "Danh sách khuyến mại", href: "/admin/discount-campaigns" },
        { label: campaign?.name, href: `/admin/discount-campaigns/${campaign?.id}/detail` },
    ];

    useEffect(() => {
        if (campaign) {
            setSelectedProducts(campaign?.products ?? []);
            setType(campaign?.type);
            setValue(campaign?.value);
        }
    }, [campaign]);

    useEffect(() => {
        if (selectedProducts) {
            form.setFieldsValue({
                productIds: selectedProducts.map((product) => product.id),
            });
        }
    }, [selectedProducts]);

    if (isFetchingCampaign || isFetchingProducts || isFetchingCategories) {
        return <Spin size="large" fullscreen />;
    }

    const handleUpdate = () => {
        form.validateFields()
            .then((values) => {
                const startDate = values.time[0];
                const endDate = values.time[1];
                let { time, ...data } = values;
                data = { ...data, startDate, endDate };
                console.log(data);
                return updateDiscountCampaign({ id: campaign.id, ...data }).unwrap()
            })
            .then((data) => {
                message.success("Cập nhật khuyến mại thành công!");
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    const handleGetProductToDelete = (productIds) => {
        console.log(productIds);
        setDeletedProducts(productIds ?? []);
    }

    const handleDeleteProduct = () => {
        setSelectedProducts(selectedProducts.filter((product) => !deletedProducts.includes(product.id)));
        setDeletedProducts([]);
    }

    return (
        <>
            <Helmet>
                <title>{campaign.name}</title>
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
                        icon={<SaveOutlined />}
                        onClick={handleUpdate}
                        loading={isLoadingUpdateDiscountCampaign}
                    >
                        Cập nhật
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{
                        ...campaign,
                        time: [
                            dayjs(formatDate(campaign.startDate), 'DD/MM/YYYY'),
                            dayjs(formatDate(campaign.endDate), 'DD/MM/YYYY')
                        ],
                        productIds: selectedProducts.map((product) => product.id),
                    }}
                >
                    <Row gutter={[16, 16]} wrap={true}>
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
                                    onChange={(value) => {
                                        setType(value);
                                    }}
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
                                <InputNumber
                                    placeholder="Enter value"
                                    style={{ width: "100%" }}
                                    onChange={(value) => {
                                        setValue(value);
                                    }}
                                />
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

                        <Col span={16}>
                            <Typography.Title level={5}>Lựa chọn sản phẩm áp dụng</Typography.Title>

                            <Space style={{ marginBottom: "1rem" }}>
                                <Button
                                    style={{ backgroundColor: "rgb(60, 141, 188)" }}
                                    type="primary"
                                    onClick={() => setSelectedProducts(products)}
                                >
                                    Tất cả sản phẩm
                                </Button>
                                <Button
                                    style={{ backgroundColor: "rgb(243, 156, 18)" }}
                                    type="primary"
                                    onClick={() => setOpen(true)}
                                >
                                    Chọn theo danh mục
                                </Button>
                                <Button
                                    danger
                                    type="primary"
                                    disabled={deletedProducts.length === 0}
                                    onClick={handleDeleteProduct}
                                >
                                    Xóa sản phẩm
                                </Button>
                            </Space>

                            <Form.Item
                                name="productIds"
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Chọn sản phẩm"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={products.map((product) => ({
                                        label: product.name,
                                        value: product.id,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedProducts(
                                            products.filter((product) => value.includes(product.id))
                                        );
                                    }}
                                />
                            </Form.Item>

                            <ProductTable
                                data={selectedProducts}
                                type={type}
                                value={value}
                                onGetProductToDelete={handleGetProductToDelete}
                            />
                        </Col>
                    </Row>
                </Form>

                <Modal
                    open={open}
                    title="Chọn danh mục"
                    footer={null}
                    onCancel={() => setOpen(false)}
                >
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        showSearch
                        placeholder="Chọn danh mục"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        options={categories?.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                        onChange={(value) => {
                            setSelectedCategories(value);
                        }}
                    />
                    <Space style={{ marginTop: "1rem" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setSelectedProducts(
                                    products.filter((product) => selectedCategories.includes(product.category.id))
                                );
                                setOpen(false);
                            }}
                        >
                            Xác nhận
                        </Button>
                    </Space>
                </Modal>
            </div>
        </>
    );
};

export default DiscountCampaignDetail;
