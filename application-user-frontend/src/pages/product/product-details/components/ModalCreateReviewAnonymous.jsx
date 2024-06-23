import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useCreateReviewMutation } from '../../../../app/apis/review.anonymous.api';
import { MAX_RATING } from '../../../../data/constants';
import { reviewMessage } from '../../../../utils/functionUtils';

// Schema validation
const schema = yup.object().shape({
    name: yup.string().required('Họ tên không được để trống'),
    email: yup.string().email('Email không đúng định dạng').required('Email không được để trống'),
    phone: yup.string().matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Số điện thoại không đúng định dạng').required('Số điện thoại không được để trống'),
    comment: yup.string().required('Nội dung không được để trống'),
});

const ModalCreateReviewAnonymous = ({ show, handleClose, product, onSetShouldRefetch }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
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
                toast.success("Cảm ơn bạn đã đánh giá sản phẩm. Đánh giá của bạn sẽ được hiển thị sau khi được kiểm duyệt.");
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
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Họ tên"
                                        {...register('name')}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-group mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Email"
                                        {...register('email')}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="form-group mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="Số điện thoại"
                                        {...register('phone')}
                                    />
                                    {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                                </div>
                            </div>
                        </div>
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm"
                                {...register('comment')}
                            />
                            {errors.comment && <div className="invalid-feedback">{errors.comment.message}</div>}
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

export default ModalCreateReviewAnonymous;
