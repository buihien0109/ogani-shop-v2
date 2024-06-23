import { SaveOutlined } from '@ant-design/icons'
import { Button, message, Space } from 'antd'
import React, { useState } from 'react'
import { useUpdateImageMutation } from '../../../../../app/services/product.service'
import MainImage from './MainImage'
import SubImage from './SubImage'

function ProductImage({ productId, thumbnail, subImages }) {
    const [updateImage, { isLoading: isLoadingUpdateImage }] = useUpdateImageMutation()
    const [selectedThumbnail, setSelectedThumbnail] = useState(thumbnail);
    const [selectedSubImages, setSelectedSubImages] = useState(subImages);

    const handleUpdateImage = () => {
        const data = {
            thumbnail: selectedThumbnail,
            subImages: selectedSubImages,
        }
        updateImage({ id: productId, ...data }).unwrap()
            .then((data) => {
                message.success("Cập nhật ảnh sản phẩm thành công!");
            })
            .catch((error) => {
                message.error(error.data.message);
            });
    };

    const getThumbnail = (image) => {
        setSelectedThumbnail(image);
    }

    const getGetSubImages = (images) => {
        setSelectedSubImages(images)
    }

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Space style={{ marginBottom: "1rem" }}>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleUpdateImage}
                        loading={isLoadingUpdateImage}
                    >
                        Cập nhật
                    </Button>
                </Space>
                <Space direction="vertical">
                    <MainImage
                        productId={productId}
                        thumbnail={selectedThumbnail}
                        onGetThumbnail={getThumbnail}
                    />
                    <SubImage
                        productId={productId}
                        subImages={selectedSubImages}
                        onGetSubImages={getGetSubImages}
                    />
                </Space>
            </Space>
        </>
    )
}

export default ProductImage