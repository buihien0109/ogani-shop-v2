import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Flex, message, Modal, Row, Space, Table, Typography } from "antd";
import React, { useState } from "react";
import { useDeleteCategoryMutation } from "../../app/services/category.service";
import ModalParentUpdate from "./ModalParentUpdate";
import ModalSubUpdate from "./ModalSubUpdate";

function transformData(data) {
    const categoryMap = new Map();

    data.forEach(item => {
        if (item.parent === null) {
            if (!categoryMap.has(item.id)) {
                categoryMap.set(item.id, { category: item, subCategories: [] });
            }
        } else {
            if (!categoryMap.has(item.parent.id)) {
                categoryMap.set(item.parent.id, { category: item.parent, subCategories: [] });
            }
            categoryMap.get(item.parent.id).subCategories.push(item);
        }
    });

    const sortedCategories = Array.from(categoryMap.values()).sort((a, b) => new Date(b.category.createdAt) - new Date(a.category.createdAt));

    const result = sortedCategories.flatMap((item) => {
        const sortedSubCategories = item.subCategories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortedSubCategories.length > 0) {
            return sortedSubCategories.map((sub, index) => ({
                key: `${item.category.id}-${sub.id}`,
                category: item.category,
                categoryRowSpan: index === 0 ? sortedSubCategories.length : 0,
                subCategory: sub,
            }));
        } else {
            return [{
                key: `${item.category.id}`,
                category: item.category,
                categoryRowSpan: 1,
                subCategory: null,
            }];
        }
    });

    return result;
}



const CategoryTable = ({ data }) => {
    const dataSource = transformData(data);
    const [parentUpdate, setParentUpdate] = useState(null);
    const [subUpdate, setSubUpdate] = useState(null);
    const [openModalParentUpdate, setOpenModalParentUpdate] = useState(false);
    const [openModalSubUpdate, setOpenModalSubUpdate] = useState(false);
    const [deleteCategory, { isLoading: isLoadingDeleteCategory }] = useDeleteCategoryMutation();

    const columns = [
        {
            title: 'Danh mục cha',
            dataIndex: 'category',
            key: 'category',
            render: (category, record) => ({
                children: (
                    <Flex justify="space-between" align="center">
                        <Typography.Text>{category.name}</Typography.Text>
                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setParentUpdate(category);
                                    setOpenModalParentUpdate(true);
                                }}
                            ></Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleConfirm(category.id)}
                                loading={isLoadingDeleteCategory}
                            ></Button>
                        </Space>
                    </Flex>
                ),
                props: {
                    rowSpan: record.categoryRowSpan,
                },
            }),
        },
        {
            title: 'Danh mục con',
            dataIndex: 'subCategory',
            key: 'subCategory',
            render: (subCategory, record) => {
                if (subCategory === null) return "";
                return (
                    <Flex justify="space-between" align="center">
                        <Typography.Text>{subCategory?.name}</Typography.Text>
                        <Space>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setSubUpdate(record);
                                    setOpenModalSubUpdate(true);
                                }}
                            ></Button>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleConfirm(subCategory.id)}
                            ></Button>
                        </Space>
                    </Flex>
                )
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa danh mục này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoadingDeleteCategory },
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteCategory(id)
                        .unwrap()
                        .then(() => {
                            message.success("Xóa danh mục thành công!");
                            resolve();
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject();
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
    };



    return (
        <>
            <Row>
                <Col span={12}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey={(record) => record.key}
                        pagination={false}
                    />
                </Col>
            </Row>

            {openModalParentUpdate && (
                <ModalParentUpdate
                    open={openModalParentUpdate}
                    onCancel={() => setOpenModalParentUpdate(false)}
                    category={parentUpdate}
                />
            )}

            {openModalSubUpdate && (
                <ModalSubUpdate
                    open={openModalSubUpdate}
                    onCancel={() => setOpenModalSubUpdate(false)}
                    category={subUpdate}
                />
            )}
        </>
    );
};
export default CategoryTable;
