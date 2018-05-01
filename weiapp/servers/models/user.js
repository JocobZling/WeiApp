const mongoose = require("mongoose");
//映射
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        openid: String,
        images: {type: Array},
        clocks:[{
            id:String,
            name:String,
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