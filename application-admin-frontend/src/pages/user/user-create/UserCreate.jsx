import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Space, Spin, message, theme } from "antd";
import React from "react";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useGetRolesQuery } from "../../../app/services/role.service";
import { useCreateUserMutation } from "../../../app/services/user.service";
import AppBreadCrumb from "../../../components/layout/AppBreadCrumb";

const breadcrumb = [
    { label: "Danh sách user", href: "/admin/users" },
    { label: "Tạo user", href: "/admin/users/create" },
];
const UserCreate = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { data: roles, isLoding: isFetchingRoles } = useGetRolesQuery();
    const [createUser, { isLoading }] = useCreateUserMutation();


    if (isFetchingRoles) {
        return <Spin size="large" fullscreen />;
    }

    const handleCreate = () => {
        form.validateFields()
            .then((values) => {
                // if data not role USER => warning
                const useRole = roles.find(role => role.name === 'USER');
                if (!values.roleIds.includes(useRole.id)) {
                    message.warning('User phải có quyền USER!');
                    return new Promise((resolve, reject) => reject());
                }

                return createUser(values).unwrap()
            })
            .then((data) => {
                message.success("Tạo user thành công!");
                setTimeout(() => {
                    navigate(`/admin/users/${data.id}/detail`);
                }, 1500)
            })
            .catch((error) => {
                if (error?.data?.message) {
                    message.error(error.data.message);
                }
            });
    };

    return (
        <>
            <Helmet>
                <title>Tạo user</title>
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
                    <RouterLink to="/admin/users">
                        <Button type="default" icon={<LeftOutlined />}>
                            Quay lại
                        </Button>
                    </RouterLink>
                    <Button
                        style={{ backgroundColor: "rgb(60, 141, 188)" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        loading={isLoading}
                    >
                        Tạo user
                    </Button>
                </Space>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    initialValues={{ role: "USER" }}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Họ tên"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không được để trống!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter name" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Email không được để trống!",
                                    },
                                    {
                                        type: "email",
                                        message: "Email không đúng định dạng!",
                                    },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Số điện thoại không được để trống!",
                                    },
                                    {
                                        pattern: new RegExp(/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/),
                                        message: 'Số điện thoại di động không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input placeholder="Enter phone" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Họ tên không được để trống!",
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Enter password" />
                            </Form.Item>

                            <Form.Item
                                label="Quyền"
                                name="roleIds"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Quyền không được để trống!",
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: "100%" }}
                                    showSearch
                                    placeholder="Select roles"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    options={roles?.map((role) => ({
                                        label: role.name,
                                        value: role.id,
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    );
};

export default UserCreate;
