import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Image, message, Modal, Pagination, Row, Space, Spin, Typography, Upload } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDeleteImageMutation, useGetImagesQuery, useUploadImageMutation } from '../../../../../app/services/image.service';


function SubImage({ productId, subImages, onGetSubImages }) {
  const images = useSelector((state) => state.images);
  const { isLoading: isFetchingImages } = useGetImagesQuery();

  const [uploadImage, { isLoading: isLoadingUploadImage }] = useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] = useDeleteImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);

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

  const handleConfirm = (index) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa ảnh này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        return new Promise((resolve, reject) => {
          const newSubImages = subImages.filter((_, i) => i !== index);
          onGetSubImages(newSubImages);
          message.success("Xóa ảnh thành công!");
          resolve();
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
      <Space direction="vertical">
        <Typography.Title level={5}>Ảnh mô tả</Typography.Title>
        <Image.PreviewGroup>
          <Space direction="horizontal" wrap>
            {subImages.map((image, index) => (
              <div
                key={index}
                style={{ position: "relative" }}
              >
                <CloseCircleOutlined
                  onClick={() => {
                    handleConfirm(index);
                  }}
                  style={{ position: "absolute", top: 0, right: 0, color: "red", zIndex: 1, fontSize: 20, cursor: "pointer" }}
                />
                <Image
                  width={160}
                  height={160}
                  style={{ objectFit: "cover" }}
                  src={image}
                  fallback="https://via.placeholder.com/160"
                />
              </div>
            ))}
          </Space>
        </Image.PreviewGroup>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm ảnh
        </Button>
      </Space>

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
                onGetSubImages([...subImages, imageSelected]);
                setIsModalOpen(false);
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
    </>
  )
}

export default SubImage