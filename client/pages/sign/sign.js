var util = require('../../utils/util.js');
var config = require('../../config.js');
Page({
    data: {
        sign:[],
        time:"",
        viewHeight:0
    },
    onLoad: function (options) {
        var time = util.formatTime(new Date());
        this.setData({
            time: time,
            viewHeight: wx.getSystemInfoSync().windowHeight - 115,
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
                'Authorization': token,
                'content-type': 'application/json'
            },
            success:function (res) {
              console.log(res);
              let data=res.data.info;
              data.all = parseInt(data.all);
              data.health = parseInt(data.health);
              data.love = parseInt(data.love);
              data.money = parseInt(data.money);
              that.setData({
                sign: data
              })
              console.log(data);
            }
        })
    }
});