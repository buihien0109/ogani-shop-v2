import { LeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, message, Space, Spin, theme } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import { useGetBannersActiveQuery, useSortBannersMutation } from "../../../app/services/banner.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";
import { useStrictDroppable } from "../../../hooks/useStrictDroppable";

const breadcrumb = [
  { label: "Danh sách banner", href: "/admin/banners" },
  { label: "Sắp xếp banner", href: "/admin/banners/sort" },
];

const BannerSort = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [banners, setBanners] = useState([]);

  const { data, isLoading: isFetchingBanners } = useGetBannersActiveQuery();
  const [enabled] = useStrictDroppable(isFetchingBanners);
  const [sortBanners, { isLoading: isLoadingSortBanners }] = useSortBannersMutation();

  useEffect(() => {
    if (data) {
      const newData = data.map(banner => ({
        id: `${banner.id}`,
        name: banner.name,
      }));
      setBanners(newData);
    }
  }, [data]);

  if (isFetchingBanners) {
    return <Spin size="large" />;
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedBanners = Array.from(banners);
    const [removed] = reorderedBanners.splice(result.source.index, 1);
    reorderedBanners.splice(result.destination.index, 0, removed);

    setBanners(reorderedBanners);
  };

  const handleSort = () => {
    const bannerIds = banners.map((banner) => +banner.id);
    sortBanners({ bannerIds }).unwrap()
      .then((data) => {
        message.success("Sắp xếp banner thành công");
      })
      .catch((error) => {
        if (error?.data?.message) {
          message.error(error.data.message);
        }
      });
  }

  return (
    <>
      <Helmet>
        <title>Sắp xếp banner</title>
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
        <Space style={{ marginBottom: "1rem" }}>
          <RouterLink to="/admin/banners">
            <Button type="default" icon={<LeftOutlined />}>
              Quay lại
            </Button>
          </RouterLink>
          <Button
            style={{ backgroundColor: "rgb(60, 141, 188)" }}
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSort}
            loading={isLoadingSortBanners}
          >
            Cập nhật
          </Button>
        </Space>

        <DragDropContext onDragEnd={onDragEnd}>
          {enabled && (
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ display: 'flex', flexWrap: "wrap", gap: '8px' }}
                >
                  {banners.map((banner, index) => (
                    <Draggable key={banner.id} draggableId={banner.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Card style={{
                            width: 200,
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            border: "3px solid #f39c32",
                            backgroundColor: snapshot.isDragging ? "#f39c32" : "#f9f9f9",
                          }}>
                            {banner.name}
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>)}
        </DragDropContext>
      </div>
    </>
  );
};

export default BannerSort;
