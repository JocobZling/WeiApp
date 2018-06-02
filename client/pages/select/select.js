Page({
    data:{
      viewHeight: 0
    },
    onLoad: function (options) {
      this.setData({
        viewHeight: wx.getSystemInfoSync().windowHeight-100
      })
    },
});
