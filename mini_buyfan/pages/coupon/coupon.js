// pages/coupon/coupon.js
const app = getApp();
const ctx = wx.createCanvasContext('tag')
ctx.rotate(20 * Math.PI / 180)
Page({

    /**
     * 页面的初始数据
     */
    data: {
		tagName: "优惠券",
		// cSort: 0,
		isButton: true,
		type_sort: ["最新", "未使用", "已使用", "已过期"],
		usableable: ["去使用", "已使用","已过期"],
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
    onLoad: function(options) {
		var that = this;
		var uid;
		// var skey;
		if (app.globalData.userInfo) {
			console.log("coupon.app.globalData.userInfo")
			console.log(app.globalData.userInfo.data)
			uid = app.globalData.userInfo.data.uid
			// skey = app.globalData.userInfo.data.skey
			that.setData({
				// skey: skey
				uid: uid
			})
		}
		// 商家优惠券信息
		that.storeCoupon()
		// wx.createSelectorQuery().select('.none').boundingClientRect(function (rect) {
		// 	console.log(rect.height)
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
				console.log("用户优惠券信息")
				console.log(res)
				if (res.data.request == "ok") {
					var coupon = res.data.data
					that.setData({
						coupon: coupon
					})
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
				console.log("商家优惠券信息显示")
				console.log(res.data.data)
				if (res.data.request == "ok") {
					var coupon = res.data.data
					// for
					that.setData({
						coupon: coupon
					})
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
		// console.log(e)
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
			success: function(res) {
				console.log("getcouponres")
				console.log(res)
				if (res.request == "ok") {
					that.setData({
						gotText:"已领取"
					})
				}
			},
			fail: function(res) {},
			complete: function(res) {},
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
			that.setData({
				statusText: "立刻使用",
				isButton: true
			})
			that.userCoupon()
		} else if (activeCategoryId == 2) {
			that.setData({
				statusText: "已使用",
				isButton: false
			})
			that.userCoupon()
		} else if (activeCategoryId == 3) {
			that.setData({
				statusText: "已过期",
				isButton: false
			})
			that.userCoupon()
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
		var that = this;
		var activeCategoryId =that.data.activeCategoryId;
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