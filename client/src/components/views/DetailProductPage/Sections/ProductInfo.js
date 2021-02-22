import React, { useState, useEffect } from 'react'
import { Descriptions, Button } from 'antd'


function ProductInfo(props) {

    const [Product, setProduct] = useState({})

    useEffect(() => {
        setProduct(props.detail)
    }, [props.detail])


    const clickHandler = () => {
        props.addToCart(props.detail._id)
    }

    return (
        <div>
            <Descriptions title="상품 정보" bordered>
                    <Descriptions.Item label="가격($)">{Product.price} $</Descriptions.Item>
                    <Descriptions.Item label="Sold">{Product.price}</Descriptions.Item>
                    <Descriptions.Item label="View">{Product.price}</Descriptions.Item>
                    <Descriptions.Item label="상품 설명">{Product.price}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                            Add to Cart
                    </Button>
            </div>
        </div>
    )
}

export default ProductInfo