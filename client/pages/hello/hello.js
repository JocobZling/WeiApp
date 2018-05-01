var app = getApp();
Page({
    data: {
        userInfo: {}
    },
    goToSelect: function () {
        wx.switchTab({
            url: '../select/select'
        })
    },
    onLoad: function () {
        var that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            console.log(userInfo);
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
    }
})