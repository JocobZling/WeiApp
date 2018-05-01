var config = require('../../config.js');
var util = require('../../utils/util.js');

const token = wx.getStorageSync('token');
Page({
  data: {
    selectedAll: false,//记录全选
    scrollTop:0,
    imagePosition: [{ image: "../../images/clock.png", check: false }, { image: "../../images/line3.png", check: false }, { image: "../../images/logo1.png", check:false } ,{ image: "../../images/line.png",check:false }],
    imagePosition2:[]

  },
  onLoad: function () {

    //死时间
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      time: time
      })


    let that = this;
    wx.request({
      url: `${config.service.host}/me`,
      header: {
        'Authorization': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        var key = "check";
        var value = false;
        for (let item of data.images) {
          item[key] = value;
        }
        console.log(data);
        that.setData({
          imagePosition: data.images
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
    this.setData({
      imagePosition: imagePosition
    });
  },
Delete:function(){
  let imagePosition = this.data.imagePosition;
  let arr=[];
  console.log(imagePosition);
  for(let i=0;i<imagePosition.length;i++){
    if(imagePosition[i].check==false)
    {
      arr.push(imagePosition[i]);
    }
  }
  console.log(arr);
  this.setData({
    imagePosition:arr,
  })

}

});