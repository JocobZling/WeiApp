var config = require('../../config.js');
const token = wx.getStorageSync('token');
Page({
    data: {
        thumb:'',
        nickname:''
    },
    onLoad:function () {
        let that=this;
        wx.getUserInfo({
            success: function(res){
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        })
    }
});