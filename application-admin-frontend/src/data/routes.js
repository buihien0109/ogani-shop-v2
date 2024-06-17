import {
    CarOutlined,
    FileTextOutlined,
    PieChartOutlined,
    ProjectOutlined,
    RocketOutlined,
    TabletOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
} from "@ant-design/icons";

const menu = [
    {
        id: 1,
        label: "Dashboard",
        icon: PieChartOutlined,
        url: "/admin/dashboard",
        subs: [
            {
                id: 11,
                label: "Tổng quan",
                url: "/admin/dashboard",
            },
        ],
    },
    {
        id: 10,
        label: "Báo cáo",
        icon: TrophyOutlined,
        url: "",
        subs: [
            {
                id: 101,
                label: "Báo cáo thu chi",
                url: "/admin/reports",
            },
            {
                id: 102,
                label: "Danh sách phiếu chi",
                url: "/admin/payment-vouchers",
            },
            {
                id: 103,
                label: "Tạo phiếu chi",
                url: "/admin/payment-vouchers/create",
            },
        ],
    },
    {
        id: 5,
        label: "Quản lý bài viết",
        icon: FileTextOutlined,
        url: "/admin/blogs",
        subs: [
            {
                id: 51,
                label: "Tất cả bài viết",
                url: "/admin/blogs",
            },
            {
                id: 52,
                label: "Bài viết của tôi",
                url: "/admin/blogs/own-blogs",
            },
            {
                id: 53,
                label: "Tạo bài viết",
                url: "/admin/blogs/create",
            },
            {
                id: 54,
                label: "Quản lý tag",
                url: "/admin/tags",
            },
        ],
    },
    {
        id: 2,
        label: "Quản lý sản phẩm",
        icon: TabletOutlined,
        url: "/admin/products",
        subs: [
            {
                id: 21,
                label: "Danh sách sản phẩm",
                url: "/admin/products",
            },
            {
                id: 22,
                label: "Tạo sản phẩm",
                url: "/admin/products/create",
            },
            {
                id: 23,
                label: "Danh mục sản phẩm",
                url: "/admin/categories",
            },
        ],
    },
    {
        id: 3,
        label: "Quản lý đơn hàng",
        icon: CarOutlined,
        url: "/admin/orders",
        subs: [
            {
                id: 31,
                label: "Danh sách đơn hàng",
                url: "/admin/orders",
            },
            {
                id: 32,
                label: "Tạo đơn hàng",
                url: "/admin/orders/create",
            }
        ],
    },
    {
        id: 4,
        label: "Quản lý khuyến mại",
        icon: CarOutlined,
        url: "/admin/discount-campaigns",
        subs: [
            {
                id: 41,
                label: "Danh sách khuyến mại",
                url: "/admin/discount-campaigns",
            },
            {
                id: 42,
                label: "Tạo khuyến mại",
                url: "/admin/discount-campaigns/create",
            },
            {
                id: 43,
                label: "Danh sách coupon",
                url: "/admin/coupons",
            }
        ],
    },

    {
        id: 6,
        label: "Quản lý user",
        icon: UserOutlined,
        url: "/admin/users",
        subs: [
            {
                id: 61,
                label: "Danh sách user",
                url: "/admin/users",
            },
            {
                id: 62,
                label: "Tạo user",
                url: "/admin/users/create",
            },
        ],
    },
    {
        id: 8,
        label: "Quản lý nhà cung cấp",
        icon: ProjectOutlined,
        url: "/admin/suppliers",
        subs: [
            {
                id: 81,
                label: "Danh sách nhà cung cấp",
                url: "/admin/suppliers",
            },
            {
                id: 82,
                label: "Tạo nhà cung cấp",
                url: "/admin/suppliers/create",
            },
            {
                id: 83,
                label: "Danh sách nhập hàng",
                url: "/admin/transactions",
            },
            {
                id: 84,
                label: "Tạo phiếu nhập hàng",
                url: "/admin/transactions/create",
            },
        ],
    },
    {
        id: 9,
        label: "Cấu hình",
        icon: RocketOutlined,
        url: "/admin/banners",
        subs: [
            {
                id: 91,
                label: "Banner trang chủ",
                url: "/admin/banners",
            },
            {
                id: 92,
                label: "Tạo banner",
                url: "/admin/banners/create",
            },
        ],
    },

];

export default menu;
