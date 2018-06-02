const config = require('../../config');
const token = wx.getStorageSync('token');
const ctx = wx.createCanvasContext('myCanvas');
var screenWidth = 0;
var screenHeight = 0;
var pixelRatio = 0; //设备像素比
Page({
    data: {
        picture: {},
        isPopping: false,    //是否已经弹出
        animPlus: {},        //旋转动画
        animCollect: {},     //item位移,透明度
        animTranspond: {},   //item位移,透明度
        animInput: {},       //item位移,透明度
        Paths: '',
        pen: 5,             //画笔粗细默认值
        color: '#000000',   //画笔颜色默认值
        tempFilePath: '',   //图片临时位置
        imageList: [],
        pictureX:0,
        pictureY:0,
        pictureWidth:0,
        pictureHeight:0,
        viewHeight: 0
    },
    onLoad: function (params) {
        wx.showLoading({
            title: '加载中',
        });
        this.setData({
          viewHeight: wx.getSystemInfoSync().windowHeight - 80
        })  
        let that = this;
        console.log(params.id);
        //获得手机屏幕信息
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
        wx.request({
            url: `${config.service.host}/detail?id=${params.id}`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                let image = res.data.images[0];
                console.log(res.data.images[0]);
                that.setData({
                    picture: image
                });
                wx.downloadFile({
                    url: image.position.toString(),
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
                                if (res.height > 1050 / pixelRatio) {
                                    imageHeight = 0;
                                    ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth - 10 * 2 / pixelRatio, 1050 / pixelRatio);
                                    ctx.draw();
                                    that.setData({
                                        pictureX:0,
                                        pictureY:imageHeight,
                                        pictureWidth:screenWidth - 10 * 2 / pixelRatio,
                                        pictureHeight:1050 / pixelRatio
                                    });
                                } else {
                                    imageHeight = (1050 / pixelRatio - res.height) / 2;
                                    ctx.drawImage(tempFilePath, 0, imageHeight, screenWidth - 10 * 2 / pixelRatio, res.height);
                                    ctx.draw();
                                    that.setData({
                                        pictureX:0,
                                        pictureY:imageHeight,
                                        pictureWidth:screenWidth - 10 * 2 / pixelRatio,
                                        pictureHeight:res.height
                                    });
                                }
                                setTimeout(function () {
                                    wx.hideLoading()
                                }, 1000);

                            }
                        });
                    }
                });


            }
        })

    },
    penSelect: function (e) {
        console.log(e.currentTarget);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param)
        });
        this.isClear = false;
    },
    remove: function () {
        this.isClear = true;
    },
    startX: 0, //保存X坐标轴变量
    startY: 0, //保存X坐标轴变量
    isClear: false, //是否启用橡皮擦标记,ture清除,false未启用
    //手指触摸动作开始
    touchStart: function (e) {
        //得到触摸点的坐标
        this.startX = e.changedTouches[0].x;
        this.startY = e.changedTouches[0].y;
        this.context = wx.createContext();

        if (this.isClear) {
            this.context.setStrokeStyle('#ffffff');  //设置线条样式
            this.context.setLineCap('round'); //设置线条端点的样式
            this.context.setLineJoin('round'); //设置两线相交处的样式
            this.context.setLineWidth(20);//设置线条宽度
            this.context.beginPath();//开始一个路径
            this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);
            this.context.fill();  //填充路径内颜色
        }
        else {
            this.context.setStrokeStyle(this.data.color);
            this.context.setLineWidth(this.data.pen);
            this.context.setLineCap('round');
            this.context.beginPath();
        }
    },
    //手指触摸后移动
    touchMove: function (e) {
        var startX1 = e.changedTouches[0].x;
        var startY1 = e.changedTouches[0].y;
        if (this.isClear) {
            this.context.moveTo(this.startX, this.startY);
            this.context.lineTo(startX1, startY1);  //绘制直线
            this.context.stroke();  //描边已画路径
            this.startX = startX1;
            this.startY = startY1;
        }
        else {
            this.context.moveTo(this.startX, this.startY);
            this.context.lineTo(startX1, startY1);
            this.context.stroke();
            this.startX = startX1;
            this.startY = startY1;
        }
        wx.drawCanvas({
            canvasId: 'myCanvas',
            reserve: true,
            actions: this.context.getActions() // 获取绘图动作数组
        })
    },
    //手指触摸动作结束
    touchEnd: function () {
    },
    //分享
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            console.log(res.target)
        }
        return {
            title: '分享我的背诵页面',
            path: '/pages/studyDetail/studyDetail',
            success: function (res) {
                console.log(res)
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    previewImage: function (e) {
        wx.canvasToTempFilePath({
            x: this.data.pictureX,
            y: this.data.pictureY,
            width: this.data.pictureWidth,
            height: this.data.pictureHeight,
            destWidth: this.data.pictureWidth,
            destHeight: this.data.pictureHeight,
            canvasId: 'myCanvas',
            success: function (res) {
                console.log(res.tempFilePath);
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {

                    }
                })
            }
        });

    }
})
