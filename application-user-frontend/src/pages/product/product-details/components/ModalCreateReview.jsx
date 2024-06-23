import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCreateReviewMutation } from '../../../../app/apis/review.api';
import { MAX_RATING } from '../../../../data/constants';
import { reviewMessage } from '../../../../utils/functionUtils';

const ModalCreateReview = ({ show, handleClose, product, onSetShouldRefetch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [createReview, { isLoading }] = useCreateReviewMutation();

    const onSubmit = data => {
        if (!rating) {
            toast.warn("Vui lòng chọn mức đánh giá");
            return;
        }
        
        createReview({ ...data, rating, productId: product.id })
            .unwrap()
            .then((res) => {
                toast.success("Tạo đánh giá thành công");
                onSetShouldRefetch();
                handleClose();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            });
    };

    const handleMouseEnter = (index) => {
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleRatingClick = (index) => {
        setRating(index);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="lg"
            backdrop="static"
            keyboard={false}
            id="modal-review"
        >
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="review-product-info text-center">
                    <img src={product.thumbnail} alt={product.name} />
                    <p>{product.name}</p>
                </div>
                <div className="review-product-rating">
                    <div className="text-center">
                        {[...Array(5)].map((_, index) => (
                            <span
                                key={index + 1}
                                className="review-product-rating-item"
                                onMouseEnter={() => handleMouseEnter(index + 1)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleRatingClick(index + 1)}
                                style={{
                                    color: (hoverRating || rating) > index ? '#ffc107' : '#e4e5e9',
                                    cursor: 'pointer',
                                }}
                            >
                                <i className="fa fa-star"></i>
                            </span>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="review-product-rating-result">
                            {rating ? `Bạn đã đánh giá ${rating}/${MAX_RATING} (${reviewMessage(rating)})` : 'Chọn mức đánh giá'}
                        </p>
                    </div>
                </div>
                <div className="review-product-content">
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm"
                                {...register('comment', { required: 'Nội dung không được để trống' })}
                            />
                            {errors.comment && <span className="error invalid-feedback">{errors.comment.message}</span>}
                        </Form.Group>
                        <div className="review-product-btn d-flex justify-content-center mt-3">
                            <Button
                                type="submit"
                                className="primary-btn btn px-5"
                                disabled={isLoading}
                            >Hoàn tất</Button>
                        </div>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateReview;