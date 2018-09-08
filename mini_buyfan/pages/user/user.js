// pages/user/user.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
	data: {
		// 待处理
		pending: [],
		// 制作配送中
		dealing: [],
		// 已完成
		odone: [],
		// 已退款
		allrefund: [],
		payfinish: [],
		delivery: [],
		finish: [],
		refund: [],
		applyrefund: [],
		applycancel: [],
		cancel: [],
		fail: [],
		adopt: [],
		noaccept: [],
		accept: [],
		unpaid: [],
		orderslist: "",
		hasUserInfo: false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// app.globalData.userInfo
		if (app.globalData.userInfo) {
			// console.log("user.app.globalData.userInfo")
			// console.log(app.globalData.userInfo)
			var avatarUrl = app.globalData.userInfo.data.avatarUrl;
			var nickName = app.globalData.userInfo.data.nickName;
			// var coupons = app.globalData.userInfo.data.coupons;
			// if (coupons == null) {
			// 	coupons = 0
			// } else {
			// 	coupons = coupons.length
			// }
			// var money = app.globalData.userInfo.data.money;
			var integral = app.globalData.userInfo.data.integral;
			that.setData({
				userInfo: app.globalData.userInfo,
				avatarUrl: avatarUrl,
				nickName: nickName,
				// coupons: coupons,
				// money: money,
				integral: integral,
			})
		}
		
		var money = wx.getStorageSync("money");
		that.setData({
			money: money
		})
		var coupons = wx.getStorageSync("coupons");
		if (coupons == null) {
			coupons = 0
		} else {
			coupons = coupons.length
		}
		that.setData({
			coupons: coupons
		})
		
		// actionData
		if (app.globalData.actionData) {
			// console.log("user.app.globalData.actionData")
			// console.log(app.globalData.actionData)
			var appContact = app.globalData.actionData.appContact
			var appRunTime = app.globalData.actionData.appRunTime
			that.setData({
				appContact: appContact,
				appRunTime: appRunTime
			})
		}
		// 个人订单
		that.myOrder()
    },
	// 重新授权
    getUserInfo: function(e) {
		var that = this;
        console.log(e)
		app.isLogined(function (userInfo) {
			console.log('app.isLogined.userInfo')
			console.log(userInfo)
			//更新数据
			var avatarUrl = userInfo.data.avatarUrl;
			var nickName = userInfo.data.nickName;
			var coupons = userInfo.data.coupons;
			if (coupons == null) {
				coupons = 0
			} else {
				coupons = coupons.length
			}
			var money = userInfo.data.money;
			var integral = userInfo.data.integral;
			that.setData({
				userInfo: userInfo,
				avatarUrl: avatarUrl,
				nickName: nickName,
				coupons: coupons,
				money: money,
				integral: integral,
			})
		})
		// 个人订单
		that.myOrder()
    },
	// 收货地址
	toAddress: function () {
		wx.navigateTo({
			url: '../../pages/address/address',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	// 打电话
	call: function () {
		var that = this;
		var appContact = that.data.appContact
		wx.makePhoneCall({
			phoneNumber: appContact+"" //仅为示例，并非真实的电话号码
		})
	},
	// 个人订单
	myOrder: function () {
		var that = this;
		wx.showLoading({
			title: '正在加载',
			mask: true,
		})
		var unpaid = [];
		var delivery = [];
		var finish = [];
		var allrefund = [];
		var dealing = [];
		var odone = [];
		var pending = [];
		wx.getStorage({
			key: 'key',
			success: function (res) {
				var key = res.data
				wx.request({
					url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
					data: {
						action: 'userordershows',
						key: key
					},
					header: { 'Content-Type': 'application/x-www-form-urlencoded' },
					method: 'post',
					dataType: 'json',
					success: function (res) {
						if (res.statusCode == 200) {
							var orderslist = that.data.orderslist;
							orderslist = res.data.data;
							for (var i = 0; i < orderslist.length; i++) {
								// 制作配送中
								if (orderslist[i].orderState == "delivery" || orderslist[i].orderState == "adopt" || orderslist[i].orderState == "accept") {
									dealing.push(orderslist[i])
									that.setData({
										dealing: dealing,
										dealingLen: dealing.length
									}) 
									// 已完成
								} else if (orderslist[i].orderState == "finish" || orderslist[i].orderState == "cancel" || orderslist[i].orderState == "fail" || orderslist[i].orderState == "noaccept") {
									odone.push(orderslist[i])
									that.setData({
										odone: odone,
										odoneLen: odone.length
									})
									// 待处理
								} else if (orderslist[i].orderState == "payfinish" || orderslist[i].orderState == "applyrefund" || orderslist[i].orderState == "applycancel" || orderslist[i].orderState == "unpaid") {
									pending.push(orderslist[i])
									that.setData({
										pending: pending,
										pendingLen: pending.length
									})
									// 已退款
								} else if (orderslist[i].orderState == "refund" || orderslist[i].orderState == "allrefund") {
									allrefund.push(orderslist[i])
									that.setData({
										allrefund: allrefund,
										allrefundLen: allrefund.length
									})
								}
							}
							wx.hideLoading()
						}
					},
					fail: function (res) {
						console.log(res)
						wx.hideLoading()
						wx.showToast({
							title: '网络出错',
							icon: 'none',
							duration: 2000,
							mask: true,
						})
					},
					complete: function (res) { },
				})
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 前往优惠券页 
	tocouponlist: function () {
		wx.navigateTo({
			url: '../coupon/coupon',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	// 前往订单页
	toOrderLs: function (e) {
		// console.log(e)
		var orderIndex = e.currentTarget.dataset.orderIndex
		wx.navigateTo({
			url: '../../pages/orders/orders?orderIndex=' + orderIndex,
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
	onShow: function () {
		var that = this;
		// 个人订单
		that.myOrder()
		// app.globalData.userInfo
		// if (app.globalData.userInfo) {
		// console.log("user.app.globalData.userInfo")
		// console.log(app.globalData.userInfo)
		var avatarUrl = app.globalData.userInfo.data.avatarUrl;
		var nickName = app.globalData.userInfo.data.nickName;
		var coupons = app.globalData.userInfo.data.coupons;
		if (coupons == null) {
			coupons = 0
		} else {
			coupons = coupons.length
		}
		var money = app.globalData.userInfo.data.money;
		var integral = app.globalData.userInfo.data.integral;
		that.setData({
			userInfo: app.globalData.userInfo,
			avatarUrl: avatarUrl,
			nickName: nickName,
			coupons: coupons,
			money: money,
			integral: integral,
		})
		// }
	},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
		// var that = this;
		// that.myOrder()
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