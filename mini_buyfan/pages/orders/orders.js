// pages/orders/orders.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeId: 0,
		type_sort: ["全部","未支付","配送中","已完成","已退款"],
    },
    orderTab: function(e) {
        console.log(e)
        var that = this;
        that.setData({
            activeId: e.currentTarget.dataset.id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

		var that = this;
		that.myOrder()
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
						var all = [];
						var dealing = [];
						var outting = [];
						var finish = [];
						var refund = [];
                        if (res.statusCode == 200) {
							var orders = res.data
							for (var i = 0; i < orders.length; i++) {
								if (orders[i].orderState == "0") {
									all.push(orders[i])
                                } else if (orders[i].orderState == "unpaid") {
									dealing.push(orders[i])
								} else if (orders[i].orderState == "2") {
									outting.push(orders[i])
								}
							}
							if (activeId == 0) {
								that.setData({
                                    orders: all
								})
								// console.log("activeId == 0")
								// console.log(orders)
							} else if (activeId == 1) {
								that.setData({
                                    orders: dealing
								})
								// console.log("activeId == 1")
								// console.log(orders)
							} else if (activeId == 2) {
								that.setData({
									orders: dealing
								})
								// console.log("activeId == 2")
								// console.log(orders)
							} else if (activeId == 3) {
								that.setData({
									orders: outting
								})
								// console.log("activeId == 3")
								// console.log(orders)
							}
                            wx.hideLoading()
						}
						// that.setData({
						// 	orders: res.data.data
						// })
						console.log("myOrder.res")
						console.log(that.data.orders)
					},
					fail: function (res) {
						console.log(res)
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