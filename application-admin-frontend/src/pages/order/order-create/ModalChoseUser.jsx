import { Button, Modal, Select, Space } from 'antd';
import React, { useState } from 'react';
import { useGetUsersQuery } from '../../../app/services/user.service';

function ModalChoseUser({ open, setOpen, onSetSelectedUser }) {
    const { data: users } = useGetUsersQuery();
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <>
            <Modal
                open={open}
                title="Chọn user"
                footer={null}
                onCancel={() => setOpen(false)}
            >
                <Select
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="Chọn user"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={users?.map((user) => ({
                        label: user.name,
                        value: user.id,
                    }))}
                    onChange={(value) => {
                        setSelectedUser(value);

                    }}
                />
                <Space style={{ marginTop: "1rem" }}>
                    <Button
                        type="primary"
                        disabled={!selectedUser}
                        onClick={() => {
                            onSetSelectedUser(users.find((user) => user.id === selectedUser))
                            setOpen(false);
                        }}
                    >
                        Xác nhận
                    </Button>
                </Space>
            </Modal>
        </>
    )
}

export default ModalChoseUser