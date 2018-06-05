// pages/clockSignInfor/clockSignInfor.js
var config = require('../../config.js');
const token = wx.getStorageSync('token');
var util = require('../../utils/util');
Page({
    data: {
        id: 0,
    },
    onLoad: function (options) {
        let that = this;
        that.setData({
            id: options.id
        })
    },
    save: function (e) {
        let that = this;
        console.log(e.detail.value.textarea);
        let info = e.detail.value.textarea;
        wx.request({
            url: `${config.service.host}/checkClock?info=${info}&id=${that.data.id}`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                wx.navigateTo({
                    url: `../clockDetailnew/clockDetailnew?id=${that.data.id}&exist=1`,
                })
            }
        });
    }
})