// pages/address/address.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		isAddress: false,
		toAddress: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// app.actionrequest()
		// that.deleteAddress()
        if (options.ordersubmit) {
            that.setData({
                ordersubmit: options.ordersubmit
            })
        }
		// 地址内容
		if (app.globalData.userInfo) {
			console.log("address.app.globalData.userInfo")
			console.log(app.globalData.userInfo)
			var userInfor = app.globalData.userInfo.data.userInfor;
			if (userInfor) {
				userInfor = JSON.parse(userInfor)
			}
			var uid = app.globalData.userInfo.data.uid;
			var openid = app.globalData.userInfo.data.openid;
			that.setData({
				userInfor: userInfor,
				uid: uid,
				openid: openid
			})

		}
    },
    //回到订单支付页面
    toOrderSubmit: function (e) {
        var that = this;
        var addressIndex = e.currentTarget.dataset.index;
        if (that.data.ordersubmit) {
            wx.navigateTo({
                url: '../order-submit/order-submit?index=' + addressIndex,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }
    },
    // 编辑地址
    edtiAddress: function (e) {
		var that = this;
        var userInforIndex = e.currentTarget.dataset.index;
		wx.navigateTo({
            url: '../edtiAddress/edtiAddress?index=' + userInforIndex,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
    // 添加地址
    toAddress: function () {
        wx.navigateTo({
            url: '../edtiAddress/edtiAddress',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })

	},
    // 修改地址
	deleteAddress: function (e) {
		var that = this;
        var userInfor = that.data.userInfor;
        var userInforIndex = e.currentTarget.dataset.index;
        userInfor.splice(userInfor[userInforIndex],1)
        console.log(userInfor)
        that.setData({
            userInfor: userInfor
        })
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
			data: {
				action: 'modifyadr',
				uid: that.data.uid,
				openid: that.data.openid,
                userInfor: JSON.stringify(userInfor)
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: function (res) {
				console.log("personal_info_success");
				console.log(res);
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