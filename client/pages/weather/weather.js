var util = require('../../utils/util.js');
Page({
    data: {
        weather:[],
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
        this.getCity(e.detail.value);
    },
    getCity:function (city) {
        var url="https://v.juhe.cn/weather/index";
        var that=this;
        wx.request({
            url:url,
            method:'GET',
            data:{
                'cityname':city,
                'key':'74daa3ec6dbe602c399360c556945064',
            },
            header:{
                'content-type':'json'
            },
            success:function (res) {
                console.log(res.data);
                var result=res.data.result;
                var msg=[{"today":result.today}];
                console.log(msg);
                that.setData({
                    weather:msg
                })
            }
        })
    }
});