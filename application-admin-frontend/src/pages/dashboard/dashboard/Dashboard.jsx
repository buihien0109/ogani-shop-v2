import { Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import DashboardSummary from "./summary/DashboardSummary";
import ViewChart from "./chart/ViewChart";
import DashboardTable from "./table/DashboardTable";
import { useGetDashboardDataQuery } from "../../../app/services/dashboard.service";

const Dashboard = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { data, isLoading: isFetchingDashboard } = useGetDashboardDataQuery();

    if (isFetchingDashboard) {
        return <Spin size="large" fullscreen />;
    }

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <AppBreadCrumb items={[]} />
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <DashboardSummary
                    totalRevenue={data?.totalRevenue}
                    totalPayment={data?.totalPayment}
                    profit={data?.totalRevenue - data?.totalPayment}
                    newOrders={data?.newOrders}
                    newUsers={data?.newUsers}
                    newBlogs={data?.newBlogs}
                />
                <ViewChart
                    bestSellingProducts={data?.bestSellingProducts}
                    revenueAndExpenseList={data?.revenueAndExpenseList}
                />
                <DashboardTable
                    latestOrders={data?.latestOrders}
                    latestUsers={data?.latestUsers}
                />
            </div>
        </>
    );
};

export default Dashboard;
