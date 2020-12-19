const mongoose = require('mongoose')

var loginschema = new mongoose.Schema({
   
    username :{
        type: String,
        required : true,
        trim: true,
        unique: true
    },
    password :{
        type : String,
        required : true,        
    },
},{collection : 'logins'})



var logindb = mongoose.model('logins',loginschema);
module.exports = logindb;