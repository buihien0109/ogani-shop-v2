import { DeleteOutlined, LeftOutlined, SaveOutlined } from "@ant-design/icons";
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
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
    useDeleteBannerMutation,
    useGetBannerByIdQuery,
    useUpdateBannerMutation,
} from "../../../app/services/banner.service";
import {
    useDeleteImageMutation,
    useGetImagesQuery,
    useUploadImageMutation,
} from "../../../app/services/image.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { API_DOMAIN } from "../../../data/constants";

const BannerDetail = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { bannerId } = useParams();
    const images = useSelector((state) => state.images);
    const { data: banner, isLoading: isFetchingBanner } =
        useGetBannerByIdQuery(bannerId);
    const { isLoading: isFetchingImages } =
        useGetImagesQuery();

    const [updateBanner, { isLoading: isLoadingUpdateBanner }] =
        useUpdateBannerMutation();
    const [deleteBanner, { isLoading: isLoadingDeleteBanner }] =
        useDeleteBannerMutation();
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
        { label: "Danh sách banner", href: "/admin/banners" },
        { label: banner?.name, href: `/admin/banners/${banner?.id}/detail` },
    ];

    useEffect(() => {
        if (banner && thumbnail === null) {
            setThumbnail(banner?.thumbnail);
        }
    }, [banner, thumbnail]);

    if (isFetchingBanner || isFetchingImages) {
        return <Spin size="large" fullscreen />;
    }

    const onPageChange = page => {
        setCurrentPage(page);
    };

    const handleUpdate = () => {
        form.validateFields()
            .then((values) => {
                return updateBanner({ id: banner.id, ...values }).unwrap();
            })
            .then((data) => {
                message.success("Cập nhật banner thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const handleDelete = () => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa banner này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoadingDeleteBanner },
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteBanner(banner.id)
                        .unwrap()
                        .then((data) => {
                            message.success("Xóa banner thành công!");
                            setTimeout(() => {
                                navigate("/admin/banners");
                            }, 1500);
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
                <title>{banner.name}</title>
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
                        <RouterLink to="/admin/banners">
                            <Button type="default" icon={<LeftOutlined />}>
                                Quay lại
                            </Button>
                        </RouterLink>
                        <Button
                            style={{ backgroundColor: "rgb(60, 141, 188)" }}
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleUpdate}
                            loading={isLoadingUpdateBanner}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        loading={isLoadingDeleteBanner}
                    >
                        Xóa banner
                    </Button>
                </Flex>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={banner}
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
                                        Thay đổi ảnh banner
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

export default BannerDetail;
