const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require("bcryptjs")
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {SENDGRID_API,EMAIL} = require('../config/keys')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.get('/protected', requireLogin,(req, res) => {
    res.send("Salom bizning foydalanuvchi!")
})

router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body;
    if (!email || !name || !password) {
        return res.status(422).json({ error: "Iltimos barcha bo'limlarni to'ldiring!" })
    }

    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "BU email bilan ro'yxatdan o'tilgan!" })
            }
            bcrypt.hash(password, 15)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic:pic
                    })
                    user.save()
                        .then(user => {
                            transporter.sendMail({
                                to:user.email,
                                from:"abdumajidrashidov44@gmail.com",
                                subject:"signup success",
                                html:"<h1>Xush kelibsiz Munozara saytiga</h1>"
                            })
                            res.json({ message: "Ma'lumotlar muvaffaqqiyatli saqlandi!" })
                            
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })


        }).catch(err => { console.log(err) })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(422).json({ error: "Iltimos email yoki parolni kiriting!" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                res.status(422).json({ error: "Email yoki parol noto'g'ri!" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMath => {
                    if (doMath) {
                        //res.json({ message: "Successfully singed in!" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const {_id,name,email,followers,following,pic} = savedUser
                        res.json({ token, user: { _id, name, email, followers, following ,pic} })
                    } else {
                        res.status(422).json({ error: "Noto'g'ri parol!" })
                    }
                }).catch(err => {
                    console.log(err)
                })
        })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"Foydalanuvchi ushbu email bilan ro'yxatdan o'tmagan!"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"abdumajidrashidov44@gmail.com",
                    subject:"Yangi parol",
                    html:`
                    <p>Sizning pzrolingiz qayta tiklandi</p>
                    <h4>UShbu <a href="${EMAIL}/reset/${token}">havolani bosing</a> va davom eting</h4>
                    `
                })
                res.json({message:"email pochtangizni tekshiring!"})
            })
        })
    })
})

router.post('/newpassword',(req,res)=>{
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken, expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"qayta urinib ko'ring!"})
        }
        bcrypt.hash(newpassword,12).then(hashedpassword=>{
            user.password= hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save((saveduser=>{
                res.json({message:"parol muvaffaqiyatli o'zgartirildi"})
            }))
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports = router