var config = require('../../config.js');

Page({
    data: {
        tempFilePaths: '',
        imagePosition: []
    },
    onLoad: function (options) {
        let that = this;
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${config.service.host}/study`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let data = res.data;
                console.log(data.images);
                var key = "check";
                var value = "0" 
                for(let item of data.images){
                  item[key]=value;
                }
                console.log(data);
                that.setData({
                    imagePosition: data.images
                })
            }
        })
    },
    //选择图片并且上传图片到服务器
    chooseimage: function () {
        var that = this;
        const token = wx.getStorageSync('token');
        wx.chooseImage({
            count: 1,
            //original原图，compressed压缩图
            sizeType: ['original', 'compressed'],
            //album来源相册 camera相机
            sourceType: ['album', 'camera'],
            //成功时会回调
            success: function (res) {
                //重绘视图
                that.setData({
                    tempFilePaths: res.tempFilePaths[0]
                });
                wx.uploadFile({
                    url: `${config.service.host}/study/upload`, //开发者服务器的 url
                    filePath: res.tempFilePaths[0].toString(), // 要上传文件资源的路径 String类型！！！
                    name: 'file', // 文件对应的 key ,(后台接口规定的关于图片的请求参数)
                    header: {
                        'Authorization': token,
                        'content-type': 'multipart/form-data'
                    },
                    formData: {},
                    success: function (res) {
                        let id = res.data.split(":")[1].split("")[0];
                        console.log(res.data.split(":")[1].split("")[0]);
                        wx.navigateTo({
                            url: `../studyDetail/studyDetail?id=${id}`
                        })
                    },
                    fail: function (res) {
                    }
                })
            }
        });
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading() ;//在标题栏中显示加载
        let that = this;
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${config.service.host}/study`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let data = res.data;
                console.log(data);
                that.setData({
                    imagePosition: data.images
                })
            }
        })
        //模拟加载
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
    },
});