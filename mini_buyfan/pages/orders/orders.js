// pages/orders/orders.js
const app = getApp()
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
		orderslist: "",
        activeId: 0,
		type_sort: ["全部", "处理中", "配送中", "已完成", "已退款"],
		orderRule: {
			"payfinish": "支付完成。待商家受理", 
			"delivery": "跑腿配送中", 
			"finish": "已完成",
			"refund": "部分退款", 
			"allrefund": "已退款", 
			"applyrefund": "申请退款", 
			"applycancel": "申请取消",
			"cancel": "已取消", 
			"fail": "已失败", 
			"adopt": "跑腿已接单", 
			"noaccept": "商家未受理", 
			"accept": "已受理", 
			"unpaid": "未支付"
		}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

		var that = this;
		that.myOrder()
	},
	// tab
	orderTab: function (e) {
		var that = this;
		that.setData({
			activeId: e.currentTarget.dataset.id
		})
		var activeId = that.data.activeId; 
		if (activeId == 0) {
			that.setData({
				orders: that.data.orderslist
			})
			console.log("activeId == 0")
			console.log(orders)
		} else if (activeId == 1) {
			var unpaid = that.data.unpaid
			that.setData({
				orders: unpaid
			})
		} else if (activeId == 2) {
			var delivery = that.data.delivery
			that.setData({
				orders: delivery
			})
		} else if (activeId == 3) {
			var finish = that.data.finish
			that.setData({
				orders: finish
			})
		} else if (activeId == 4) {
			var allrefund = that.data.allrefund
			that.setData({
				orders: allrefund
			})
		}
	},
	// 个人订单
	myOrder: function () {
		var that = this;
        wx.showLoading({
            title: '正在加载',
            mask: true,
        })
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
						var activeId = that.data.activeId;
						var all = that.data.all;
						var unpaid = that.data.unpaid;
						var delivery = that.data.delivery;
						var finish = that.data.finish;
						var allrefund = that.data.allrefund;
                        if (res.statusCode == 200) {
							var orderslist = that.data.orderslist;
							orderslist = res.data.data;
							if (activeId == 0) {
								that.setData({
									orders: orderslist,
									orderslist: orderslist
								})
							}
							for (var i = 0; i < orderslist.length; i++) {
								if (orderslist[i].orderState == "unpaid") {
									unpaid.push(orderslist[i])
									that.setData({
										unpaid: unpaid
									})
								} else if (orderslist[i].orderState == "delivery") {
									delivery.push(orderslist[i])
									that.setData({
										delivery: delivery
									})
								} else if (orderslist[i].orderState == "finish") {
									finish.push(orderslist[i])
									that.setData({
										unpaid: unpaid
									})
								} else if (orderslist[i].orderState == "allrefund") {
									allrefund.push(orderslist[i])
									that.setData({
										allrefund: allrefund
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