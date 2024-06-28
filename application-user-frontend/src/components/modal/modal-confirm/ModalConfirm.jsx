import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalConfirm = ({ title, message, show, handleClose, handleConfirm, okText, cancelText }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="md"
        >
            <Modal.Body>
                <div className="d-flex">
                    <div>
                        <span style={{ color: "#faad14", fontSize: 26, marginRight: 10 }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </span>
                    </div>
                    <div>
                        <h5 className="mt-2 fw-medium">{title}</h5>
                        <p className="my-2" style={{ fontSize: 15 }}>{message}</p>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <Button className="rounded-0 btn-sm px-3 me-2" variant="outline-secondary" onClick={handleClose}>
                        {cancelText ?? "Hủy"}
                    </Button>
                    <Button className="rounded-0 btn-sm px-3" variant="outline-danger" onClick={handleConfirm}>
                        {okText ?? "Xóa"}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalConfirm;