import { Button, Col, Flex, Image, Modal, Pagination, Row, Space, Spin, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDeleteImageMutation, useGetImagesQuery, useUploadImageMutation } from '../../../../../app/services/image.service';
import { API_DOMAIN } from '../../../../../data/constants';

function MainImage({ productId, thumbnail: mainImage, onGetThumbnail }) {
  const images = useSelector((state) => state.images);
  const { isLoading: isFetchingImages } = useGetImagesQuery();

  const [uploadImage, { isLoading: isLoadingUploadImage }] = useUploadImageMutation();
  const [deleteImage, { isLoading: isLoadingDeleteImage }] = useDeleteImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState(null);
  const [thumbnail, setThumbnail] = useState(mainImage);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // số lượng hình ảnh mỗi trang
  const totalImages = images.length; // tổng số hình ảnh
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalImages);
  const imagesRendered = images.slice(startIndex, endIndex);

  useEffect(() => {
    onGetThumbnail(thumbnail.slice(API_DOMAIN.length));
  }, [thumbnail])

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

  return (
    <>
      <Space direction="vertical" style={{ marginBottom: "1.5rem" }}>
        <Typography.Title level={5}>Ảnh chính</Typography.Title>
        <Image
          width={160}
          height={160}
          style={{ objectFit: "cover" }}
          src={thumbnail}
          fallback="https://via.placeholder.com/160"
        />
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Thay đổi ảnh chính
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
                setThumbnail(imageSelected);
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

export default MainImage