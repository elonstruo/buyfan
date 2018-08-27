// pages/orders/orders.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeId: 0
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
						console.log("myOrder.res")
						console.log(res)
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