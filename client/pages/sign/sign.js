var util = require('../../utils/util.js');
var config = require('../../config.js');

Page({
    data: {
        sign:[],
        time:"",
    },
    onLoad: function (options) {
        var that=this;
        var time = util.formatTime(new Date());
        this.setData({
            time: time,
        });
    },
    send:function (e) {
      console.log(e.detail.value);
        this.getSign(e.detail.value);
    },
    getSign:function (sign) {
        let url=`${config.service.host}/sign?sign=${sign}`;
        let that=this;
        const token = wx.getStorageSync('token');
        wx.request({
            url:url,
            header:{
                'Authorization':`${token}`,
                'content-type': 'application/json'
            },
            success:function (res) {
                console.log(res);
                that.setData({
                    sign:res.data.info
                })
            }
        })
    }
});