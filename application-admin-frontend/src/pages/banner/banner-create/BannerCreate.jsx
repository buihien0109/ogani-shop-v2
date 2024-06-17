import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
    Space,
    Spin,
    Upload,
    message,
    theme
} from "antd";
import "easymde/dist/easymde.min.css";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCreateBannerMutation } from "../../../app/services/banner.service";
import {
    useDeleteImageMutation,
    useGetImagesQuery,
    useUploadImageMutation,
} from "../../../app/services/image.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { API_DOMAIN } from "../../../data/constants";

const breadcrumb = [
    { label: "Danh sách banner", href: "/admin/banners" },
    { label: "Tạo banner", href: "/admin/banners/create" },
];

const BannerCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const imagesData = useSelector((state) => state.images);
    const { isLoading: isFetchingImages } = useGetImagesQuery();

    const images =
        imagesData &&
        imagesData.map((image) => {
            return {
                id: image.id,
                url: `${API_DOMAIN}${image.url}`,
            };
        });
    const [createBanner, { isLoading: isLoadingCreateBanner }] =
        useCreateBannerMutation();
    const [uploadImage, { isLoading: isLoadingUploadImage }] =
        useUploadImageMutation();
    const [deleteImage, { isLoading: isLoadingDeleteImage }] =
        useDeleteImageMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSelected, setImageSelected] = useState(null);
    const [thumbnail, setThumbnail] = useState("https://placehold.co/1000x600?text=THUMBNAIL");

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12; // số lượng hình ảnh mỗi trang
    const totalImages = images.length; // tổng số hình ảnh
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalImages);
    const imagesRendered = images.slice(startIndex, endIndex);

    if (isFetchingImages) {
        return <Spin size="large" fullscreen />;
    }

    const onPageChange = page => {
        setCurrentPage(page);
    };

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                return createBanner(values).unwrap();
            })
            .then((data) => {
                message.success("Tạo banner thành công!");
                setTimeout(() => {
                    navigate(`/admin/banners/${data.id}/detail`);
                }, 1500);
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
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
                console.log(error);
                message.error(error.data.message);
            });
    };

    return (
        <>
            <Helmet>
                <title>Tạo banner</title>
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
                    <RouterLink to="/admin/banners">
                        <Button type="default" icon={<LeftOutlined />}>
                            Quay lại
                        </Button>
                    </RouterLink>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        loading={isLoadingCreateBanner}
                    >
                        Tạo banner
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Tên banner"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên banner không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>

                            <Form.Item
                                label="Link điều hướng"
                                name="linkRedirect"
                                rules={[
                                    {
                                        required: true,
                                        message: "Link điều hướng không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter link redirect" />
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
                                        { label: "Vô hiệu hóa", value: false },
                                        { label: "Kích hoạt", value: true },
                                    ]}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="thumbnail">
                                <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                >
                                    <img
                                        style={{
                                            width: "100%",
                                            objectFit: "cover",
                                            aspectRatio: "16/9",
                                        }}
                                        src={thumbnail}
                                        alt="Thumbnail"
                                    />
                                    <Button
                                        type="primary"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        Thay đổi ảnh bài viết
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
                                                } image-item`}
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
            </div>
        </>
    );
};

export default BannerCreate;
