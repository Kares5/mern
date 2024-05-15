import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'
import categoryModel from "../models/categoryModel.js";
import orderModel from '../models/orderModel.js'
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();
// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });

export const createProductController  = async(req, res) => {
    try {
        const {name , description , price , category , quantity , shipping} = req.fields
        const {photo} = req.files
        switch (true) {
            case !name :
            res.status(500).send({error : "Name is required"});
            case !description :
            res.status(500).send({error : "Description is required"});
            case !price : 
            res.status(500).send({error : "Price is required"});
            case !category :
            res.status(500).send({error : "Category is required"});
            case !quantity :
            res.status(500).send({error : "Quantity is required"}); 
            case !shipping :
            res.status(500).send({error : "Shipping is required"});  
            case photo && photo.size > 1000000 :
                res.status(500).send({error : "Photo is required and should be less than 1mb"})
        }
        const products = new productModel({...req.fields , slug : slugify(name)})
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({success : true , message : 'product created successfully', products});

    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in creating Product'});
        
    }
}
// get all 
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createdAt: -1})
        res.status(200).send({success: true, message : "Get Products Success" , products , countTotal : products.length})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in getting  Products'});
        
    }
}
// get single
export const getSingleProductController =async (req, res) => {
    try {
        const product = await productModel.findOne({slug : req.params.slug}).select('-photo').populate('category')
        res.status(200).send({success: true, message : "Get single Product Success" , product})
    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in getting  Product'});
    }

}
// get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo')
        if (product.photo.data) {
            res.set('Content-Type' , product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in getting photo Product'});
    }
}
// update
export const updateProductController = async (req, res) => {
    try {
        const {name , description , price , category , quantity , shipping} = req.fields
        const {photo} = req.files
        switch (true) {
            case !name :
            res.status(500).send({error : "Name is required"});
            case !description :
            res.status(500).send({error : "Description is required"});
            case !price : 
            res.status(500).send({error : "Price is required"});
            case !category :
            res.status(500).send({error : "Category is required"});
            case !quantity :
            res.status(500).send({error : "Quantity is required"}); 
            case !shipping :
            res.status(500).send({error : "Shipping is required"});  
            case photo && photo.size > 1000000 :
                res.status(500).send({error : "Photo is required and should be less than 1mb"}) 
        } 
        const products = await productModel.findByIdAndUpdate(req.params.pid , {...req.fields , slug : slugify(name)} , {new : true});
        if(photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({success : true , message : 'product Updated successfully', products});
    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in updating  Product'});
    }
}
// delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({success : true , message : 'product deleted successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).send({success : false , error , message : 'Erorr in deleting  Product'});  
    }
}

// filter
export const productFilterController = async (req , res) => {
    try {
        const {checked} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        const products = await productModel.find(args)
        res.status(200).send({success : true , products})    
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in filter Product'});  
    }
}
// count 
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({success : true , total})    
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in count Product'}); 
        
    }
}

// product List based on page
export const productListController = async (req , res) => {
    try {
        const perPage = 6
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select
        ('-photo').skip( (page - 1) * perPage ).limit( perPage).sort({createdAt: -1})
        res.status(200).send({success : true , products}) 
        // .skip( (page - 1) * perPage ) 
        // .skip( (3 - 1) * 6 )  
        // .skip( 12 )  
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in page Product'}); 
        
    }
}

// search products
export const searchProductsController = async (req, res) => {
    try {
        const {keyword} = req.params
        const result = await productModel.find({
            $or : [
                {name : {$regex : keyword , $options : 'i'}},
                {description :  {$regex : keyword , $options : 'i'}}
            ]  
        }).select('-photo')
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in search Product'});   
    }
}

// similar product
export const relatedProductController = async (req ,res) => {
    try {
        const {pid , cid} = req.params
         // يعني  جبلي كل الايديهات تبع المنتج يلي واقفة عليه من نفس كاتيغوري ولكن  الايدي تبعو نوت انكلود البرودكت ايدي يلي فاتحة عليه 
        const products = await productModel.find({category : cid , _id : {$ne : pid}}).select('-photo').limit(3).populate('category')
        res.status(200).send({success : true , products})      
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in related Product'});       
    }
}

// get products in category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({slug : req.params.slug})
        // من الفيلد يلي اسمو كاتيغوري الموجود بالبرودكت جبلي كل شي معلومات بخص الكاتيغوري موبس الايدي كمان النيم والسلغ
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({success : true , products , category}) 
        
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in getting  Product in category'});  
    }
}
// product review
export const productReviewController = async (req, res) => {
    try {
        const {rating , comment} = req.body
        // اولشي مناخد الراتنغ والكومنت من اليوزر وبعدين منحدد اي برودكت بالضبط يلي علق عليه اليوزر
        const product = await productModel.findById(req.params.id)
        // اذا البرودكت كان موجود منتحقق اذا معملو ريفيو من قبل نفس اليوزر او لا
        if(product ) {
            // البرودكت يلي تحت هيي كا مل معلومات البرودكت يلي جبت الايدي تبعو من الرابط 
            // r = review
            const alreadyReview = product.reviews.find( r => r.user.toString() ===  req.user._id.toString())
            if(alreadyReview) {
                res.status(400).send({success : false , message : 'product already review'});
            }
            const review = {
                name : req.user.name ,
                rating : Number(rating) ,
                comment ,
                user :  req.user._id
            }

            product.reviews.push(review)

             product.numReviews = product.reviews.length
            product.rating =  product.reviews.reduce((acc , item) => item.rating + acc , 0) / product.reviews.length
            await product.save()
            res.status(201).send({success : true , message : 'review added successfully'});
        }else {
            res.status(404).send({success : false , error , message : 'Product Not Found'}); 
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({success : false , error , message : 'Erorr in add  review'}); 
        
    }
}
// payment gateway api
// token


export const braintreeTokenController = async (req,res) => {
    try {
        gateway.clientToken.generate({} , function(err , response){
            if (err) {
                res.status(500).send(err);
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error);  
    }
}



export const braintreePaymentController = async (req , res) => {
    try {
        const { cart , nonce} = req.body
        let total = 0
        // i = item
        cart.map( (i) =>{ total += i.price})
        let newTransaction = gateway.transaction.sale({
            amount : total,
            paymentMethodNonce : nonce,
            options : {
                submitForSettlement : true,
            },
        },
       function(error , result) {
        if (result) {
            const order = new orderModel({
                products : cart,
                payment : result,
                buyer : req.user._id,
            }).save();
            res.json({ok: true})
        }else{
            res.status(500).send(error)
        }
       } 
    )
    } catch (error) {
        console.log(error);
    }
}