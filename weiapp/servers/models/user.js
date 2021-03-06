const mongoose = require("mongoose");
//映射
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        openid: String,
        name:String,
        thumb:String,
        images: [{
            id:Number,
            date:String,
            position:String
        }],
        clocks:[{
            id:Number,
            joinDate:String,
            signInDate:[{
                date:String,
                info:String
            }]
        }],
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('Users', UserSchema);