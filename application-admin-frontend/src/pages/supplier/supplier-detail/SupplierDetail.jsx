import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Col,
    Flex,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Space,
    Spin,
    Tabs,
    Upload,
    message,
    theme
} from "antd";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
    useDeleteImageMutation,
    useGetImagesQuery,
    useUploadImageMutation,
} from "../../../app/services/image.service";
import {
    useGetSupplierByIdQuery,
    useGetTransactionsBySupplierQuery,
    useUpdateSupplierMutation
} from "../../../app/services/supplier.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { API_DOMAIN } from "../../../data/constants";
import TransactionListBySupplier from "./TransactionListBySupplier";

const SupplierDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { auth } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const images = useSelector((state) => state.images);
    const [form] = Form.useForm();
    const { supplierId } = useParams();


    const { data: supplier, isLoading: isFetchingSupplier } = useGetSupplierByIdQuery(supplierId);
    const { data: transactions, isLoading: isFetchingTransactions } = useGetTransactionsBySupplierQuery(supplierId);
    const { isLoading: isFetchingImages } = useGetImagesQuery();

    const [updateSupplier, { isLoading: isLoadingUpdateSupplier }] =
        useUpdateSupplierMutation();
    const [uploadImage, { isLoading: isLoadingUploadImage }] =
        useUploadImageMutation();
    const [deleteImage, { isLoading: isLoadingDeleteImage }] =
        useDeleteImageMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSelected, setImageSelected] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12; // số lượng hình ảnh mỗi trang
    const totalImages = images.length; // tổng số hình ảnh
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalImages);
    const imagesRendered = images.slice(startIndex, endIndex);


    const breadcrumb = [
        { label: "Danh sách nhà cung cấp", href: "/admin/suppliers" },
        { label: supplier?.name, href: `/admin/suppliers/${supplier?.id}/detail` },
    ];

    useEffect(() => {
        if (supplier && thumbnail === null) {
            setThumbnail(supplier?.thumbnail);
        }
    }, [supplier, thumbnail]);

    if (isFetchingSupplier || isFetchingImages || isFetchingTransactions) {
        return <Spin size="large" fullscreen />;
    }

    const onPageChange = page => {
        setCurrentPage(page);
    };

    const handleUpdate = () => {
        form.validateFields()
            .then((values) => {
                return updateSupplier({ id: supplier.id, ...values }).unwrap();
            })
            .then((data) => {
                message.success("Cập nhật thông tin nhà cung cấp thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const selecteImage = (image) => () => {
        setImageSelected(image);
    };

    const handleUploadImage = ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append("file", file);
        uploadImage(formData)
            .unwrap()
            .then((data) => {
                onSuccess();
                message.success("Tải ảnh lên thành công!");
            })
            .catch((error) => {
                onError();
                message.error(error.data.message);
            });
    };

    const handleDeleteImage = () => {
        const imageObj = images.find((image) => image.url == imageSelected);
        if (!imageObj) {
            return;
        }
        deleteImage(imageObj.id)
            .unwrap()
            .then((data) => {
                message.success("Xóa ảnh thành công!");
                setImageSelected(null);
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>{supplier.name}</title>
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
                <Tabs>
                    <Tabs.TabPane tab="Thông tin nhà cung cấp" key={1}>
                        <Space style={{ marginBottom: "1rem" }}>
                            <RouterLink to="/admin/suppliers">
                                <Button type="default" icon={<LeftOutlined />}>
                                    Quay lại
                                </Button>
                            </RouterLink>
                            <Button
                                style={{ backgroundColor: "rgb(60, 141, 188)" }}
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleUpdate}
                                loading={isLoadingUpdateSupplier}
                            >
                                Cập nhật
                            </Button>
                        </Space>

                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                            initialValues={supplier}
                        >
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        label="Tên nhà cung cấp"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Tên nhà cung cấp không được để trống!",
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
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Địa chỉ không được để trống!",
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter address" />
                                    </Form.Item>

                                    <Form.Item name="thumbnail">
                                        <Space direction="vertical">
                                            <Avatar
                                                src={<img src={thumbnail} alt="thumbnail" />}
                                                size={180}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                Thay đổi ảnh đại diện
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                        <Modal
                            title="Chọn ảnh của bạn"
                            open={isModalOpen}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setImageSelected(null);
                            }}
                            footer={null}
                            width={1200}
                            style={{ top: 20 }}
                        >
                            <Flex justify="space-between" align="center">
                                <Space direction="horizontal">
                                    <Upload
                                        maxCount={1}
                                        customRequest={handleUploadImage}
                                        showUploadList={false}
                                    >
                                        <Button
                                            type="primary"
                                            style={{
                                                backgroundColor: "rgb(243, 156, 18)",
                                            }}
                                            loading={isLoadingUploadImage}
                                        >
                                            Tải ảnh lên
                                        </Button>
                                    </Upload>

                                    <Button
                                        type="primary"
                                        disabled={!imageSelected}
                                        onClick={() => {
                                            setThumbnail(imageSelected);
                                            setIsModalOpen(false);
                                            form.setFieldsValue({
                                                thumbnail: imageSelected.slice(API_DOMAIN.length),
                                            });
                                        }}
                                    >
                                        Chọn ảnh
                                    </Button>
                                </Space>
                                <Button
                                    type="primary"
                                    disabled={!imageSelected}
                                    danger
                                    onClick={handleDeleteImage}
                                    loading={isLoadingDeleteImage}
                                >
                                    Xóa ảnh
                                </Button>
                            </Flex>

                            <div style={{ marginTop: "1rem" }} id="image-container">
                                <Row gutter={[16, 16]} wrap={true}>
                                    {imagesRendered &&
                                        imagesRendered.map((image, index) => (
                                            <Col span={6} key={index}>
                                                <div
                                                    className={`${imageSelected === image.url
                                                        ? "image-selected"
                                                        : ""
                                                        } image-item border`}
                                                    onClick={selecteImage(image.url)}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={`image-${index}`}
                                                        style={{ width: "100%" }}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                </Row>
                            </div>

                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={totalImages}
                                onChange={onPageChange}
                                showSizeChanger={false}
                                style={{ marginTop: 16, textAlign: 'center' }}
                            />
                        </Modal>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab={`Lịch sử giao dịch (${transactions.length})`} key={2}>
                        <TransactionListBySupplier data={transactions} />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </>
    );
};

export default SupplierDetail;
