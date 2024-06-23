import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useDeleteReviewMutation } from '../../../../app/apis/review.api'
import { MAX_RATING } from '../../../../data/constants'
import { formatDate } from '../../../../utils/functionUtils'
import ModalUpdateReview from './ModalUpdateReview'

function ReviewList({ reviews, product, onSetShouldRefetch }) {
    const ITEMS_PER_PAGE = 5;
    const { auth, isAuthenticated } = useSelector(state => state.auth)
    const [showModalUpdateReview, setShowModalUpdateReview] = useState(false);
    const [reviewSelected, setReviewSelected] = useState(null);
    const [currentPageReview, setCurrentPageReview] = useState(1);

    const [deleteReview] = useDeleteReviewMutation();

    const handleUpdateReview = (reviewId) => {
        const review = reviews.find(review => review.id == reviewId);
        setReviewSelected(review);
        setShowModalUpdateReview(true);
    }

    const handleDeleteReview = (reviewId) => {
        const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa bình luận này không?");
        if (!isConfirm) {
            return;
        }

        deleteReview(reviewId)
            .unwrap()
            .then((res) => {
                toast.success("Xóa bình luận thành công");
                onSetShouldRefetch();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    }

    const handlePageChange = (page) => {
        setCurrentPageReview(page);
    }

    const start = (currentPageReview - 1) * ITEMS_PER_PAGE;
    const end = currentPageReview * ITEMS_PER_PAGE;
    const reviewsPerPage = reviews.slice(start, end);


    return (
        <>
            <div className="review-list">
                {reviewsPerPage?.map(review => (
                    <div key={review.id} className="review-item">
                        <div className="review-avatar">
                            <img
                                src={review?.authorAvatar ?? review?.user?.avatar}
                                alt={review?.authorName ?? review?.user?.name}
                            />
                        </div>
                        <div className="review-info">
                            <div className="d-flex align-items-center mb-2">
                                <p className="author me-2 my-0">{review?.authorName ?? review?.user?.name}</p>
                                <span className="time">{formatDate(review?.createdAt)}</span>
                            </div>
                            <div className="rating mb-2 d-flex align-items-center">
                                {[...Array(review?.rating)].map((_, index) => (
                                    <span key={index} className="active"><i className="fa fa-star"></i></span>
                                ))}
                                {[...Array(MAX_RATING - review?.rating)].map((_, index) => (
                                    <span key={index} className="unactive"><i className="fa fa-star"></i></span>
                                ))}
                            </div>
                            <p className="content" style={{ marginBottom: 8 }}>{review?.comment}</p>
                            {isAuthenticated && review?.user && review?.user?.id === auth.id && (
                                <div>
                                    <button
                                        className="p-0 border-0 bg-transparent btn-edit-review text-primary me-2"
                                        style={{ textDecoration: "underline" }}
                                        onClick={() => handleUpdateReview(review.id)}
                                    >Sửa</button>
                                    <button
                                        className="p-0 border-0 bg-transparent btn-delete-review text-danger"
                                        style={{ textDecoration: "underline" }}
                                        onClick={() => handleDeleteReview(review.id)}
                                    >Xóa</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination-container mt-4">
                <div className="d-flex justify-content-center">
                    <Pagination
                        current={currentPageReview}
                        total={reviews.length}
                        pageSize={ITEMS_PER_PAGE}
                        onChange={(page) => handlePageChange(page)}
                        className='text-center'
                        hideOnSinglePage={true}
                    />
                </div>
            </div>

            {isAuthenticated && showModalUpdateReview && (
                <ModalUpdateReview
                    show={showModalUpdateReview}
                    handleClose={() => setShowModalUpdateReview(false)}
                    product={product}
                    review={reviewSelected}
                    onSetShouldRefetch={onSetShouldRefetch}
                />
            )}
        </>
    )
}

export default ReviewList