import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Space, Spin, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetDiscountCampaignsQuery } from "../../../app/services/discountCampaign.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import DiscountCampaignTable from "./DiscountCampaignTable";

const breadcrumb = [
  { label: "Danh sách khuyến mại", href: "/admin/discount-campaigns" },
]
const DiscountCampaignList = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    data,
    isLoading: isFetchingDiscountCampaigns,
  } = useGetDiscountCampaignsQuery();

  if (isFetchingDiscountCampaigns) {
    return <Spin size="large" fullscreen />
  }

  return (
    <>
      <Helmet>
        <title>Danh sách khuyến mại</title>
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
        <Space style={{ marginBottom: '1rem' }}>
          <RouterLink to="/admin/discount-campaigns/create">
            <Button style={{ backgroundColor: 'rgb(60, 141, 188)' }} type="primary" icon={<PlusOutlined />}>
              Tạo khuyến mại
            </Button>
          </RouterLink>
          <RouterLink to="/admin/discount-campaigns">
            <Button style={{ backgroundColor: 'rgb(0, 192, 239)' }} type="primary" icon={<ReloadOutlined />}>
              Refresh
            </Button>
          </RouterLink>
        </Space>

        <DiscountCampaignTable data={data} />
      </div>

    </>
  );
};

export default DiscountCampaignList;
