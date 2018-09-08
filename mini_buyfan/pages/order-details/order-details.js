// pages/order-details/order-details.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		orderRule: {
			"unpaid": "未支付",
			"noaccept": "商家未受理",
			"payfinish": "支付完成。待商家受理",
			"accept": "已受理",
			"adopt": "跑腿已接单",
			"delivery": "跑腿配送中",
			"applyrefund": "申请退款",
			"applycancel": "申请取消",
			"refund": "部分退款",
			"allrefund": "已退款",
			"cancel": "已取消",
			"finish": "已完成",
			"fail": "已失败",
		}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		var order = JSON.parse(options.order)
		that.setData({
			order: order
		})
		var key = wx.getStorageSync("key")
		that.setData({
			key: key
		})
		console.log('order')
		console.log(that.data.order)
		that.setData({
			storeId: order.cshopInfor.id,
			distance: order.distance
		})
		// actionData
		if (app.globalData.actionData) {
			var pick = app.globalData.actionData.orderway.tackout.pick
			var tackoutprice = pick.tackoutprice
			var other = app.globalData.actionData.orderway.tackout.other
			that.setData({
				pick: pick
			})
		}
		var lat = order.userInfor.latitude
		var log = order.userInfor.longitude
		if (order.pickState == 1) {
			that.orderDistancePrice()
		}
		that.setData({
			member: wx.getStorageSync('member')
		})
	},
	// 计算获取配送费
	orderDistancePrice: function () {
		var that = this;
		var distance = parseInt(app.commafy(that.data.distance))
		var distancePrice
		var pick = that.data.pick
		var distanceover
		// 标准配送距离（公里）
		var mindistance = parseInt(pick.mindistance)
		// 标准配送距离收费
		var minpickprice = parseInt(pick.minpickprice)
		// 最大配送距离
		var maxdistance = parseInt(pick.maxdistance)
		// 超出标准配送距离每公里收费
		var over = parseInt(pick.over)
		if (distance > mindistance && distance <= maxdistance) {
			distanceover = +distance - mindistance;
			distancePrice = minpickprice + distanceover * over
			that.setData({
				distancePrice: distancePrice.toFixed(2)
			})
		} else if (distance <= mindistance) {
			distancePrice = Math.round(+distance * +minpickprice)
			that.setData({
				distancePrice: distancePrice.toFixed(2)
			})
		}
	},
	// 个人订单
	myOrder: function () {
		var that = this;
		var activeId = that.data.activeId;
		var all = [];
		var unpaid = [];
		var unpaidi = [];
		var delivery = [];
		var finish = [];
		var allrefund = [];
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'userordershows',
				key: that.data.key
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			dataType: 'json',
			success: function (res) {
				wx.showLoading({
					title: '正在加载',
					mask: true,
				})
				if (res.statusCode == 200) {
					var orderslist = that.data.orderslist;
					orderslist = res.data.data;
					console.log("orderslist")
					console.log(orderslist)
					that.setData({
						// orders: orderslist,
						orderslist: orderslist
					})
					for (var i = 0; i < orderslist.length; i++) {
						// 待处理
						if (orderslist[i].orderState == "payfinish" || orderslist[i].orderState == "applyrefund" || orderslist[i].orderState == "applycancel" || orderslist[i].orderState == "unpaid") {
							unpaid.push(orderslist[i])
							that.setData({
								unpaid: unpaid
							})
							// 配送中
						} else if (orderslist[i].orderState == "delivery" || orderslist[i].orderState == "adopt" || orderslist[i].orderState == "accept") {
							delivery.push(orderslist[i])
							that.setData({
								delivery: delivery
							})
							// 已完成
						} else if (orderslist[i].orderState == "finish" || orderslist[i].orderState == "cancel" || orderslist[i].orderState == "fail" || orderslist[i].orderState == "noaccept") {
							finish.push(orderslist[i])
							that.setData({
								finish: finish
							})
							// 已退款
						} else if (orderslist[i].orderState == "refund" || orderslist[i].orderState == "allrefund") {
							allrefund.push(orderslist[i])
							that.setData({
								allrefund: allrefund
							})
						}
					}
					that.setData({
						activeId: that.data.activeId
					})
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
	// 支付订单
	payorder: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		that.setData({
			orderNum: orderNum
		})
		if (that.data.member == 0) {
			that.wxpay(that.data.key, orderNum)
			that.myOrder()
		} else if (that.data.member == 1){
			that.vippay(that.data.key, orderNum)
			that.myOrder()
		}
	},
	// 确认收货
	sureTake: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		wx.showModal({
			content: '确定确认收货吗？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#333',
			confirmText: '确定',
			confirmColor: '#333',
			success: function (res) {
				if (res.confirm == true) {
					wx.request({
						url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
						data: {
							action: 'userSureTake',
							key: that.data.key,
							ordernum: orderNum
						},
						header: { 'Content-Type': 'application/x-www-form-urlencoded' },
						method: 'post',
						success: function (res) {
							app.showBox("确认收货成功")
							that.myOrder()
							wx.navigateBack({
								delta: 1,
							})
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 评价订单
	toappraise: function (e) {
		var that = this;
		var ordernum = e.currentTarget.dataset.ordernum
		wx.navigateTo({
			url: '../appraise/appraise?ordernum=' + ordernum,
		})
	},
	//取消订单
	ordercancel: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		wx.showModal({
			content: '确定取消该订单吗？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#333',
			confirmText: '确定',
			confirmColor: '#333',
			success: function (res) {
				if (res.confirm == true) {
					wx.request({
						url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
						data: {
							action: 'ordercancel',
							key: that.data.key,
							ordernum: orderNum,
							remark: that.data.remark
						},
						header: { 'Content-Type': 'application/x-www-form-urlencoded' },
						method: 'post',
						success: function (res) {
							app.showBox("已申请该订单取消")
							that.myOrder()
							wx.navigateBack({
								delta: 1,
							})
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 恢复订单
	orderback: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'cancelordercancelapply',
				key: that.data.key,
				ordernum: orderNum,
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				app.showBox("订单已恢复")
				that.myOrder()
				wx.navigateBack({
					delta: 1,
				})
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 申请退款
	applyrefund: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'applyrefund',
				key: that.data.key,
				ordernum: orderNum,
				remark: that.data.order.remark,
				price: that.data.order.orderprice
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				app.showBox("申请退款已提交")
				that.myOrder()
				wx.navigateBack({
					delta: 1,
				})
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 取消退款
	cancelrefund: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'cancelapplyrefund',
				key: that.data.key,
				ordernum: orderNum,
				remark: that.data.order.remark,
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				app.showBox("退款申请已取消")
				that.myOrder()
				wx.navigateBack({
					delta: 1,
				})
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 删除订单
	deleteOrder: function (e) {
		console.log(e)
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		var index = e.currentTarget.dataset.index;
		var orderslist = that.data.orderslist;
		wx.showModal({
			content: '确定删除该订单吗？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#333',
			confirmText: '删除',
			confirmColor: '#333',
			success: function (res) {
				console.log("deleteOrder")
				console.log(res)
				if (res.confirm == true) {
					wx.getStorage({
						key: 'key',
						success: function (res) {
							var key = res.data
							wx.request({
								url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
								data: {
									action: 'userorderdelete',
									key: key,
									ordernum: orderNum
								},
								header: { 'Content-Type': 'application/x-www-form-urlencoded' },
								method: 'post',
								success: function (res) {
									wx.navigateBack({
										delta: 1,
									})
									that.myOrder()
								},
								fail: function (res) { },
								complete: function (res) { },
							})
						},
						fail: function (res) { },
						complete: function (res) { },
					})
				} else {
					return false
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})

	},
	// 微信支付
	wxpay: function (key, order_sn) {
		var that = this;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			// url: payurl,
			data: {
				action: 'encryption',
				key: key,
				ordernum: order_sn
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: function (res) {
				console.log(res)
				console.log(res.data)
				// if (res.data.status == 1) {
				var payArr = res.data.param;
				var timeStamp = payArr.timeStamp;
				var nonceStr = payArr.nonceStr;
				var arrPackage = payArr.package;
				var signType = payArr.signType;
				var paySign = payArr.paySign;
				wx.requestPayment({
					timeStamp: timeStamp,
					nonceStr: nonceStr,
					package: arrPackage,
					signType: 'MD5',
					paySign: paySign,
					success: function (res) {
						console.log("success/pay/res")
						console.log(res)
						app.showBox("支付成功")
						wx.navigateBack({
							delta: 1,
						})
					},
					fail: function (res) {
						console.log('fail.res')
						console.log(res)
						if (res.errMsg == "requestPayment:fail cancel") {
						// app.showBox("支付未完成")
						}
					},
					complete: function (res) { },
				})
				// }
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 微信支付
	vippay: function (key, order_sn) {
		var that = this;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			// url: payurl,
			data: {
				action: 'memberpay',
				key: key,
				ordernum: order_sn
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: function (res) {
				console.log('success.vippay')
				console.log(res)
				if (res.data.request == "fail") {
					wx.showModal({
						content: res.data.errorCause,
						showCancel: true,
						cancelText: '立即充值',
						cancelColor: '#333',
						confirmText: '微信支付',
						confirmColor: '#333',
						success: function (res) {
							console.log(res)
							if (res.confirm) {
								that.wxpay(that.data.key, that.data.orderNum)
							} else {
								wx.redirectTo({
									url: '../vip/vip',
									success: function (res) { },
									fail: function (res) { },
									complete: function (res) { },
								})
							}
						},
						fail: function (res) { },
						complete: function (res) { },
					})

				} else {
					app.showBox("支付成功！")
					wx.redirectTo({
						url: '../orders/orders',
						success: function (res) { },
						fail: function (res) { },
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { 

			},
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