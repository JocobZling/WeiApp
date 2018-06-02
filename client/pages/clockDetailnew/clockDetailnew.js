// pages/clockDetailnew/clockDetailnew.js
var config = require('../../config.js');
const token = wx.getStorageSync('token');
var util = require('../../utils/util');
var date = util.formatTime(new Date());
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hideText: true,
        hideClass: "up",
        item: [],
        today: false,
        exist: true,
        id: 0,
        info:""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        });
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
                    console.log(res.data.clock);
                }
            })
        } else {
            wx.request({
                url: `${config.service.host}/clockItem?id=${options.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    let info="";
                    console.log(clock);
                    for(let item of clock.clockDetail){
                        if(item.date===date){
                            info=item.info;
                        }
                    }
                    that.setData({
                        item: clock,
                        exist: false,
                        today: false,
                        info:info,
                        id: options.id
                    })
                }
            })
        }
    },
    toggleText() {
        let hideText = this.data.hideText,
            hideClass = this.data.hideClass == 'up' ? 'down' : 'up';
        this.setData({
            hideText: !hideText,
            hideClass: hideClass
        })
    },
    jumpToclockSignInfor: function () {
        wx.navigateTo({
            url: '../clockSignInfor/clockSignInfor',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})