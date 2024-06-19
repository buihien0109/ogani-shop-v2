import { Button, Form, Input, Modal, Select, Space, Spin, message } from "antd";
import React from "react";
import { useGetCategoriesQuery, useUpdateSubCategoryMutation } from "../../app/services/category.service";

const ModalSubUpdate = (props) => {
    const { category, open, onCancel } = props;
    const { data, isLoading: isFetchingCategories } = useGetCategoriesQuery();
    const [updateSubCategory, { isLoading }] = useUpdateSubCategoryMutation();

    if (isFetchingCategories) {
        return <Spin size="large" fullscreen />;
    }

    const parentCategories = data?.filter((category) => !category.parent);

    const onFinish = (values) => {
        updateSubCategory({ id: category.subCategory.id, ...values })
            .unwrap()
            .then((data) => {
                message.success("Cập nhật danh mục sản phẩm con thành công!");
                onCancel();
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Modal
                open={open}
                title="Cập nhật danh mục sản phẩm con"
                footer={null}
                onCancel={onCancel}
                confirmLoading={isLoading}
            >
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{
                        parentId: category?.category?.id,
                        name: category?.subCategory?.name,
                    }}
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
                                loading={isLoading}
                            >
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};
export default ModalSubUpdate;
