import { DeleteOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Button, message, Modal, Space, Spin, Table, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useGetReviewsByProductQuery } from "../../../../../app/services/product.service";
import { useDeleteReviewMutation } from "../../../../../app/services/review.service";
import { formatDateTime } from "../../../../../utils/functionUtils";
import ModalUpdate from "./ModalUpdate";
import { Link as RouterLink } from "react-router-dom";

// Review status: PENDING,ACCEPTED,REJECTED
const parseReviewStatus = (status) => {
    switch (status) {
        case "PENDING":
            return <Tag color="warning">Chờ duyệt</Tag>;
        case "ACCEPTED":
            return <Tag color="success">Đã duyệt</Tag>;
        case "REJECTED":
            return <Tag color="error">Từ chối</Tag>;
        default:
            return <Tag color="default">Chưa cập nhật</Tag>;
    }
};

const getAuthor = (record) => {
    if (record.user) {
        return (
            <>
                <Tag color="processing">u</Tag>
                <RouterLink to={`/admin/users/${record.user.id}/detail`}>
                    {record.user.name}
                </RouterLink>
            </>
        );
    } else {
        return (
            <>
                <Tag color="warning">a</Tag>
                {record.authorName}
            </>
        )
    }
}

const ReviewTable = ({ productId }) => {
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [updatedReview, setUpdatedReview] = useState(null);

    const { data, isLoading: isFetchingReviews } = useGetReviewsByProductQuery(productId);
    const [deleteReview, { isLoading: isLoadingDeleteReview }] = useDeleteReviewMutation();

    useEffect(() => {
        if (data) {
            setReviews(data);
        }
    }, [data])

    if (isFetchingReviews) {
        return <Spin size="large" fullscreen />;
    }

    const columns = [
        {
            title: "Họ tên",
            dataIndex: "user",
            key: "user",
            width: "20%",
            render: (text, record, index) => {
                return getAuthor(record);
            },
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
            width: "10%",
            render: (text, record, index) => {
                return (
                    <Typography.Text>
                        {text} <StarOutlined style={{ color: "#EDBB0E" }} />
                    </Typography.Text>
                );
            },
        },
        {
            title: "Nội dung",
            dataIndex: "comment",
            key: "comment",
            render: (text, record, index) => {
                return text;
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text, record, index) => {
                return parseReviewStatus(text);
            },
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            key: "createdAt",
            width: "15%",
            render: (text, record, index) => {
                return formatDateTime(text);
            },
        },
        {
            title: "",
            dataIndex: "",
            key: "action",
            render: (text, record, index) => {
                return (
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setUpdatedReview(record);
                                setOpen(true);
                            }}
                        ></Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                                handleConfirm(record.id);
                            }}
                        ></Button>
                    </Space>
                );
            },
        },
    ];

    const handleConfirm = (id) => {
        Modal.confirm({
            title: "Bạn có chắc chắn muốn xóa review này?",
            content: "Hành động này không thể hoàn tác!",
            okText: "Xóa",
            okType: "danger",
            cancelText: "Hủy",
            okButtonProps: { loading: isLoadingDeleteReview }, // Hiển thị loading trên nút OK
            onOk: () => {
                return new Promise((resolve, reject) => {
                    deleteReview(id)
                        .unwrap()
                        .then(() => {
                            setReviews(reviews.filter((review) => review.id !== id));
                            message.success("Xóa review thành công!");
                            resolve(); // Đóng modal sau khi xóa thành công
                        })
                        .catch((error) => {
                            message.error(error.data.message);
                            reject(); // Không đóng modal nếu xóa thất bại
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

    const handleUpdateReview = (review) => {
        setReviews(
            reviews.map((item) => {
                if (item.id === review.id) {
                    return review;
                }
                return item;
            })
        );
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={reviews}
                rowKey={(record) => record.id}
            />

            {open && (
                <ModalUpdate
                    open={open}
                    onCancel={() => setOpen(false)}
                    review={updatedReview}
                    productId={productId}
                    onUpdateReview={handleUpdateReview}
                />
            )}
        </>
    );
};
export default ReviewTable;
