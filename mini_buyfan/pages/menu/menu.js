// pages/menu/menu.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
		activeCategoryId: "0",
		selectedId: "1",
		type_sort: ["特价", "销量好评", "商家推荐"],
		list: ["特价", "销量好评", "商家推荐"],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

	},
	tabClick: function (e) {
		var that = this;
		that.setData({
			selectedId: e.currentTarget.dataset.id
		});
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