// pages/couponChoose/couponChoose.js
// pages/coupon/coupon.js
const app = getApp();
const ctx = wx.createCanvasContext('tag')
ctx.rotate(20 * Math.PI / 180)
Page({

    /**
     * 页面的初始数据
     */
	data: {
		activeCategoryId: 1,
		canUse: [],
		used: [],
		cantUse: [],
		tagName: "优惠券",
		// cSort: 0,
		isButton: true,
		type_sort: ["最新", "未使用", "已使用", "已过期"],
		usableable: ["去使用", "已使用", "已过期"],
		statusText: "立即获取",
		gotText: "立即获取",
		gotCoupon: false,
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		var that = this;
		var uid;
		var uid = wx.getStorageSync('uid');
		that.setData({
			uid: uid
		})
		// var skey;
		// if (app.globalData.userInfo) {
			// console.log("coupon.app.globalData.userInfo")
			// console.log(app.globalData.userInfo.data)
			// uid = app.globalData.userInfo.data.uid
			// skey = app.globalData.userInfo.data.skey
			// that.setData({
				// skey: skey
				// uid: uid
			// })
		// }
	},
	// 用户优惠券信息
	userCoupon: function () {
		var that = this;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/couponmanage.php',
			data: {
				action: 'personcoupon',
				uid: that.data.uid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (res) {
				var activeCategoryId = that.data.activeCategoryId;
				var canUse = [];
				var used = [];
				var cantUse = [];
				if (res.statusCode == 200) {
					var couponlist = res.data.data
					if (couponlist.length) {
						for (var i = 0; i < couponlist.length; i++) {
							if (couponlist[i].usable == "0") {
								canUse.push(couponlist[i])
								that.setData({
									canUse: canUse
								})
								that.taborder()
							} else if (couponlist[i].usable == "1") {
								used.push(couponlist[i])
								that.setData({
									used: used
								})
								that.taborder()
							} else if (couponlist[i].usable == "2") {
								cantUse.push(couponlist[i])
								that.setData({
									cantUse: cantUse
								})
								that.taborder()
							}
						}
					}
				} else {
					app.showBox("网络出错")
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	storeCoupon: function () {
		var that = this;
		// 商家优惠券信息
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/couponmanage.php',
			data: {
				action: 'xcxcouponshow',
				uid: that.data.uid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (res) {
				var activeCategoryId = that.data.activeCategoryId
				if (res.statusCode == 200) {
					if (res.data.data.length) {
						var coupon = res.data.data
						if (activeCategoryId == 0) {
							that.setData({
								coupon: coupon
							})
						}
					}
				} else {
					app.showBox("网络出错")
				}
				// 卡卷类型，0为优惠券，1为折扣卷，2为兑换券
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	getCoupon: function (e) {
		var that = this;
		console.log(e)
		var cid = e.currentTarget.dataset.cid
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/couponmanage.php',
			data: {
				action: 'getcoupon',
				cid: cid,
				uid: that.data.uid
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function (res) {
				if (res.statusCode == 200) {
					that.setData({
						// gotText:"已领取"
					})
					// 商家优惠券信息
					that.storeCoupon()
					// 个人优惠券信息
					that.userCoupon()
					app.showBox("领取成功！")
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	categoryClick: function (e) {
		var that = this;
		that.setData({
			activeCategoryId: e.currentTarget.dataset.id
		});
		var activeCategoryId = that.data.activeCategoryId;
		that.taborder()
	},
	// 使用优惠券
	useCoupon: function (e) {
		// console.log(e)
		var userCoupon = e.currentTarget.dataset.coupon
		wx.setStorageSync('userCoupon', userCoupon)
		wx.navigateBack({
			delta: 1,
		})
	},
	// tab判断
	taborder: function () {
		var that = this;
		var activeCategoryId = that.data.activeCategoryId;
		if (activeCategoryId == 0) {
			that.setData({
				statusText: "立刻获取",
				isButton: true
			})
			that.storeCoupon()
		} else if (activeCategoryId == 1) {
			var canUse = that.data.canUse;
			that.setData({
				statusText: "立刻使用",
				isButton: true,
				coupon: canUse
			})
		} else if (activeCategoryId == 2) {
			var used = that.data.used;
			that.setData({
				statusText: "已使用",
				isButton: false,
				coupon: used
			})
		} else if (activeCategoryId == 3) {
			var cantUse = that.data.cantUse;
			that.setData({
				statusText: "已过期",
				isButton: false,
				coupon: cantUse
			})
		}
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
		var that = this;
		var activeCategoryId = that.data.activeCategoryId;
		// 商家优惠券信息
		that.storeCoupon()
		// 个人优惠券信息
		that.userCoupon()
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