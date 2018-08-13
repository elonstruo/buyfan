// pages/user/user.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		if (app.globalData.userInfo) {
			console.log("user.app.globalData.userInfo")
			console.log(app.globalData.userInfo)
			var avatarUrl = app.globalData.userInfo.data.avatarUrl;
			var nickName = app.globalData.userInfo.data.nickName;
			that.setData({
				userInfo: app.globalData.userInfo,
				avatarUrl: avatarUrl,
				nickName: nickName
			})
		} else if (that.data.canIUse) {
			var avatarUrl = app.globalData.userInfo.data.avatarUrl;
			var nickName = app.globalData.userInfo.data.nickName;
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				console.log('userInfoReadyCallback.res')
				console.log(res)
				that.setData({
					userInfo: res.userInfo,
					userInfo: app.globalData.userInfo,
					avatarUrl: avatarUrl,
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					console.log('在没有 open-type=getUserInfo 版本的兼容处理res')
					console.log(res)
					app.globalData.userInfo = res.userInfo;
					var avatarUrl = app.globalData.userInfo.avatarUrl;
					var nickName = app.globalData.userInfo.nickName;
					that.setData({
						userInfo: res.userInfo,
						userInfo: app.globalData.userInfo,
						avatarUrl: avatarUrl,
					})
				}
			})
		}
    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
	toAddress: function () {
		wx.navigateTo({
			url: '../../pages/address/address',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
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