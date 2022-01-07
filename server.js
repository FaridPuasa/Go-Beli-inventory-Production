const express = require('express')
// const router = require('./routes/inventory')
const mongoose = require('mongoose')
// const productRouter = require('./routes/inventory')
const Producto = require('./models/product')
const BalikO = require('./models/returns')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
//const passport = require('passport')

const flash = require('express-flash')
const session = require('express-session')
const app = express()
const multer = require('multer')
const SaleO = require('./models/sale') 
const fs = require('fs')
const fileUpload = require('express-fileupload')
const User = require('./models/user')

const Product = require('./models/product')
const Sale = require('./models/sale')
const Balik = require('./models/returns')




const user = []

mongoose.connect('mongodb://goRush:gsb2332065@cluster0-shard-00-00.rikek.mongodb.net:27017,cluster0-shard-00-01.rikek.mongodb.net:27017,cluster0-shard-00-02.rikek.mongodb.net:27017/gobeli?ssl=true&replicaSet=atlas-tr9az4-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true});



app.set('view engine','ejs')


app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))


//Login & Registration

  
app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/logout', (req,res) => {
    res.render('login')
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post("/login", (req,res) =>{
    //res.redirect("/")
    User.authenticate(req.body.email, req.body.password, (error, user) =>{
        if(!error || user){
            res.render("product")
            currentUser = user;  
        }else {
            res.render('error')
        }
    })
})

app.post('/register', (req, res) => {  
    let user = new User({
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        position: req.body.position
    });
    res.redirect("/login")
    user.save(function (err) {
    if (err) {
    	if (err.name === "MongoError" && err.code === 11000) {
    		res.render('error', {
    			error_code: '11000',
                head: 'Invalid_User_MongoError-11000',
                message: 'Please logout and try again. If the error still persist, please contact our customer support +6732332065 via WhatsApp',
    			href: "signup"
    		});
    	}
    }
    console.log(req.body.password)
    });
})


//Product
app.get('/product', async (req,res) =>{
    const product = await Producto.find().sort({ createdAt: 'desc'})
      res.render('product/index', { products: product})
  })
app.post('/product', async (req,res) =>{
    const product = await Producto.find().sort({ createdAt: 'desc'})
      res.render('product/index', { products: product})
  })


  
  app.get('./product/new', function(req,res){
      res.render('product/new');
  });
  
  app.get('/product/new',(req,res)=>{
      res.render('product/new', {product: new Product() })
  })
  
  app.get('/product/:id', async (req,res)=>{
      const product = await Product.findById(req.params.id)
      if (product == null) res.redirect('/')
      res.render('product/show', { product: product})
  })
  
  app.get('/product/edit/:id', async (req,res)=>{
      const product = await Product.findById(req.params.id)
      if (product == null) res.redirect('/')
      res.render('product/edit', { product: product})
  })
  
  app.post('/product/new', async (req, res, next)=>{
      req.product = new Product()
      next()
  }, saveProductAndRedirect('new'))
  
  
  
  app.put('/product/:id', async (req, res, next)=>{
      req.product = await Product.findById(req.params.id)
      next()
  }, saveProductAndRedirect('edit'))
  

  app.delete('/product/:id', async (req,res)=>{
      await Product.findByIdAndDelete(req.params.id)
      res.redirect('/')
  })

  
  
  
  
  
  function saveProductAndRedirect(path)   {
      return async (req,res) => {
          let product = req.product
              product._id = req.body._id
              product.title = req.body.title
              product.description = req.body.description
              product.sold = req.body.sold
              product.quantityonhand = req.body.quantityonhand
              product.payment = req.body.payment
              product.remarks = req.body.remarks
              product.restock = req.body.restock
          try{
          product = await product.save()
          res.redirect(`/product/${product.id}`)
      } catch(e)  {
      res.render(`/product/${path}`, { product: product})
      }
      }
  }

//Render Header and Footer
app.get('/header', (req,res)=> {
    res.render('/product/_header.ejs');
});

app.get('/footer', (req,res)=> {
    res.render('/product/_footer.ejs');
});




//Sales Tab
app.get('/sale', async (req,res) =>{
    const sale = await SaleO.find().sort({ createdAt: 'desc'})
      res.render('sale/sales_index', { sales: sale})
  })
  
  app.get('./sale/new', function(req,res){
      res.render('sale/sales_new');
  });
  
  app.get('/sale/new',(req,res)=>{
      res.render('sale/sales_new', {sale: new Sale() })
  })
  
  app.get('/sale/:id', async (req,res)=>{
      const sale = await Sale.findById(req.params.id)
      if (sale == null) res.redirect('/sale')
      res.render('sale/sales_show', { sale: sale})
  })
  
  app.get('/sale/edit/:id', async (req,res)=>{
      const sale = await Sale.findById(req.params.id)
      if (sale == null) res.redirect('/sale')
      res.render('sale/sales_edit', { sale: sale})
  })
  
  app.post('/sale/new', async (req, res, next)=>{
      req.sale = new Sale()
      next()
  }, saveSaleAndRedirect('new'))
  
  
  
  app.put('/sale/:id', async (req, res, next)=>{
      req.sale = await Sale.findById(req.params.id)
      next()
  }, saveSaleAndRedirect('edit'))
  
  
  app.delete('/sale/:id', async (req,res)=>{
      await Sale.findByIdAndDelete(req.params.id)
      res.redirect('/sale')
  })
  
  
  
  
  
  function saveSaleAndRedirect(path)   {
      return async (req,res)=> {
          let sale = req.sale
          sale._id = req.body._id
          sale.salesnumber = req.body.salesnumber
          sale.salesdescription = req.body.salesdescription
          sale.salesproduct = req.body.salesproduct
          sale.salesquantity = req.body.salesquantity
          sale.priceperunit = req.body.salespriceperunit
          sale.salespayment = req.body.salespayment
          try{
              sales = await sale.save()
              res.redirect(`/sale/${sale.id}`)
          } catch(e)  {
          res.render(`/sale/${path}`, { sales: sale})
          }
      }
  }

//Returns

app.get('/return', async (req,res) =>{
    const balik = await BalikO.find().sort({ createdAt: 'desc'})
      res.render('return/returns_index', { baliks: balik})
  })
  
  app.get('./return/new', function(req,res){
      res.render('return/returns_new');
  });
  
  app.get('/return/new',(req,res)=>{
      res.render('return/returns_new', {balik: new Balik() })
  })
  
  app.get('/return/:id', async (req,res)=>{
      const balik = await Balik.findById(req.params.id)
      if (balik == null) res.redirect('/return')
      res.render('return/returns_show', { balik: balik})
  })
  
  app.get('/return/edit/:id', async (req,res)=>{
      const balik = await Balik.findById(req.params.id)
      if (balik == null) res.redirect('/return')
      res.render('return/returns_edit', { balik: balik})
  })
  
  app.post('/return/new', async (req, res, next)=>{
      req.balik = new Balik()
      next()
  }, saveReturnAndRedirect('new'))
  
  
  
  app.put('/return/:id', async (req, res, next)=>{
      req.balik = await Balik.findById(req.params.id)
      next()
  }, saveReturnAndRedirect('edit'))
  
  
  app.delete('/return/:id', async (req,res)=>{
      await Balik.findByIdAndDelete(req.params.id)
      res.redirect('/return')
  })
  
  
  
  
  
  function saveReturnAndRedirect(path)   {
      return async (req,res)=> {
          let balik = req.balik
          balik._id = req.body._id
          balik.balikproduct = req.body.balikproduct
          balik.balikreason = req.body.balikreason
          balik.balikdatetogorush = req.body.balikdatetogorush
          balik.balikreasondatetoorgin = req.body.balikdatetoorgin
          try{
              returns = await balik.save()
              res.redirect(`/return/${balik.id}`)
          } catch(e)  {
          res.render(`/return/${path}`, { baliks: balik})
          }
      }
  }


//User view

app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user == null) res.redirect('/')
    res.render('userprofile', { user: user })
    
  })



//

app.get('/test', (req,res)=>{
    res.render('sale/test');
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});