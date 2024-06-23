import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { MAX_RATING } from '../../../../data/constants';
import ModalCreateReview from './ModalCreateReview';
import ModalCreateReviewAnonymous from './ModalCreateReviewAnonymous';

const findCountReviewsByRating = (reviews, rating) => {
    return reviews.filter(review => review.rating === rating).length;
}

const calculateRatingAverage = (reviews) => {
    if (reviews.length === 0) return 0;
    return Math.ceil(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length);
}

function ReviewOverview({ reviews, product, onSetShouldRefetch }) {
    const { isAuthenticated } = useSelector(state => state.auth)
    const [showModalCreateReview, setShowModalCreateReview] = useState(false);
    const [showModalCreateReviewAnonymous, setShowModalCreateReviewAnonymous] = useState(false);
    const ratingAverage = calculateRatingAverage(reviews);
    const ratingClassification = [...Array(5)].map((_, index) => (
        {
            rating: MAX_RATING - index,
            count: findCountReviewsByRating(reviews, MAX_RATING - index),
            percent: findCountReviewsByRating(reviews, MAX_RATING - index) * 100 / reviews.length
        }
    ))
    return (
        <>
            <div className="review-overview mb-5 bg-white p-4">
                <div className="row">
                    <div className="col-md-4">
                        <div className="overview-avg d-flex justify-content-center align-items-center flex-column h-100">
                            <p>Đánh Giá Trung Bình</p>
                            <h2>{calculateRatingAverage(reviews)}/5</h2>
                            <div className="rating mb-2">
                                {[...Array(ratingAverage)].map((_, index) => (
                                    <span key={index} className="active"><i className="fa fa-star"></i></span>
                                ))}
                                {[...Array(5 - ratingAverage)].map((_, index) => (
                                    <span key={index} className="unactive"><i className="fa fa-star"></i></span>
                                ))}
                            </div>
                            <p className="mb-0"><span className="review-count d-inline-block m-0">{reviews.length}</span> đánh giá</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="overview-progress d-flex justify-content-center align-items-center flex-column h-100">
                            <div className="progress-block w-100">
                                {ratingClassification.map((item, index) => (
                                    <div key={index} className="progress-item d-flex align-items-center w-100 mb-1">
                                        <span className="me-1">{item.rating}</span>
                                        <span className="me-1 rating"><i className="fa fa-star"></i></span>
                                        <div className="flex-grow-1 progress progress-success progress-sm progress-line">
                                            <div className="progress-bar" style={{ width: `${item.percent}%` }}></div>
                                        </div>
                                        <span className="ms-1">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex justify-content-center align-items-center flex-column h-100">
                            <p>Bạn đã mua sản phẩm này?</p>
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        setShowModalCreateReview(true);
                                    } else {
                                        setShowModalCreateReviewAnonymous(true);
                                    }
                                }}
                                className="border-0 primary-btn btn-create-review"
                            >Gửi đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isAuthenticated && showModalCreateReview && (
                <ModalCreateReview
                    show={showModalCreateReview}
                    handleClose={() => setShowModalCreateReview(false)}
                    product={product}
                    onSetShouldRefetch={onSetShouldRefetch}
                />
            )}

            {showModalCreateReviewAnonymous && (
                <ModalCreateReviewAnonymous
                    show={showModalCreateReviewAnonymous}
                    handleClose={() => setShowModalCreateReviewAnonymous(false)}
                    product={product}
                    onSetShouldRefetch={onSetShouldRefetch}
                />
            )}
        </>
    )
}

export default ReviewOverview