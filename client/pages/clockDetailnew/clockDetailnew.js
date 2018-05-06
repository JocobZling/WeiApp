// pages/clockDetailnew/clockDetailnew.js
var app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hideText: true,
    hideClass: "up",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })
  },
 toggleText() {
    let hideText = this.data.hideText,
    hideClass = this.data.hideClass == 'up' ? 'down' : 'up';
    this.setData({
      hideText: !hideText,
      hideClass: hideClass
    })
  },
  jumpToclockSignInfor:function(){
    wx.navigateTo({
      url: '../clockSignInfor/clockSignInfor',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})