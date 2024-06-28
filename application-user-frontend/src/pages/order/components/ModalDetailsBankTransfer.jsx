import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function ModalDetailsBankTransfer({ show, onHide }) {
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title as={"h5"}>Thông tin chuyển khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="text-small fw-medium">
                            <Row className="mb-2">
                                <Col md={4}>Ngân hàng</Col>
                                <Col md={8} className="text-black-50">Vietcombank</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={4}>Số tài khoản</Col>
                                <Col md={8} className="text-black-50">02482042829349</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={4}>Chủ tài khoản</Col>
                                <Col md={8} className="text-black-50">Nguyễn Văn A</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md={4}>Nội dung CK</Col>
                                <Col md={8} className="text-black-50">[Họ tên] - [Email] - [SĐT]</Col>
                            </Row>
                            <hr />
                            <Row>
                                <p className="fw-normal fst-italic">
                                    Ví dụ NDCK: Nguyễn Văn A - a@gmail.com - 0987654321
                                </p>
                                <p className="fw-normal fst-italic">
                                    Sau khi chuyển khoản thành công. Hãy bấm vào
                                    "<span className="fw-semibold">Xác nhận</span>"
                                </p>
                            </Row>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalDetailsBankTransfer;
