import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';

function ModalChoseAddress({ data, currentAddress, show, onHide, onGetSelectedAddress }) {
    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title as={"h5"}>Chọn địa chỉ giao hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table table-bordered table-hover" style={{ fontSize: 14 }}>
                        <thead>
                            <tr>
                                <th style={{ width: "8%", textAlign: "center" }}>#</th>
                                <th>Địa chỉ</th>
                                <th style={{ width: "15%", textAlign: "center" }}>Mặc định</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((address, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        <span>{index + 1}</span>
                                    </td>
                                    <td style={{ verticalAlign: "middle" }}>
                                        <span>{address.detail} - {address.ward.name} - {address.district.name} - {address.province.name}</span>
                                    </td>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        {address.isDefault && (
                                            <span className="text-success">
                                                <i className="fa-regular fa-circle-check"></i>
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                        <button
                                            className={`btn-sm primary-btn border-0 ${currentAddress && currentAddress.id === address.id ? "bg-secondary" : ""}`}
                                            onClick={() => {
                                                if (currentAddress && currentAddress.id === address.id) {
                                                    onGetSelectedAddress(null);
                                                    toast.success("Hủy áp dụng địa chỉ giao hàng thành công!");
                                                } else {
                                                    onGetSelectedAddress(address);
                                                    toast.success("Áp dụng địa chỉ giao hàng thành công!");
                                                }
                                                onHide();
                                            }}
                                        >
                                            {currentAddress && currentAddress.id === address.id ? "Hủy" : "Chọn"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalChoseAddress;
