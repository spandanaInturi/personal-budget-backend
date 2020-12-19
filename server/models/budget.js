const mongoose = require('mongoose');


const budget_Schema = mongoose.Schema({

    username :{
        type: String,
        trim: true,
        
    },
    title :{
        type: String,
        required : true,
        trim: true,
        
        
    },
    budget :{
        type : Number,
        required : true,        
    },
    maxbudget :{
        type : Number,
        required : true,        
    },
    color:{
        type: String,
        required: true,
        match: [/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Invalid Color']
    }},{collection : 'budget'})

const budget = mongoose.model('budget',budget_Schema);

module.exports = budget;
