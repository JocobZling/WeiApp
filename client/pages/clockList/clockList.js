var config = require('../../config.js');
const token = wx.getStorageSync('token');
Page({
    data: {
        list: []
    },
    onLoad: function (options) {
        let that = this;
        wx.request({
            url: `${config.service.host}/clockList`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let clock = res.data.clock;
                let exist = res.data.exist;
                console.log(exist);
                for (let i = 0; i < exist.length; i++) {
                    if (exist[i] === 1) {
                        clock[i].exist = 1;
                    } else if(exist[i] === 2){
                        clock[i].exist= 2;
                    }else{
                        clock[i].exist= 3;
                    }
                }
                console.log(clock);
                that.setData({
                    list: clock,
                    exist: exist
                })
            }
        });
    }
});