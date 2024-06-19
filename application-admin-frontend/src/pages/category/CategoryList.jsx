import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Spin, message, theme } from "antd";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useCreateParentCategoryMutation, useCreateSubCategoryMutation, useGetCategoriesQuery } from "../../app/services/category.service";
import AppBreadCrumb from "../../components/layout/AppBreadCrumb";
import CategoryTable from "./CategoryTable";

const breadcrumb = [{ label: "Danh mục sản phẩm", href: "/admin/categories" }];
const CategoryList = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { data, isLoading: isFetchingCategories } = useGetCategoriesQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [createParentCategory, { isLoading: isLoadingCreateParent }] = useCreateParentCategoryMutation();
    const [createSubCategory, { isLoading: isLoadingCreateSub }] = useCreateSubCategoryMutation();

    const [form] = Form.useForm();
    const [openParent, setOpenParent] = useState(false);
    const [openChild, setOpenChild] = useState(false);

    if (isFetchingCategories) {
        return <Spin size="large" fullscreen />;
    }

    const parentCategories = data?.filter((category) => !category.parent);

    const handleCreateParentCategory = (values) => {
        createParentCategory(values)
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpenParent(false);
                message.success("Tạo danh mục cha thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const handleCreateParentSub = (values) => {
        createSubCategory(values)
            .unwrap()
            .then((data) => {
                form.resetFields();
                setOpenChild(false);
                message.success("Tạo danh mục con thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>Danh mục sản phẩm</title>
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
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenParent(true)}
                    >
                        Tạo danh mục cha
                    </Button>
                    <Button
                        style={{ backgroundColor: "rgb(243, 156, 18)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setOpenChild(true)}
                    >
                        Tạo danh mục con
                    </Button>
                    <RouterLink to="/admin/categories">
                        <Button
                            style={{ backgroundColor: "rgb(0, 192, 239)" }}
                            type="primary"
                            icon={<ReloadOutlined />}
                        >
                            Refresh
                        </Button>
                    </RouterLink>
                </Space>

                <CategoryTable data={data} />
            </div>

            {openParent && (
                <Modal
                    open={openParent}
                    title="Tạo danh mục sản phẩm cha"
                    footer={null}
                    onCancel={() => setOpenParent(false)}
                    confirmLoading={isLoadingCreateParent}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateParentCategory}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Danh mục cha"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Tên danh mục không được để trống!",
                                },
                            ]}
                        >
                            <Input placeholder="Enter name" />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoadingCreateParent}
                                >
                                    Lưu
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            )}

            {openChild && (
                <Modal
                    open={openChild}
                    title="Tạo danh mục sản phẩm con"
                    footer={null}
                    onCancel={() => setOpenChild(false)}
                    confirmLoading={isLoadingCreateSub}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreateParentSub}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Danh mục cha"
                            name="parentId"
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
                            />
                        </Form.Item>

                        <Form.Item
                            label="Danh mục con"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Tên danh mục không được để trống!",
                                },
                            ]}
                        >
                            <Input placeholder="Nhập tên danh mục" />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isLoadingCreateSub}
                                >
                                    Lưu
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export default CategoryList;
