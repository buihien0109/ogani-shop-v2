import { Button, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import ModalAddProduct from './ModalAddProduct';
import ProductTable from './ProductTable';

function TransactionProduct({ transactionId, data }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Typography.Paragraph>
                Tổng số sản phẩm : <Tag color="blue">{data.length}</Tag>
            </Typography.Paragraph>

            <ProductTable
                transactionId={transactionId}
                data={data}
            />

            <Button
                style={{ backgroundColor: "rgb(60, 141, 188)", marginTop: "1rem" }}
                type="primary"
                onClick={() => setOpen(true)}
            >
                Thêm sản phẩm
            </Button>

            {open && (
                <ModalAddProduct
                    transactionId={transactionId}
                    open={open}
                    setOpen={setOpen}
                />
            )}
        </>
    )
}

export default TransactionProduct