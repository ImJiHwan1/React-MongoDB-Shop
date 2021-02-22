import React, { useState } from 'react'
import  { Button, Form, Input, message, Typography } from 'antd'
import  FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

const { Title } = Typography
const { TextArea } = Input;

const Continents = [
    {key: 1, value: "Africa"},
    {key: 2, value: "Europe"},
    {key: 3, value: "Asia"},
    {key: 4, value: "North America"},
    {key: 5, value: "South America"},
    {key: 6, value: "Australia"},
    {key: 7, value: "Autarctica"}

]

function UploadProductPage(props) {

    const [TitleValue, setTitleValue] = useState("")
    const [DescriptionValue, setDescriptionValue] = useState("")
    const [PriceValue, setPriceValue] = useState(0)
    const [ContinentValue, setContinentValue] = useState(1)

    const [Images, setImagesValue] = useState([])


    const titleChangeHandler = (event) => {
        setTitleValue(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescriptionValue(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPriceValue(event.currentTarget.value)
    }

    const continentChangeHandler = (event) => {
        setContinentValue(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImagesValue(newImages)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(!TitleValue || !DescriptionValue || !PriceValue || !ContinentValue || !Images) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }
        const body = {
            //로그인 된 사람의 ID
            writer: props.user.userData._id,
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            continents: ContinentValue,
        }

        Axios.post("/api/product/uploadProduct", body)
            .then(response => {
                if(response.data.success) {
                    message.success('업로드 성공')
                    setTimeout(() => {
                        props.history.push('/')
                    }, 1000)
                } else {
                    alert('상품 업로드에 실패 했습니다.')
                }
            })
    }   

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}> 여행 상품 업로드 </Title>
            </div>

            <Form onSubmit={onSubmit}>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />
                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler}  value={TitleValue}/>
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={DescriptionValue} />
                <br />
                <br />
                <label>가격($)</label>
                <Input type="number" onChange={priceChangeHandler} value={PriceValue} />
                <br />
                <br />
                <select onChange={continentChangeHandler} value={ContinentValue}>
                        {Continents.map(item => (
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                </select>
                <br />
                <br />
                <Button
                    onClick={onSubmit}>
                    확인
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage