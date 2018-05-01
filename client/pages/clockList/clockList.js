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
                    } else {
                        clock[i].exist= 2;
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