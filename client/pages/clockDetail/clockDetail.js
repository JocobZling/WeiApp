var config = require('../../config.js');
const token = wx.getStorageSync('token');
var util = require('../../utils/util');
var date = util.formatTime(new Date());
Page({
    data: {
        item: [],
        today: false,
        exist: true,
        id: 0
    },
    onLoad: function (options) {
        let that = this;
        console.log(options.id);
        console.log(options.exist);
        console.log(date);
        if (options.exist === "1") {
            wx.request({
                url: `${config.service.host}/clockItem?id=${options.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    let day = clock.user[0].date.split(",").length;
                    let today = false;
                    console.log(day);
                    console.log(clock);
                    console.log(clock.user[0].date.toString());
                    if (clock.user[0].date.toString().indexOf(date) !== -1) {
                        today = true;
                    } else {
                        today = false;
                    }
                    clock.user[0].day = day;
                    console.log(today);
                    that.setData({
                        item: clock,
                        today: today,
                        id: options.id,
                    })
                }
            })
        } else {
            //没有参与
            wx.request({
                url: `${config.service.host}/clockItem?id=${options.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    that.setData({
                        item: clock,
                        exist: false,
                        today: false,
                        id: options.id,
                    })
                }
            })
        }

    },
    join: function () {
        let that = this;
        console.log(that.data.id);
        wx.showModal({
            title: '提示',
            content: '确定要加入打卡吗？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: `${config.service.host}/joinClock?id=${that.data.id}&date=${date}`,
                        header: {
                            'Authorization': token,
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            let clock = res.data.clock;
                            console.log(clock);
                            clock.user.push({day:"1"});
                            that.setData({
                                item: clock,
                                exist: true,
                                today: true,
                            })
                        }
                    })
                } else if (res.cancel) {

                }
            }
        })
    },
    check: function () {
        let that = this;
        wx.request({
            url: `${config.service.host}/checkClock?id=${that.data.id}&date=${date}`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let clock = res.data.clock;
                let day = clock.user[0].date.split(",").length;
                clock.user[0].day = day+1;
                that.setData({
                    item: clock,
                    exist: true,
                    today: true
                })
            }

        })
    },
    onShareAppMessage: function () {

    }
});