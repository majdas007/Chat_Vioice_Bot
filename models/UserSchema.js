var mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema
(
    {
            FirstName : { type : String , required : true},
            LastName  : { type : String , required: true},
            Email     : { type : String , required : true},
            Adress    : [
                {
                    Number : { type : Number , required : true},
                    Street : { type : String , required : true},
                    City : { type : String , required : true},
                    Country : { type : String , required : true},
                    Postal_code : { type : String , required : true},
                    Longitude : { type : Number , required : false},
                    Latitude : { type : Number , required : false},

                }
            ],

           /* Phone    : { type : Number , required : true},*/
            Is_Admin : { type : Boolean , required : false , default: false}

    }
)
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema)