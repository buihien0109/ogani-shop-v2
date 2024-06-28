import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useGetOrdersByCurrentUserQuery } from '../../../app/apis/order.api'
import ErrorPage from '../../../components/error/ErrorPage'
import Loading from '../../../components/loading/Loading'
import OrderItem from './OrderItem'

function OrderHistory() {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const { data: orders, isLoading, isError } = useGetOrdersByCurrentUserQuery()

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorPage />
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = currentPage * ITEMS_PER_PAGE;
    const ordersPerPage = orders?.slice(start, end);

    return (
        <>
            <Helmet>
                <title>Lịch sử giao dịch</title>
            </Helmet>

            <section className="pb-4">
                <div className="container">
                    <h4 className="mb-4">Lịch sử giao dịch</h4>
                    <div className="row">
                        <div className="col-12">
                            <table id="order-history-table">
                                <thead>
                                    <tr>
                                        <th>Mã đơn hàng</th>
                                        <th>Ngày giao dịch</th>
                                        <th>Số tiền</th>
                                        <th>Hình thức thanh toán</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ordersPerPage?.map((order) => (
                                        <OrderItem key={order.id} order={order} />
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination-container mt-4">
                                <div className="d-flex justify-content-center">
                                    <Pagination
                                        current={currentPage}
                                        total={orders.length}
                                        pageSize={ITEMS_PER_PAGE}
                                        onChange={(page) => handlePageChange(page)}
                                        className='text-center'
                                        hideOnSinglePage={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderHistory