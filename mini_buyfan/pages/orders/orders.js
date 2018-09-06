// pages/orders/orders.js
var Promise = require('../../utils/es6-promise.js');
const app = getApp()
// function myOrders () {
//     return new Promise(function(resolve, reject) {
//         console.log("res")
//         that.myOrder()
//         resolve();
//     })
// }
// myOrders()
Page({

    /**
     * 页面的初始数据
     */
	data: {
		payfinish: [],
		delivery: [],
		finish: [],
		refund: [],
		allrefund: [],
		applyrefund: [],
		applycancel: [],
		cancel: [],
		fail: [],
		adopt: [],
		noaccept: [],
		accept: [],
		unpaid: [],
		unpaidi: "",
		orderslist: "",
        activeId: 0,
		type_sort: ["全部", "处理中", "配送中", "已完成", "已退款"],
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
		if (options.orderIndex) {
			that.setData({
				activeId: options.orderIndex
			})
		} else {
			that.setData({
				activeId: that.data.activeId
			})
		}
        // 个人信息
        if (app.globalData.userInfo) {
            // console.log("menu.app.globalData.userInfo")
            // console.log(app.globalData.userInfo)
            var key = app.globalData.userInfo.data.skey;
            that.setData({
                key: key
            })
        }
        that.taborder()
	},
	// tab
	orderTab: function (e) {
		var that = this;
		that.setData({
			activeId: e.currentTarget.dataset.id
		})
		var activeId = that.data.activeId;
        that.taborder()
	},
	// tab判断
	taborder: function () {
		var that = this;
        var activeIds = that.data.activeId;
		if (activeIds == 0) {
			that.setData({
				orders: that.data.orderslist
			})
		} else if (activeIds == 1) {
			var unpaid = that.data.unpaid
			that.setData({
				orders: unpaid
			})
		} else if (activeIds == 2) {
			var delivery = that.data.delivery
			that.setData({
				orders: delivery
			})
		} else if (activeIds == 3) {
			var finish = that.data.finish
			that.setData({
				orders: finish
			})
		} else if (activeIds == 4) {
			var allrefund = that.data.allrefund
			that.setData({
				orders: allrefund
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
                    that.taborder()
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
	// 订单详情
	toorderdetail: function (e) {
		var order = e.currentTarget.dataset.orderdetail
		wx.navigateTo({
			url: '../order-details/order-details?order=' + JSON.stringify(order),
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	// 支付订单
	payorder: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		app.wxpay(that.data.key, orderNum)
		that.myOrder()
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
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 申请退款
	applyrefund: function (e) {
		var that = this;
		var orderNum = e.currentTarget.dataset.orderNum;
		var price = e.currentTarget.dataset.price;
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'applyrefund',
				key: that.data.key,
				ordernum: orderNum,
				remark: that.data.remark,
				price: price
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				console.log('success.res')
				console.log(res)
				if (res.statusCode == 200) {
					app.showBox("申请退款已提交")
					that.myOrder()
				}
			},
			fail: function (res) {
				console.log('fail.res')
				console.log(res)},
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
				remark: that.data.remark,
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				app.showBox("退款申请已取消")
				that.myOrder()
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
			success: function(res) {
				console.log("deleteOrder")
				console.log(res)
				if (res.confirm == true) {
					wx.getStorage({
						key: 'key',
						success: function(res) {
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
									// console.log('deleteOrder.res')
									// console.log(res)
									// for (var i = 0; i < orderslist.length; i++) {
									// 	if (orderslist[i].orderNum == orderNum) {
											// orderslist.splice(index, 1);
											// that.setData({
											// 	orderslist: orderslist
											// })
											that.myOrder()
									// 	}
									// }
								},
								fail: function (res) { },
								complete: function (res) { },
							})
						},
						fail: function(res) {},
						complete: function(res) {},
					})
				} else {
					return false
				}
			},
			fail: function(res) {},
			complete: function(res) {},
		})

	},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        var that = this;
        that.taborder(that.data.orderIndex)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
		var that = this;
		that.myOrder()
		
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