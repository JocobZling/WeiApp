const config = require('../../config');
const token = wx.getStorageSync('token');
const ctx = wx.createCanvasContext('myCanvas');
var screenWidth=0;
var screenHeight=0;
var pixelRatio=0; //设备像素比
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
        color: '#000000',  //画笔颜色默认值
        tempFilePath:'',   //图片临时位置
    },
    onLoad: function (params) {
        wx.showLoading({
            title: '加载中',
        });
        let that = this;
        console.log(params.id);
        //获得手机屏幕信息
        try {
            var res = wx.getSystemInfoSync();
            screenWidth=res.windowWidth;
            screenHeight=res.windowHeight;
            pixelRatio=res.pixelRatio;
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
                let image=res.data.images[0];
                console.log(res.data.images[0]);
                that.setData({
                    picture:image
                });
                wx.downloadFile({
                    url: image.position.toString(),
                    success: function(res) {
                        let tempFilePath=res.tempFilePath;
                        that.setData({
                            tempFilePath:tempFilePath
                        });
                        //获取图片大小的信息
                        wx.getImageInfo({
                            src: res.tempFilePath,
                            success: function (res) {
                                console.log(res.width);
                                console.log(res.height);
                                let imageHeight=0;
                                if(res.height>1050/pixelRatio){
                                    imageHeight=0;
                                    ctx.drawImage(tempFilePath,0,imageHeight,screenWidth-10*2/pixelRatio,1050/pixelRatio);
                                    ctx.draw();
                                }else{
                                    imageHeight=(1050/pixelRatio-res.height)/2;
                                    ctx.drawImage(tempFilePath,0,imageHeight,screenWidth-10*2/pixelRatio,res.height);
                                    ctx.draw();
                                }
                                setTimeout(function(){
                                    wx.hideLoading()
                                },1000);

                            }
                        });
                    }
                });


            }
        })

    },
    //点击弹出
    plus: function () {
        if (this.data.isPopping) {
            //缩回动画
            this.popp();
            this.setData({
                isPopping: false
            })
        } else if (!this.data.isPopping) {
            //弹出动画
            this.takeback();
            this.setData({
                isPopping: true
            })
        }
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
    //弹出动画
    popp: function () {
        //plus顺时针旋转
        var animationPlus = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationcollect = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationTranspond = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        var animationInput = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        })
        animationPlus.rotateZ(180).step();
        animationcollect.translate(-85, 0).rotateZ(180).opacity(1).step();
        animationTranspond.translate(-170, 0).rotateZ(180).opacity(1).step();
        animationInput.translate(-255, 0).rotateZ(180).opacity(1).step();
        this.setData({
            animPlus: animationPlus.export(),
            animCollect: animationcollect.export(),
            animTranspond: animationTranspond.export(),
            animInput: animationInput.export(),
        })
    },
    //收回动画
    takeback: function () {
        //plus逆时针旋转
        var animationPlus = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        });
        var animationcollect = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        });
        var animationTranspond = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        });
        var animationInput = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out'
        });
        animationPlus.rotateZ(0).step();
        animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
        animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
        animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
        this.setData({
            animPlus: animationPlus.export(),
            animCollect: animationcollect.export(),
            animTranspond: animationTranspond.export(),
            animInput: animationInput.export(),
        })
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
            success: function(res) {
               console.log(res)
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
})