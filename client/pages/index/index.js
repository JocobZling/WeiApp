var config = require('../../config.js');
const token = wx.getStorageSync('token');
Page({
    data: {
        studyList:[],
        clockList:[],
        thumb:'',
        nickname:'',
        orders:[],
        hasAddress:false,
        address:{}
    },
    onLoad:function () {
        let that=this;
        wx.request({
            url:`${config.service.host}/me`,
            header:{
                'Authorization': token,
                'content-type': 'application/json'
            },
            success:function (res) {
                console.log(res.data);
            }
        });
        wx.getUserInfo({
            success: function(res){
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        })
    },
    study:function(){
        wx.showToast({
            title: '功能在开发ing',
            icon: 'loading',
            duration: 2000
        })
    }
});