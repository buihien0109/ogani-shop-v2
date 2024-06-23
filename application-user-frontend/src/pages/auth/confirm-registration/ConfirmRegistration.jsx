import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import breadcrumb from "../../../../public/breadcrumb.jpg";
import { useCheckRegisterTokenQuery } from "../../../app/apis/auth.api";
import ErrorPage from "../../../components/error/ErrorPage";
import Loading from "../../../components/loading/Loading";

function ConfirmRegistration() {
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get('token');
    const {
        data,
        isLoading,
        isError,
        error
    } = useCheckRegisterTokenQuery(token);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    return (
        <>
            <Helmet>
                <title>Xác thực tài khoản</title>
            </Helmet>

            <section className="breadcrumb-section set-bg" style={{ backgroundImage: `url(${breadcrumb})` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <div className="breadcrumb__text">
                                <div className="breadcrumb__option">
                                    <a href="/">Trang chủ</a>
                                    <span>Xác thực tài khoản</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="wishlist spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h4>{data.message}</h4>
                            {data.success && (
                                <>
                                    <p className='mt-3 text-sm text-gray-500'>Chào mừng bạn đến với trang web của chúng tôi</p>
                                    <Link to={"/dang-nhap"} className="primary-btn border-0 mt-4">Đăng nhập tài khoản</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ConfirmRegistration