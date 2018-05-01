//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);
    },
    getUserInfo:function(cb){
        var that = this;
        if(this.globalData.userInfo){
            typeof cb == "function" && cb(this.globalData.userInfo);
        }else{
            //调用登录接口
            wx.login({
                success: function (res) {
                    console.log(res);
                    var code = res.code;
                    if (code) {
                        console.log('获取用户登录凭证：' + code);
                        wx.request({
                            url: `${config.service.host}/wx/onlogin`,
                            data: { code: code },
                            success:function(res){
                              console.log(res.data.token);
                              wx.setStorageSync('token', res.data.token);
                            }
                        })
                    } else {
                        console.log('获取用户登录态失败：' + res.errMsg);
                    }
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res);
                            that.globalData.userInfo = res.userInfo;
                            typeof cb == "function" && cb(that.globalData.userInfo);
                        }
                    })
                }
            })
        }
    },
    globalData:{
        userInfo:null
    }
})