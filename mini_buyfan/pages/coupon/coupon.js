// pages/coupon/coupon.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type_sort: ["最新","未使用","已使用","已过期"],
		activeCategoryId: "0",
		statusText: "立即使用",
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
		// wx.createSelectorQuery().select('.none').boundingClientRect(function (rect) {
		// 	console.log(rect.height)
		// 	that.setData({
		// 		noneHeight: rect.height - 80
		// 	})
		// }).exec()
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
		} else if (activeCategoryId == 1) {
			that.setData({
				statusText: "立刻使用",
				isButton: true
			})
		} else if (activeCategoryId == 2) {
			that.setData({
				statusText: "已使用",
				isButton: false
			})
		} else if (activeCategoryId == 3) {
			that.setData({
				statusText: "已过期",
				isButton: false
			})
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