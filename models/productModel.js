import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    name : {type : String, required: true} ,
    rating : {type : Number, required: true} ,
    comment : {type : Number, required: true} ,
    user :  {type : mongoose.Schema.Types.ObjectId , ref : 'User' , required: true}
} , {timestamps: true})


const productSchema = new mongoose.Schema({
    name : {type : String, required: true} ,
    slug : {type : String, required: true} ,
    description : {type : String, required: true } ,
    price : {type : Number, required: true} ,
    category : {type : mongoose.Schema.Types.ObjectId , ref : 'Category' , required: true} ,
    quantity : {type : Number, required: true} ,
    photo : {data : Buffer , contentType : String} ,
    shipping : {type : String},
    reviews : [reviewSchema] ,
    rating : {type : Number, required: true , default : 0} ,
    numReviews : {type : Number, required: true , default : 0} 
}, {timestamps: true})

export default mongoose.model('Products', productSchema)