// pages/stores/stores.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		console.log("options")
		console.log(options)
		var that = this;
		var stores = JSON.parse(options.stores)
		console.log("stores")
		console.log(stores)
        if (options.ordersubmit) {
            that.setData({
                stores: stores,
                orderway: options.orderway,
                ordersubmit: options.ordersubmit,
            })
        } else {
            that.setData({
                stores: stores,
                orderway: options.orderway,
            })
        }
    },
	//返回订单页或菜单页面
	chooseStore: function (e) {
        var that = this;
		var id = e.currentTarget.dataset.id
			wx.navigateBack({
				delta: 1,
			})
			wx.setStorageSync("menuStoreId", id)
        
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