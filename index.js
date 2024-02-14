const express= require("express")
require('dotenv').config();
const app=express()
const port=3100
const fileUpload=require('express-fileupload')
const mongoose=require("mongoose")
var cloudinary = require('cloudinary').v2;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: '/tmp/',
}))


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret:process.env.CLOUD_SECRET_KEY
});

mongoose.connect(process.env.MONGODB_URL)
const imageurlSchema=mongoose.Schema({
  img_url:String
})
const imgurl=mongoose.model("imgurl",imageurlSchema)

app.post('/upload',(req,res)=>{
  const file = req.files && req.files.photo;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  cloudinary.uploader.upload(file.tempFilePath,{folder: 'belekeri'},(err,result)=>{
    const url=result.url
    const i1=new imgurl({
      img_url:url
    })
    i1.save()
    return res.send("successufll")
  })
})


app.get('/',async (req,res)=>{
  try {
    const result = await imgurl.find({});
    const imageUrls = result.map(item => item.img_url);
    res.json(imageUrls);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.listen(port,()=>{
    console.log('Server started on port',port)
})