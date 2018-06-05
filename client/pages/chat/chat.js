
var config = require('../../config.js');
const token = wx.getStorageSync('token');


Page({
  data: {
    msgList: [],
    scrollTop: 0,
    inputValue:"",
    viewHeight:0,
    viewWidth:0,
    keyboard:false,
    j:1,               //录音帧
    isSpeaking: false, //是否正在说话
    outputTxt: "",     //输出识别结果
  },
  switchInputType: function () {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },
  onLoad: function (options) {
    this.setData({
      viewHeight: wx.getSystemInfoSync().windowHeight - 115,
      viewWidth: wx.getSystemInfoSync().windowHeight - 100,
    })  

  },

  touchdown: function () {
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
  },
  touchup: function () {
    this.setData({
      isSpeaking: false,
    })
  },




  send: function (e) {
    console.log(e.detail.value.msg);
    var msg = { "type": 0, "msg": e.detail.value.msg };
    var msgList = this.data.msgList;
    msgList.push(msg);
    this.setData({
      msgList: msgList
    });
    this.getReply(e.detail.value.msg);
    this.setData({
      inputValue:""
    })
  },
  getImg: function () {

  },
  getReply: function (sendMsg) {
    console.log(sendMsg);
    var that = this;//获取数据
    var url = `${config.service.host}/robot?info=${sendMsg}`;
    wx.request({
      url: url,
      header: {
        'Authorization': token,
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var msg = {};
        var msgList = that.data.msgList;
        if (res.data.info.code === 100000) {
          msg = { "type": 1, "msg": res.data.info.text, "code": res.data.info.code };
          msgList.push(msg);
          that.setData({
            msgList: msgList
          });
          that.setData({
            scrollTop: that.data.scrollTop + 100
          })
        } else if (res.data.info.code === 200000) {
          msg = {
            "type": 1,
            "msg": res.data.info.text,
            "url": res.data.info.toString(),
            "code": res.data.info.code
          };
          msgList.push(msg);
          that.setData({
            msgList: msgList
          });
          that.setData({
            scrollTop: that.data.scrollTop + 200
          })

        } else if (res.data.info.code === 302000 || res.data.info.code === 308000) {
          msg = {
            "type": 1,
            "msg": res.data.info.text,
            "list": res.data.info.list,
            "code": res.data.info.code
          };
          msgList.push(msg);
          that.setData({
            msgList: msgList
          });
          that.setData({
            scrollTop: that.data.scrollTop + 400
          })
        }
        console.log(that.data.scrollTop);
      }
    })

  }
})

//麦克风帧动画 
function speaking() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 300);
}
