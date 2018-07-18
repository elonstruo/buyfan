// pages/edtiAddress/edtiAddress.js

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
		region: [],
		customItem: '全部',
		isRegion: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
	edtiAddress: function (e) {
		console.log('form发生了submit事件，携带数据为：', e.detail.value);
		app.loadingBox("保存中")
	},
	bindRegionChange: function (e) {
		var that = this;
		// console.log('picker发送选择改变，携带值为', e.detail.value)
		that.setData({
			region: e.detail.value,
			isRegion: false,
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