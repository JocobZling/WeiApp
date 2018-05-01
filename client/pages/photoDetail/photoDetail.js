const config = require('../../config');
const token = wx.getStorageSync('token');
const ctx = wx.createCanvasContext('myCanvas');
var screenWidth = 0;
var screenHeight = 0;
var pixelRatio = 0; //设备像素比
Page({
    data: {
        system: []
    },
    onLoad: function (options) {
        console.log(options.position);
        let that = this;
        try {
            var res = wx.getSystemInfoSync();
            screenWidth = res.windowWidth;
            screenHeight = res.windowHeight;
            pixelRatio = res.pixelRatio;
            console.log(pixelRatio);
            console.log(res.windowWidth);
            console.log(res.windowHeight);
        } catch (e) {
            console.log(e);
        }
        let system = [];
        system.push({height: res.windowHeight * pixelRatio, width: res.windowWidth * pixelRatio});
        that.setData({
            system: system
        });
        wx.showLoading({
            title: '稍等哈！',
        });
        wx.downloadFile({
            url: `${config.service.host}/${options.position.toString()}`,
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                that.setData({
                    tempFilePath: tempFilePath
                });
                //获取图片大小的信息
                wx.getImageInfo({
                    src: res.tempFilePath,
                    success: function (res) {
                        console.log(res.width);
                        console.log(res.height);
                        let imageHeight = 0;
                        if (res.height > 1206 / pixelRatio) {
                            imageHeight = 0;
                            ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth, 1206 / pixelRatio);
                            ctx.draw();
                        } else {
                            imageHeight = (1206 / pixelRatio - res.height) / 2;
                            ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth, res.height);
                            ctx.draw();
                        }
                    }
                });
            },
        });
        //画相框
       /* wx.downloadFile({
            url: `${config.service.host}/photoBackgroud.png`,
            success: function (res) {
                let tempFilePath = res.tempFilePath;
                that.setData({
                    tempFilePath: tempFilePath
                });
                //获取图片大小的信息
                wx.getImageInfo({
                    src: res.tempFilePath,
                    success: function (res) {
                        console.log(res.width);
                        console.log(res.height);
                        let imageHeight = 0;
                        if (res.height > 1206 / pixelRatio) {
                            imageHeight = 0;
                            ctx.save();
                            ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth, 1206 / pixelRatio);
                            ctx.draw();
                            ctx.restore()
                        } else {
                            imageHeight = (1206 / pixelRatio - res.height) / 2;
                            ctx.save();
                            ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth, res.height);
                            ctx.draw();
                            ctx.restore()
                        }
                    }
                });
            }
        });*/
        setTimeout(function () {
            wx.hideLoading()
        }, 2000)
    },
    onShareAppMessage: function () {
    }
});

