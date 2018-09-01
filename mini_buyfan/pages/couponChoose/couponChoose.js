// pages/couponChoose/couponChoose.js
const app = getApp();
const ctx = wx.createCanvasContext('tag')
ctx.rotate(20 * Math.PI / 180)
Page({

    /**
     * 页面的初始数据
     */
	data: {
		canUse: [],
		used: [],
		cantUse: [],
		tagName: "优惠券",
		// cSort: 0,
		isButton: true,
		type_sort: ["最新", "未使用"],
		usableable: ["使用"],
		activeCategoryId: 0,
		statusText: "立即获取",
		gotText: "立即获取",
		gotCoupon: false,
		coupon: [
			{
				fullNum: "100",
				couponNum: "5.00",
				time: "2018.05.19-2018.07.17"
			},
			{
				fullNum: "100",
				couponNum: "5.00",
				time: "2018.05.19-2018.07.17"
			}
		]
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		var that = this;
		var uid;
		// var skey;
		if (app.globalData.userInfo) {
			// console.log("coupon.app.globalData.userInfo")
			// console.log(app.globalData.userInfo.data)
			uid = app.globalData.userInfo.data.uid
			// skey = app.globalData.userInfo.data.skey
			that.setData({
				// skey: skey
				uid: uid
			})
		}
		// 商家优惠券信息
		that.storeCoupon()
		// 个人优惠券信息
		that.userCoupon()
		// wx.createSelectorQuery().select('.none').boundingClientRect(function (rect) {
		// 	that.setData({
		// 		noneHeight: rect.height - 80
		// 	})
		// }).exec()
	},
	userCoupon: function () {
		var that = this;
		// 用户优惠券信息
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
							} else if (couponlist[i].usable == "1") {
								used.push(couponlist[i])
								that.setData({
									used: used
								})
							} else if (couponlist[i].usable == "2") {
								cantUse.push(couponlist[i])
								that.setData({
									cantUse: cantUse
								})
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