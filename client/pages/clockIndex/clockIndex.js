var config = require('../../config.js');
Page({
    data: {
        imgUrls: [
            '/images/lunbo1.jpg',
            '/images/lunbo2.jpg',
            '/images/lunbo3.png'
        ],
        indicatorDots: false,
        autoplay: false,
        interval: 3000,
        duration: 800,
        list: []
    },
    onLoad: function () {
        let that = this;
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${config.service.host}/myClock`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let clocks = res.data.clocks;
                console.log(clocks);
                that.setData({
                    list: clocks,
                })
            }
        });
    },
    join: function () {
        wx.navigateTo({
            url: `../clockList/clockList`
        })
    },
    create: function () {
        wx.showToast({
            title: '功能正在开发ing',
            icon: 'none',
            duration: 2000
        })
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading() ;//在标题栏中显示加载
        let that = this;
        const token = wx.getStorageSync('token');
        wx.request({
          url: `${config.service.host}/myClock`,
          header: {
            'Authorization': token,
            'content-type': 'application/json'
          },
          success: function (res) {
            let clocks = res.data.clocks;
            console.log(clocks);
            that.setData({
              list: clocks,
            })
          }
        });
        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
})