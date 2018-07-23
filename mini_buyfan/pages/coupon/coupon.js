// pages/coupon/coupon.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type_sort: ["最新","未使用","已使用","已过期"],
		activeCategoryId: "0"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// wx.createSelectorQuery().select('.none').boundingClientRect(function (rect) {
		// 	console.log(rect.height)
		// 	that.setData({
		// 		noneHeight: rect.height - 80
		// 	})
		// }).exec()
    },
	categoryClick: function (e) {
		var that = this;
		console.log(e)
		that.setData({
			activeCategoryId: e.currentTarget.dataset.id
		});
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