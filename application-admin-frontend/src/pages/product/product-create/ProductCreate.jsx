import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Space,
    Spin,
    message,
    theme
} from "antd";
import "easymde/dist/easymde.min.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../app/services/category.service";
import { useCreateProductMutation } from "../../../app/services/product.service";
import { useGetSuppliersQuery } from "../../../app/services/supplier.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách sản phẩm", href: "/admin/products" },
    { label: "Tạo sản phẩm", href: "/admin/products/create" },
];
const ProductCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [selectedParentId, setSelectedParentId] = useState(null);
    const { data: suppliers, isLoading: isFetchingSuppliers } = useGetSuppliersQuery();
    const { data: categories, isLoading: isFetchingCategories } = useGetCategoriesQuery();
    const [createProduct, { isLoading }] = useCreateProductMutation();

    if (isFetchingSuppliers) {
        return <Spin size="large" fullscreen />
    }

    const parentCategories = categories?.filter((category) => !category.parent);
    const childrenCategories = categories?.filter((category) => category?.parent?.id === selectedParentId);

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                const { parentCategoryId, ...rest } = values;
                return createProduct(rest).unwrap();
            })
            .then((data) => {
                message.success("Tạo sản phẩm thành công!");
                setTimeout(() => {
                    navigate(`/admin/products/${data.id}/detail`);
                }, 1500);
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
                <title>Tạo sản phẩm</title>
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
                    <RouterLink to="/admin/products">
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
                        Tạo sản phẩm
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{ description: "" }}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                label="Tên sản phẩm"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên sản phẩm không được để trống!",
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
                                        message:
                                            "Mô tả không được để trống!",
                                    },
                                ]}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        form.setFieldsValue({ description: data });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Trạng thái"
                                name="published"
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
                                    placeholder="Select a published"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={[
                                        { label: "Nháp", value: false },
                                        { label: "Công khai", value: true },
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số lượng"
                                name="stockQuantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Số lượng không được để trống!",
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value <= 0) {
                                                return Promise.reject(
                                                    new Error("Số lượng phải lớn hơn 0")
                                                );
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Enter stock quantity" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Giá tiền"
                                name="price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Giá tiền không được để trống!",
                                    },
                                    {
                                        validator: (_, value) => {
                                            if (value <= 0) {
                                                return Promise.reject(
                                                    new Error("Giá tiền phải lớn hơn 0")
                                                );
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <InputNumber placeholder="Enter price" style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item
                                label="Trạng thái kinh doanh"
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Trạng thái kinh doanh không được để trống!",
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
                                        { label: "Chưa bán", value: "NOT_YET_SOLD" },
                                        { label: "Còn hàng", value: "AVAILABLE" },
                                        { label: "Hết hàng", value: "UNAVAILABLE" },
                                        { label: "Ngừng kinh doanh", value: "CEASE" }
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục cha"
                                name="parentCategoryId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Danh mục cha không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a parent category"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={parentCategories?.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    }))}
                                    onChange={(value) => {
                                        setSelectedParentId(Number(value));
                                        form.setFieldsValue({ categoryId: undefined });
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục con"
                                name="categoryId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Danh mục con không được để trống!",
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
                                    disabled={!selectedParentId}
                                    options={childrenCategories?.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Nhà cung cấp"
                                name="supplierId"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Nhà cung cấp không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select a supplier"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={suppliers?.map((supplier) => ({
                                        label: supplier.name,
                                        value: supplier.id,
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

export default ProductCreate;
