var config = require('../../config.js');
var util = require('../../utils/util.js');

Page({
    data: {
        selectedAll: false,//记录全选
        scrollTop: 0,
        imagePosition: []

    },
    onLoad: function () {
        let that = this;
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${config.service.host}/study`,
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {
                //console.log(res.data);
                let imagePosition=res.data.images;
                console.log(imagePosition);
                that.setData({
                    imagePosition:imagePosition
                })
            }
        });
        wx.getUserInfo({
            success: function (res) {
                that.setData({
                    thumb: res.userInfo.avatarUrl,
                    nickname: res.userInfo.nickName
                })
            }
        })
    },
    bindCheckbox: function (e) {
        let index = parseInt(e.target.dataset.index);
        let check = this.data.imagePosition[index].check;
        let imagePosition = this.data.imagePosition;
        imagePosition[index].check = !check;
        console.log(imagePosition);
        this.setData({
            imagePosition: imagePosition
        });
    },
    Delete: function () {
        let imagePosition = this.data.imagePosition;
        let arr = [];
        let deleteId=[];
        for (let i = 0; i < imagePosition.length; i++) {
            if (imagePosition[i].check !==true) {
                arr.push(imagePosition[i]);
            }else{
                deleteId.push(imagePosition[i].id);
            }
        }
        const token = wx.getStorageSync('token');
        wx.request({
            url: `${config.service.host}/deleteStudyItems?id=${deleteId}`,
            
            header: {
                'Authorization': token,
                'content-type': 'application/json'
            },
            success: function (res) {

            }
        });
        console.log(arr);
        this.setData({
            imagePosition: arr,
        })

    }

});