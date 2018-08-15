// pages/vip/vip.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		isVIPNo: true,
		isVIPYes: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// 充值内容
		if (app.globalData.actionData) {
			console.log(app.globalData.actionData)
			var actionData = app.globalData.actionData;
			that.setData({
				rights: actionData.member.rights,
				charge: actionData.member.charge.price,
				recharge: actionData.member.recharge,
			})
		} 
		
		if (app.globalData.userInfo) {
			console.log("user.app.globalData.userInfo")
			console.log(app.globalData.userInfo)
			var member = app.globalData.userInfo.data.member;
			that.setData({
				member: member,
			})
		} else if (that.data.canIUse) {
			var member = app.globalData.userInfo.data.member;
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				console.log('userInfoReadyCallback.res')
				console.log(res)
				that.setData({
					member: member,
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					console.log('在没有 open-type=getUserInfo 版本的兼容处理res')
					console.log(res)
					app.globalData.userInfo = res.userInfo;
					var member = app.globalData.userInfo.data.member;
					that.setData({
						member: member,
					})
				}
			})
		}
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})