const config = require('../../config');
const token = wx.getStorageSync('token');
const ctx = wx.createCanvasContext('myCanvas');
var screenWidth = 0;
var screenHeight = 0;
var pixelRatio = 0; //设备像素比
var canvasHeight = 0;
var canvasWidth = 0;
var canvasScale = 0;  //画板宽高比
Page({
    data: {
        picture: {},
        isPopping1: false,   //是否已经弹出
        isPopping2: false,   //是否已经弹出
        animPlus1: {},        //旋转动画
        animBlack1: {},       //item位移,透明度
        animRed1: {},         //item位移,透明度
        animYellow1: {},      //item位移,透明度
        animPlus2: {},        //旋转动画
        animBlack2: {},       //item位移,透明度
        animRed2: {},         //item位移,透明度
        animYellow2: {},      //item位移,透明度
        Paths: '',
        pen: 5,             //画笔粗细默认值
        color: "#000000",   //画笔颜色默认值
        tempFilePath: '',   //图片临时位置
        imageList: [],
        pictureX: 0,
        pictureY: 0,
        pictureWidth: 0,
        pictureHeight: 0,
        viewHeight: 0               //canvas高度
    },
    onLoad: function (params) {
        wx.showLoading({
            title: '加载中',
        });
        canvasHeight = wx.getSystemInfoSync().windowHeight - 130;
        canvasWidth = wx.getSystemInfoSync().windowWidth - 20;
        canvasScale = canvasWidth / canvasHeight;
        console.log("canvasHeight" + canvasHeight);
        this.setData({
            viewHeight: wx.getSystemInfoSync().windowHeight - 130
        })
        let that = this;
        console.log("paramsid" + params.id);
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
                                let imageScale = res.width / res.height;  //图片宽高比
                                let imageHeight = 0;
                                let imageWidth = 0;
                                if (res.height > canvasHeight) {//图片高大于画板高
                                    imageHeight = 0;
                                    imageWidth = (canvasWidth - (canvasHeight * imageScale)) / 2;
                                    ctx.drawImage(tempFilePath, imageWidth, imageHeight, canvasHeight * imageScale, canvasHeight);
                                    ctx.draw();
                                    that.setData({
                                        pictureX: 0,
                                        pictureY: imageHeight,
                                        pictureWidth: canvasHeight * imageScale,
                                        pictureHeight: canvasHeight
                                    });
                                } else {
                                    imageWidth = 0;
                                    imageHeight = (canvasHeight - (canvasWidth / imageScale)) / 2;
                                    ctx.drawImage(tempFilePath, imageWidth, imageHeight, canvasWidth, canvasWidth / imageScale);
                                    ctx.draw();
                                    that.setData({
                                        pictureX: 0,
                                        pictureY: imageHeight,
                                        pictureWidth: canvasWidth,
                                        pictureHeight: canvasWidth / imageScale
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
    penSelect1: function (e) {
        if (this.data.isPopping1) {
            //缩回动画
            popp1.call(this);
            this.setData({
                isPopping1: false
            })
        } else {
            //弹出动画
            takeback1.call(this);
            this.setData({
                isPopping1: true
            })
        }
        console.log(e.currentTarget);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param)
        });
        this.isClear = false;
    },
    penSelect2: function (e) {
        if (this.data.isPopping2) {
            //缩回动画
            popp2.call(this);
            this.setData({
                isPopping2: false
            })
        } else {
            //弹出动画
            takeback2.call(this);
            this.setData({
                isPopping2: true
            })
        }
        console.log(e.currentTarget);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param)
        });
        this.isClear = false;
    },
    black: function (e) {
        console.log(e.currentTarget.dataset.color);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param),
            color: e.currentTarget.dataset.color
        });
        this.isClear = false;
    },
    red: function (e) {
        console.log(e.currentTarget.dataset.color);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param),
            color: e.currentTarget.dataset.color
        });
        this.isClear = false;
    },
    yellow: function (e) {
        console.log(e.currentTarget.dataset.color);
        this.setData({
            pen: parseInt(e.currentTarget.dataset.param),
            color: e.currentTarget.dataset.color
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
                        console.log(res);
                        wx.showToast({
                            title: '保存成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        });

    }
})


function popp1() {
    //plus顺时针旋转
    var animationPlus1 = wx.createAnimation({
        duration: 500,
        timingFunction1: 'ease-out'
    })
    var animationBlack1 = wx.createAnimation({
        duration: 500,
        timingFunction1: 'ease-out'
    })
    var animationRed1 = wx.createAnimation({
        duration: 500,
        timingFunction1: 'ease-out'
    })
    var animationYellow1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    animationPlus1.rotateZ(360).step();
    animationBlack1.translate(-40, -10).rotateZ(180).opacity(1).step();
    animationRed1.translate(0, -10).rotateZ(180).opacity(1).step();
    animationYellow1.translate(40, -10).rotateZ(180).opacity(1).step();
    this.setData({
        animationPlus1: animationPlus1.export(),
        animationBlack1: animationBlack1.export(),
        animationRed1: animationRed1.export(),
        animationYellow1: animationYellow1.export(),
    })
}

//收回动画
function takeback1() {
    //plus逆时针旋转
    var animationPlus1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationBlack1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationRed1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationYellow1 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    animationPlus1.rotateZ(0).step();
    animationBlack1.translate(0, 0).rotateZ(0).opacity(0).step();
    animationRed1.translate(0, 0).rotateZ(0).opacity(0).step();
    animationYellow1.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
        animationPlus1: animationPlus1.export(),
        animationBlack1: animationBlack1.export(),
        animationRed1: animationRed1.export(),
        animationYellow1: animationYellow1.export(),
    })
}


//弹出动画
function popp2() {
    //plus顺时针旋转
    var animationPlus2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationBlack2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationRed2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationYellow2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    animationPlus2.rotateZ(360).step();
    animationBlack2.translate(10, -10).rotateZ(180).opacity(1).step();
    animationRed2.translate(50, -10).rotateZ(180).opacity(1).step();
    animationYellow2.translate(90, -10).rotateZ(180).opacity(1).step();
    this.setData({
        animationPlus2: animationPlus2.export(),
        animationBlack2: animationBlack2.export(),
        animationRed2: animationRed2.export(),
        animationYellow2: animationYellow2.export(),
    })
}

//收回动画
function takeback2() {
    //plus逆时针旋转
    var animationPlus2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationBlack2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationRed2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    var animationYellow2 = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
    })
    animationPlus2.rotateZ(0).step();
    animationBlack2.translate(0, 0).rotateZ(0).opacity(0).step();
    animationRed2.translate(0, 0).rotateZ(0).opacity(0).step();
    animationYellow2.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
        animationPlus2: animationPlus2.export(),
        animationBlack2: animationBlack2.export(),
        animationRed2: animationRed2.export(),
        animationYellow2: animationYellow2.export(),
    })
}

