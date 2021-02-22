import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Icon, Row, Col } from 'antd'
import ProductImage from '../DetailProductPage/Sections/ProductImage'
import ProductInfo from '../DetailProductPage/Sections/ProductInfo'
import { addToCart } from '../../../_actions/user_actions'
import { useDispatch } from 'react-redux'

function DetailProductPage(props) {

    const dispatch = useDispatch();
    const productId = props.match.params.productId
    const [Product, setProduct] = useState({})

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
    }, [])

    const clickHandler = (productId) => {
        dispatch(addToCart(productId))
    }

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }} className="postPage">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1><Icon type="rocket" /> {Product.title} <Icon type="rocket" /></h1>
            </div>

            <br />

            {/* ProductImage */}
            {/* ProductInfo */}
            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}>
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24}>
                    <ProductInfo detail={Product} addToCart={clickHandler} />
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage