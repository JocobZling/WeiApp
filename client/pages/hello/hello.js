var config = require('../../config.js');
const token = wx.getStorageSync('token');
Page({
    data: {
        userInfo: {},
    },
    goToSelect: function () {
        wx.switchTab({
            url: '../select/select'
        })
    },
    onLoad: function () {
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    userInfo: res.userInfo,
                })
            }
        });
    },
    onGotUserInfo: function (e) {
        let that = this;
        console.log(e.detail.userInfo);
        that.setData({
            thumb: e.detail.userInfo.avatarUrl,
            nickname: e.detail.userInfo.nickName
        });
        wx.login({
            success: function (res) {
                console.log(res);
                let code = res.code;
                if (code) {
                    console.log('获取用户登录凭证：' + code);
                    wx.request({
                        url: `${config.service.host}/wx/onlogin`,
                        data: {
                            code: code,
                            thumb: e.detail.userInfo.avatarUrl,
                            nickname: e.detail.userInfo.nickName
                        },
                        success: function (res) {
                            console.log(res.data.token);
                            wx.setStorageSync('token', res.data.token);
                        }
                    });
                    wx.switchTab({
                        url: '../select/select'
                    })
                } else {
                    console.log('获取用户登录态失败：' + res.errMsg);
                }
            }
        })
    },
})