import { PlusOutlined, RetweetOutlined, SnippetsOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Space, Spin, Tabs, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetReportDataQuery } from "../../app/services/report.service";
import AppBreadCrumb from "../../components/layout/AppBreadCrumb";
import ReportSummary from "./components/summary/ReportSummary";
import TableExpense from "./components/table/TableExpense";
import TableRevenue from "./components/table/TableRevenue";

const breadcrumb = [
    { label: "Báo cáo thu chi", href: "/admin/reports" },
]
const Report = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const {
        data,
        isLoading: isFetchingReport,
    } = useGetReportDataQuery({}, { refetchOnMountOrArgChange: true });

    if (isFetchingReport) {
        return <Spin size="large" fullscreen />
    }

    return (
        <>
            <Helmet>
                <title>Báo cáo thu chi</title>
            </Helmet>
            <AppBreadCrumb items={breadcrumb} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <Flex justify="space-between">
                    <Space style={{ marginBottom: '1rem' }}>
                        <DatePicker.RangePicker
                            style={{ width: "100%" }}
                            format={"DD/MM/YYYY"}
                        />
                        <Button
                            style={{ backgroundColor: "rgb(243, 156, 18)" }}
                            type="primary"
                            icon={<RetweetOutlined />}
                            onClick={() => setOpen(true)}
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            style={{ backgroundColor: "#52c41a" }}
                            type="primary"
                            icon={<SnippetsOutlined />}
                        >
                            Xuất báo cáo
                        </Button>
                    </Space>
                    <RouterLink to="/admin/payment-vouchers/create">
                        <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
                            Tạo phiếu chi
                        </Button>
                    </RouterLink>
                </Flex>

                <ReportSummary
                    totalRevenue={data?.totalRevenue}
                    totalPayment={data?.totalPayment}
                    profit={data?.totalRevenue - data?.totalPayment}
                />

                <Tabs>
                    <Tabs.TabPane tab="Doanh thu" key={1}>
                        <TableRevenue data={data?.orders}/>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Chi phí" key={2}>
                        <TableExpense data={data?.paymentVouchers}/>
                    </Tabs.TabPane>
                </Tabs>
            </div>

        </>
    );
};

export default Report;
