import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import logoBankTransfer from "../../../public/bank-transfer.png";
import breadcrumb from "../../../public/breadcrumb.jpg";
import logoMomo from "../../../public/logo-momo.svg";
import logoVNPay from "../../../public/logo-vnpay2.png";
import logoZaloPay from "../../../public/logo-zalopay.webp";
import { useGetDistrictsQuery, useGetWardsQuery } from '../../app/apis/address.api';
import { useGetCartQuery } from '../../app/apis/cart.api';
import { useLazyCheckCouponValidQuery } from '../../app/apis/coupon.api';
import { useCreateOrderByAnonymousCustomerMutation } from '../../app/apis/order.anonymous.api';
import { useCreateOrderByCustomerMutation } from '../../app/apis/order.api';
import { useGetProductsInIdsQuery } from '../../app/apis/product.api';
import { useGetAddressesByUserQuery } from '../../app/apis/userAddress.api';
import { deleteAllFromCart } from '../../app/slices/cart.slice';
import ErrorPage from '../../components/error/ErrorPage';
import Loading from '../../components/loading/Loading';
import { formatCurrency } from '../../utils/functionUtils';
import ModalChoseAddress from './components/ModalChoseAddress';
import ModalDetailsBankTransfer from './components/ModalDetailsBankTransfer';

const getLocalCart = (cartState, products) => {
    const localCart = {};
    const cartItems = [];
    cartState.forEach((cartItem, index) => {
        const product = products?.find(product => product.id === cartItem.productId);
        if (product) {
            cartItems.push({
                id: index + 1,
                product: product,
                quantity: cartItem.quantity,
                totalAmount: product.discountPrice ? product.discountPrice * cartItem.quantity : product.price * cartItem.quantity
            });
        }
    });
    localCart.id = 1;
    localCart.cartItems = cartItems;
    localCart.totalAmount = cartItems.reduce((total, cartItem) => total + cartItem.totalAmount, 0);
    return localCart;
}

const shippingMethods = [
    { label: "Giao hàng tiêu chuẩn", value: "STANDARD" },
    { label: "Giao hàng nhanh", value: "EXPRESS" },
];
const paymentMethods = [
    { label: "Thanh toán khi nhận hàng", value: "COD", logo: null },
    { label: "Momo", value: "MOMO", logo: logoMomo },
    { label: "ZaloPay", value: "ZALO_PAY", logo: logoZaloPay },
    { label: "VNPay", value: "VN_PAY", logo: logoVNPay },
    { label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER", logo: logoBankTransfer },
]

const schema = yup.object().shape({
    name: yup.string().required('Tên không được để trống'),
    phone: yup.string().required('Số điện thoại không được để trống').matches(/^\d+$/, 'Số điện thoại không hợp lệ'),
    email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),
    province: yup.object().required('Tỉnh/thành phố không được để trống'),
    district: yup.object().required('Quận/huyện không được để trống'),
    ward: yup.object().required('Xã/phường không được để trống'),
    address: yup.string().required('Địa chỉ giao hàng không được để trống'),
    shippingMethod: yup.string().required('Phương thức vận chuyển không được để trống'),
    paymentMethod: yup.string().required('Phương thức thanh toán không được để trống'),
});

function Order() {
    const dispatch = useDispatch();
    const { isAuthenticated, auth } = useSelector(state => state.auth);
    const cart = useSelector(state => state.cart);
    const productIds = cart.map(cartItem => cartItem.productId);
    const { provinces } = useSelector(state => state.address);
    const [provinceCode, setProvinceCode] = useState(null);
    const [districtCode, setDistrictCode] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showModalChoseAddress, setShowModalChoseAddress] = useState(false);
    const [showModalDetailsBankTransfer, setShowModalDetailsBankTransfer] = useState(false);
    const { data: districts } = useGetDistrictsQuery(provinceCode, { skip: !provinceCode });
    const { data: wards } = useGetWardsQuery(districtCode, { skip: !districtCode });
    const [couponCode, setCouponCode] = useState("")
    const [coupon, setCoupon] = useState({
        code: null,
        discount: 0,
        valid: false
    })
    const {
        data: userCart,
        isLoading: isLoadingGetCart,
        isError: isErrorGetCart,
        refetch: refetchGetCart
    } = useGetCartQuery(undefined, { skip: !isAuthenticated });

    const {
        data: products,
        isLoading: isLoadingGetProducts,
        isError: isErrorGetProducts
    } = useGetProductsInIdsQuery(productIds, { skip: isAuthenticated })

    const {
        data: userAddresses,
        isLoadingGetAddresses,
        isErrorGetAddresses
    } = useGetAddressesByUserQuery(auth?.id, { skip: !isAuthenticated });
    const [checkCouponValid] = useLazyCheckCouponValidQuery()
    const [createOrderByCustomer, { isLoading: isLoadingCreateOrderByCustomer }] = useCreateOrderByCustomerMutation();
    const [createOrderByAnonymousCustomer, { isLoading: isLoadingCreateOrderByAnonymousCustomer }] = useCreateOrderByAnonymousCustomerMutation();

    const { register, control, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: auth?.name,
            phone: auth?.phone,
            email: auth?.email,
        }
    });

    useEffect(() => {
        if (provinceCode) {
            setValue('district', null);
            setValue('ward', null);
        }
    }, [provinceCode, setValue]);

    useEffect(() => {
        if (districtCode) {
            setValue('ward', null);
        }
    }, [districtCode, setValue]);

    useEffect(() => {
        if (selectedAddress) {
            setValue('province', { value: selectedAddress.province.code, label: selectedAddress.province.name });
            setValue('district', { value: selectedAddress.district.code, label: selectedAddress.district.name });
            setValue('ward', { value: selectedAddress.ward.code, label: selectedAddress.ward.name });
            setValue('address', selectedAddress.detail);
        } else {
            setValue('province', null);
            setValue('district', null);
            setValue('ward', null);
            setValue('address', null);
        }
    }, [selectedAddress]);


    if (isLoadingGetCart || isLoadingGetAddresses) {
        return <Loading />
    }

    if (isErrorGetCart || isErrorGetAddresses) {
        return <ErrorPage />
    }

    const onSubmit = (values) => {
        const { province, district, ward, ...rest } = values;
        const data = {
            ...rest,
            provinceCode: values.province.value,
            districtCode: values.district.value,
            wardCode: values.ward.value,
            couponCode: coupon.valid ? coupon.code : null,
            couponDiscount: coupon.valid ? coupon.discount : null,
            items: renderCart.cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.discountPrice ?? item.product.price
            }))
        }

        if (isAuthenticated) {
            createOrderByCustomer(data)
                .unwrap()
                .then((res) => {
                    refetchGetCart();
                    window.location.href = res.url
                })
                .catch((error) => {
                    toast.error(error?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
                })
        } else {
            createOrderByAnonymousCustomer(data)
                .unwrap()
                .then((res) => {
                    dispatch(deleteAllFromCart());
                    window.location.href = res.url
                })
                .catch((error) => {
                    toast.error(error?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
                })
        }
    };

    const handleGetSelectedAddress = (value) => {
        setProvinceCode(prev => value?.province?.code);
        setDistrictCode(prev => value?.district?.code);
        setSelectedAddress(prev => value);
    }

    const checkCoupon = (e) => {
        e.preventDefault();
        if (couponCode.trim().length > 0) {
            checkCouponValid(couponCode)
                .unwrap()
                .then((res) => {
                    toast.success("Áp dụng mã giảm giá thành công")
                    setCoupon({
                        code: couponCode,
                        discount: res.discount,
                        valid: true
                    })
                })
                .catch((error) => {
                    toast.error(error?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại sau")
                    setCoupon({
                        code: null,
                        discount: 0,
                        valid: false
                    })
                })
        }
    };

    const localCart = getLocalCart(cart, products);
    const renderCart = isAuthenticated ? userCart : localCart;
    const tempPrice = renderCart?.totalAmount;
    const discountPrice = coupon.valid ? tempPrice * coupon.discount / 100 : 0
    const totalPrice = tempPrice - discountPrice

    return (
        <>
            <Helmet>
                <title>Thanh toán</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <Link to={"/"}>Trang chủ</Link>
                                    <span>Thanh toán</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="checkout spad">
                <div className="container">
                    <div className="checkout__form">
                        <form id="form-checkout" onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <h4>Thông tin nhận hàng</h4>
                                            <div className="form-group mb-3">
                                                <input
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Họ tên"
                                                    {...register('name')}
                                                />
                                                {errors.name && <span className="error invalid-feedback">{errors.name.message}</span>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <input
                                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Số điện thoại"
                                                    {...register('phone')}
                                                />
                                                {errors.phone && <span className="error invalid-feedback">{errors.phone.message}</span>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <input
                                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Email"
                                                    {...register('email')}
                                                />
                                                {errors.email && <span className="error invalid-feedback">{errors.email.message}</span>}
                                            </div>
                                            {isAuthenticated && userAddresses?.length > 0 && (
                                                <div className="form-group mb-3">
                                                    <span
                                                        className="chose-other-address"
                                                        onClick={() => setShowModalChoseAddress(true)}
                                                    >Chọn địa chỉ giao hàng</span>
                                                </div>
                                            )}
                                            <div className="form-group mb-3 address">
                                                <Controller
                                                    name="province"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            className={errors.province ? 'is-invalid' : ''}
                                                            {...field}
                                                            placeholder="Chọn tỉnh/thành phố"
                                                            options={
                                                                provinces && provinces.map(province => ({
                                                                    value: province.code,
                                                                    label: province.name
                                                                }))
                                                            }
                                                            onChange={(selectedOption) => {
                                                                setProvinceCode(selectedOption.value);
                                                                field.onChange(selectedOption);
                                                                setDistrictCode(null);
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.province && <span className="error invalid-feedback">{errors.province.message}</span>}
                                            </div>
                                            <div className="form-group mb-3 address">
                                                <Controller
                                                    name="district"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            className={errors.district ? 'is-invalid' : ''}
                                                            {...field}
                                                            placeholder="Chọn quận/huyện"
                                                            options={
                                                                districts && districts.map(district => ({
                                                                    value: district.code,
                                                                    label: district.name
                                                                }))
                                                            }
                                                            isDisabled={!provinceCode}
                                                            onChange={(selectedOption) => {
                                                                setDistrictCode(selectedOption.value);
                                                                field.onChange(selectedOption);
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.district && <span className="error invalid-feedback">{errors.district.message}</span>}
                                            </div>
                                            <div className="form-group mb-3 address">
                                                <Controller
                                                    name="ward"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select
                                                            className={errors.ward ? 'is-invalid' : ''}
                                                            {...field}
                                                            placeholder="Chọn xã/phường"
                                                            options={
                                                                wards && wards.map(ward => ({
                                                                    value: ward.code,
                                                                    label: ward.name
                                                                }))
                                                            }
                                                            isDisabled={!districtCode}
                                                        />
                                                    )}
                                                />
                                                {errors.ward && <p className="error invalid-feedback">{errors.ward.message}</p>}
                                            </div>
                                            <div className="form-group mb-3">
                                                <input
                                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Địa chỉ giao hàng"
                                                    {...register('address')}
                                                />
                                                {errors.address && <span className="error invalid-feedback">{errors.address.message}</span>}
                                            </div>
                                            <div className="form-group">
                                                <textarea
                                                    {...register('customerNote')}
                                                    className="form-control"
                                                    placeholder="Ghi chú đơn hàng..."
                                                    rows={3}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="checkout__input">
                                                <h4>Vận chuyển</h4>
                                                <div id="shipping-method">
                                                    {shippingMethods.map((method, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-2 border px-3 py-1">
                                                            <input
                                                                type="radio"
                                                                className="me-1"
                                                                id={method.value}
                                                                value={method.value}
                                                                name="shipping-method"
                                                                {...register('shippingMethod')}
                                                            />
                                                            <label htmlFor={method.value} className="mb-0">
                                                                {method.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                    {errors.shippingMethod && <span className="text-danger">{errors.shippingMethod.message}</span>}
                                                </div>
                                            </div>
                                            <div className="checkout__input">
                                                <h4 className="mt-4">Thanh toán</h4>
                                                <div id="payment-method">
                                                    {paymentMethods.map((method, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-2 border px-3 py-1">
                                                            <input
                                                                type="radio"
                                                                className="me-1"
                                                                id={method.value}
                                                                value={method.value}
                                                                name="payment-method"
                                                                {...register('paymentMethod')}
                                                            />
                                                            <label
                                                                htmlFor={method.value}
                                                                className="mb-0"
                                                            >
                                                                {method.label}
                                                            </label>
                                                            {method.value === "BANK_TRANSFER" && (
                                                                <span
                                                                    onClick={() => setShowModalDetailsBankTransfer(true)}
                                                                    className="see-details"
                                                                >&nbsp;(Xem chi tiết)</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {errors.paymentMethod && <span className="text-danger">{errors.paymentMethod.message}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="checkout__order">
                                        <h4>Thông tin đơn hàng</h4>
                                        <div className="row">
                                            <div className="col-10">
                                                <p className="fw-medium">Sản phẩm</p>
                                            </div>
                                            <div className="col-2">
                                                <p className="fw-medium text-end">Tổng</p>
                                            </div>
                                        </div>

                                        {renderCart?.cartItems.map((cartItem) => (
                                            <div key={cartItem.id} className="row">
                                                <div className="col-9">
                                                    <p style={{ fontSize: 14 }}>{cartItem.quantity} x {cartItem.product.name}</p>
                                                </div>
                                                <div className="col-3">
                                                    <p style={{ fontSize: 14 }} className="text-end">{formatCurrency(cartItem.totalAmount)}</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="py-3 border-top border-bottom" id="coupon-container">
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Nhập mã giảm giá"
                                                    id="coupon-input"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    disabled={coupon.valid}
                                                    autoComplete="off"
                                                />
                                                {!coupon.valid ? (
                                                    <button
                                                        className="primary-btn bg-secondary"
                                                        onClick={(e) => checkCoupon(e)}
                                                    >ÁP DỤNG</button>
                                                ) : (
                                                    <button
                                                        className="primary-btn bg-secondary"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCouponCode("");
                                                            setCoupon({
                                                                code: null,
                                                                discount: 0,
                                                                valid: false
                                                            })

                                                        }}
                                                    >HỦY</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="checkout__order__subtotal">
                                            Thành tiền
                                            <span className="temporary-amount">{formatCurrency(tempPrice)}</span>
                                        </div>
                                        <div className="checkout__order__discount">
                                            Giảm giá {coupon.valid && `(${coupon.discount}%)`}
                                            <span className="discount-amount">{formatCurrency(discountPrice)}</span>
                                        </div>
                                        <div className="checkout__order__total">
                                            Tổng tiền
                                            <span className="total-amount">{formatCurrency(totalPrice)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link to={"/gio-hang"} className="btn-back">
                                                <span className="d-inline-block me-1"><i className="fa-solid fa-angle-left"></i></span>
                                                Quay lại giỏ hàng
                                            </Link>
                                            <button
                                                type="submit"
                                                className="border-0 primary-btn btn btn-primary"
                                                id="btn-submit-order"
                                            >XÁC NHẬN</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section >

            {isAuthenticated && userAddresses?.length && showModalChoseAddress && (
                <ModalChoseAddress
                    data={userAddresses}
                    currentAddress={selectedAddress}
                    show={showModalChoseAddress}
                    onHide={() => setShowModalChoseAddress(false)}
                    onGetSelectedAddress={handleGetSelectedAddress}
                />
            )}

            {showModalDetailsBankTransfer && (
                <ModalDetailsBankTransfer
                    show={showModalDetailsBankTransfer}
                    onHide={() => setShowModalDetailsBankTransfer(false)}
                />
            )}
        </>
    )
}

export default Order