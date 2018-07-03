// pages/clockDetailnew/clockDetailnew.js
var config = require('../../config.js');
var util = require('../../utils/util');
var date = util.formatTime(new Date());
Page({
    data: {
        hideText: true,
        hideClass: "up",
        item: [],
        exist: true,
        today:false,
        id: 0,
        info: "",
        flag:true,
        count:0,
        user:[],
        optionExist:""
    },
    onLoad: function (options) {
        const token = wx.getStorageSync('token');
        let that = this;
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        });
        if (options.exist === "1") {
            wx.request({
                url: `${config.service.host}/clockItem?id=${options.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    let user = res.data.user;
                    console.log(user);
                    let info = "";
                    let count=Math.floor((clock[0].lastDay)/(clock[0].sumDay)*100);
                    console.log(clock);
                    for (let item of clock[0].clockDetail) {
                        if (item.date === date) {
                            info = item.info;
                        }
                    }
                    //判断是否过期
                    if(clock[0].sumDay===clock[0].lastDay){
                        count=100;
                        that.setData({
                          flag:false
                        })
                    }
                    that.setData({
                        item: clock[0],
                        exist: true,
                        info: info,
                        id: options.id,
                        today:res.data.flag,
                        count:count,
                        user:user,
                        optionExist:options.exist
                    })
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
                    let user = res.data.user;
                    console.log(user);
                    let info = "";
                    let count=Math.floor((clock[0].lastDay)/(clock[0].sumDay)*100);
                    console.log(clock);
                    for (let item of clock[0].clockDetail) {
                        if (item.date === date) {
                            info = item.info;
                        }
                    }
                    //判断是否过期
                    if(clock[0].sumDay===clock[0].lastDay){
                        count=100;
                        that.setData({
                            flag:false
                        })
                    }
                    that.setData({
                        item: clock[0],
                        exist: false,
                        info: info,
                        id: options.id,
                        today:res.data.flag,
                        count:count,
                        user:user,
                        optionExist:options.exist
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
        let that=this;
        wx.navigateTo({
            url: `../clockSignInfor/clockSignInfor?id=${that.data.item.id}`,
        })
    },
    jumpChooseSign:function(){
        let that=this;
        console.log(that.data.item);
        const token = wx.getStorageSync('token');
        wx.showModal({
            title: '提示',
            content: '确定要加入打卡吗？',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    wx.request({
                        url: `${config.service.host}/joinClock?id=${that.data.item.id}`,
                        header: {
                            'Authorization': token,
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log(res.clock);
                        }
                    });
                    wx.navigateTo({
                        url: `../clockSignInfor/clockSignInfor?id=${that.data.item.id}`,
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        })
    },
    onPullDownRefresh: function (options) {
        wx.showNavigationBarLoading() ;//在标题栏中显示加载
        const token = wx.getStorageSync('token');
        let that = this;
        console.log(that.data.optionExist);
        console.log(that.data.id);
        if (that.data.optionExist === "1") {
            wx.request({
                url: `${config.service.host}/clockItem?id=${that.data.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    let user = res.data.user;
                    let info = "";
                    let count=Math.floor((clock[0].lastDay)/(clock[0].sumDay)*100);
                    for (let item of clock[0].clockDetail) {
                        if (item.date === date) {
                            info = item.info;
                        }
                    }
                    //判断是否过期
                    if(clock[0].sumDay===clock[0].lastDay){
                        count=100;
                        that.setData({
                            flag:false
                        })
                    }
                    that.setData({
                        item: clock[0],
                        exist: true,
                        info: info,
                        today:res.data.flag,
                        count:count,
                        user:user,
                    })
                }
            })
        } else {
            wx.request({
                url: `${config.service.host}/clockItem?id=${that.data.id}`,
                header: {
                    'Authorization': token,
                    'content-type': 'application/json'
                },
                success: function (res) {
                    let clock = res.data.clock;
                    let user = res.data.user;
                    let info = "";
                    let count=Math.floor((clock[0].lastDay)/(clock[0].sumDay)*100);
                    console.log(clock);
                    for (let item of clock[0].clockDetail) {
                        if (item.date === date) {
                            info = item.info;
                        }
                    }
                    //判断是否过期
                    if(clock[0].sumDay===clock[0].lastDay){
                        count=100;
                        that.setData({
                            flag:false
                        })
                    }
                    that.setData({
                        item: clock[0],
                        exist: false,
                        info: info,
                        today:res.data.flag,
                        count:count,
                        user:user,
                    })
                }
            })
        }
        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
})