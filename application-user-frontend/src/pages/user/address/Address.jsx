import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useDeleteUserAddressMutation, useGetAddressesByUserQuery, useSetDefaultUserAddressMutation } from '../../../app/apis/userAddress.api';
import ErrorPage from '../../../components/error/ErrorPage';
import Loading from '../../../components/loading/Loading';
import ModalConfirm from '../../../components/modal/modal-confirm/ModalConfirm';
import useModalConfirm from '../../../components/modal/modal-confirm/useModalConfirm';
import ModalCreateAddress from './components/ModalCreateAddress';
import ModalUpdateAddress from './components/ModalUpdateAddress';


function Address() {
    const { auth: user } = useSelector(state => state.auth)
    const { isOpen, openModal, closeModal } = useModalConfirm();
    const [showModalCreate, setShowModalCreate] = useState(false);
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [addressUpdate, setAddressUpdate] = useState(null)

    const { data: userAddresses, isLoadingGetAddresses, isErrorGetAddresses } = useGetAddressesByUserQuery(user.id)
    const [setDefaultUserAddress, { isLoading: isLoadingSetDefaultAddress }] = useSetDefaultUserAddressMutation()
    const [deleteUserAddress, { isLoading: isLoadingDeleteAddress }] = useDeleteUserAddressMutation()

    if (isLoadingGetAddresses) return <Loading />;
    if (isErrorGetAddresses) return <ErrorPage />

    const handleSetDefaultAddress = (addressId) => {
        setDefaultUserAddress(addressId)
            .unwrap()
            .then(() => {
                toast.success("Đặt làm địa chỉ mặc định thành công");
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
    }

    const handleDeleteAddress = (addressId) => {
        deleteUserAddress(addressId)
            .unwrap()
            .then(() => {
                toast.success("Xóa địa chỉ thành công");
                closeModal();
            })
            .catch((error) => {
                console.log(error);
                toast.error(error.data.message)
            })
    }

    return (
        <>
            <div className="customer-info">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Thông tin địa chỉ</h4>
                    <button
                        className="border-0 primary-btn btn-create-address"
                        onClick={() => setShowModalCreate(true)}
                    >Thêm địa chỉ mới</button>
                </div>
                <div className="address-info">
                    {userAddresses && userAddresses.map((address, index) => (
                        <div key={address.id} className="d-flex justify-content-between align-items-center">
                            <p className="address-detail">
                                {index + 1}. {address.detail} - {address.ward.name} - {address.district.name} - {address.province.name}&nbsp;
                                {!address.isDefault && (
                                    <span
                                        className="address-sub"
                                        onClick={() => handleSetDefaultAddress(address.id)}
                                    >(Đặt làm địa chỉ mặc định)</span>
                                )}
                                {address.isDefault && (
                                    <span className="address-default">(Mặc định)</span>
                                )}
                            </p>
                            <div className="btn-action-list">
                                <button
                                    className="btn-action"
                                    onClick={() => {
                                        setAddressUpdate(address);
                                        setShowModalUpdate(true);
                                    }}
                                >
                                    <i className="fa fa-pencil" aria-hidden="true"></i>
                                </button>
                                {!address.isDefault && (
                                    <button
                                        className="btn-action"
                                        onClick={() => {
                                            setAddressUpdate(address);
                                            openModal();
                                        }}
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModalCreate && (
                <ModalCreateAddress
                    show={showModalCreate}
                    onHide={() => setShowModalCreate(false)}
                />
            )}

            {showModalUpdate && (
                <ModalUpdateAddress
                    show={showModalUpdate}
                    onHide={() => setShowModalUpdate(false)}
                    address={addressUpdate}
                />
            )}

            {isOpen && (
                <ModalConfirm
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa địa chỉ này không?"
                    show={isOpen}
                    handleClose={closeModal}
                    handleConfirm={() => handleDeleteAddress(addressUpdate.id)}
                />
            )}
        </>
    )
}

export default Address