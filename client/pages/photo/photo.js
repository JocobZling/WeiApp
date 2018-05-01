var screenWidth = 0;
var screenHeight = 0;
var pixelRatio = 0;
var config = require('../../config.js');
const token = wx.getStorageSync('token');
Page({
    data: {
        system: [],
        tempFilePaths: ''
    },
    onLoad: function (params) {
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
        system.push({height: res.windowHeight, width: res.windowWidth});
        that.setData({
            system: system
        })
    },
    choose: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                that.setData({
                    tempFilePaths: res.tempFilePaths[0]
                });
                wx.uploadFile({
                    url: `${config.service.host}/photo/upload`,
                    filePath: res.tempFilePaths[0].toString(),
                    name: 'file',
                    header: {
                        'Authorization': token,
                        'content-type': 'multipart/form-data'
                    },
                    formData: {},
                    success: function (res) {
                        console.log(res.data.split(':"')[1].split('"}')[0]);
                        //console.log(position);
                        wx.navigateTo({
                            url: `../photoDetail/photoDetail?position=${res.data.split(':"')[1].split('"}')[0]}`
                        })
                    },
                    fail: function (res) {
                    }
                })
            }
        });
    },
});