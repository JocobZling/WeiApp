const mongoose = require("mongoose");
//映射
const Schema = mongoose.Schema;
const ClockSchema = new Schema(
    {
        id: {type: Number},
        createDate:{type:String},
        name:{type:String},
        owner:{type:String},
        images: {type: String},
        detail:{type:String},
        user:[{
            openid:String,
            joinDate:String
        }]
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model('Clocks', ClockSchema);