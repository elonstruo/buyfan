// pages/address/address.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		isAddress: false,
		toAddress: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// app.actionrequest()
		// that.deleteAddress()
		// 地址内容
		if (app.globalData.userInfo) {
			console.log("address.app.globalData.userInfo")
			console.log(app.globalData.userInfo)
			var userInfor = app.globalData.userInfo.data.userInfor;
			if (userInfor) {
				userInfor = JSON.parse(userInfor)
			}
			var uid = app.globalData.userInfo.data.uid;
			var openid = app.globalData.userInfo.data.openid;
			that.setData({
				userInfor: userInfor,
				uid: uid,
				openid: openid
			})

		}
    },
	toAddress: function () {
		var that = this;
		wx.navigateTo({
			url: '../edtiAddress/edtiAddress',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
		// that.setData({
		// 	isAddress: false,
		// 	toAddress: true,
		// })
	},
	edtiAddress: function () {

	},
	deleteAddress: function () {
		var that = this;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
			data: {
				action: 'modifyadr',
				uid: that.data.uid,
				openid: that.data.openid,
				userInfor: []
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: function (res) {
				console.log("personal_info_success");
				console.log(res);
				// wx.showModal({
				// 	title: '提交成功！请等待审核结果',
				// 	content: '返回上一页',
				// 	showCancel: false,
				// 	confirmText: '好的',
				// 	confirmColor: '#333',
				// 	success: function (res) {
				// 		wx.navigateBack({
				// 			delta: 1,
				// 		})
				// 	},
				// 	fail: function (res) { },
				// 	complete: function (res) { },
				// })
			},
			fail: function (res) { },
			complete: function (res) { },
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