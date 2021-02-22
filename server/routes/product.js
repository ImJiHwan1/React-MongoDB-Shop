const { response } = require('express');
const express = require('express');
const multer = require('multer');
const router = express.Router();
const { Product } = require('../models/Products')

const { auth } = require('../middleware/auth')


//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req,file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,`${Date.now()}_${file.originalname}`)
    }
})
var upload = multer({ storage: storage }).single("file")

router.post('/uploadImage', auth ,(req, res) => {
    //가져온 이미지를 저장
    upload(req, res, err => {
        if(err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename})
    }) 
})

router.post('/uploadProduct', auth, (req, res) => {
    //가져온 정보들을 DB에 넣어준다
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return response.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

router.post('/products', (req, res) => {
    // product collection에 들어 있는 모든 상품정보를 가져오기
    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm

    let findArgs = {};

    for(let key in req.body.filters) {
        if(req.body.filters[key].length > 0) {
            if(key === "price") {
                findArgs[key] = {
                    // gte 는 설정 값보다 크거나 같다
                    // lte는 설정 값보다 작거나 같다
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
    if(term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) return res.status(400).json({ success:false, err })
                return res.status(200).json({ success: true, products, postSize: products.length })
        })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if(err) return res.status(400).json({ success:false, err })
                return res.status(200).json({ success: true, products, postSize: products.length })
        })
    }
})

//query를 이용해 가져올때는 body가 아닌 query이다
router.get('/products_by_id', (req, res) => {
    //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
    let type = req.query.type
    let productIds = req.query.id

    if(type === "array") {
        // id= 123123, 32135,123456
        // => productIds = ['123123','32135','123456' ]
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    Product.find({ _id: {$in: productIds }})
        .populate('writer')
        .exec((err, product) => {
            if(err) return res.status(400).send(err)
            return res.status(200).send(product)
        })
})



module.exports = router;
