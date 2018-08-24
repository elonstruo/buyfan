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
		console.log("address.options")
		console.log(options)
        if (options.ordersubmit) {
            that.setData({
				ordersubmit: options.ordersubmit,
                orderway: options.orderway,
				storeId: options.storeId
            })
        }
		// 地址内容
		if (app.globalData.userInfo) {
			console.log("address.app.globalData.userInfo")
			console.log(app.globalData.userInfo)
			var userInfor = app.globalData.userInfo.data.userInfor;
			if (userInfor) {
				userInfor = userInfor
			}
			var skey = wx.getStorageSync('key');
			console.log("skey")
			console.log(skey)
			// var uid = app.globalData.userInfo.data.uid;
			// var openid = app.globalData.userInfo.data.openid;
			that.setData({
				userInfor: userInfor,
				skey: skey
				// uid: uid,
				// openid: openid
			})

		}
    },
    //回到订单支付页面
    toOrderSubmit: function (e) {
        var that = this;
        var addressIndex = e.currentTarget.dataset.index;
		var userInfor = that.data.userInfor;
		var address = userInfor[addressIndex]
		wx.setStorage({
			key: 'orderAddress',
			data: address,
		})
        if (that.data.ordersubmit) {
			wx.navigateBack({
				delta: 1,
			})
            // wx.redirectTo({
			// 	url: '../order-submit/order-submit?address=' + address + '&orderway=' + that.data.orderway + '&storeId=' + that.data.storeId,
            //     success: function (res) { },
            //     fail: function (res) { },
            //     complete: function (res) { },
            // })
        }
    },
    // 编辑地址
    edtiAddress: function (e) {
		var that = this;
        var userInforIndex = e.currentTarget.dataset.index;
		wx.redirectTo({
            url: '../edtiAddress/edtiAddress?index=' + userInforIndex,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
    // 添加地址
    toAddress: function () {
        wx.redirectTo({
            url: '../edtiAddress/edtiAddress',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })

	},
    // 删除地址
	deleteAddress: function (e) {
		var that = this;
		// 地址列表
        var userInfor = that.data.userInfor;
		// 选中地址
        var userInforIndex = e.currentTarget.dataset.index;
		// 删除地址列表中选中的地址
        userInfor.splice(userInfor[userInforIndex],1)
		console.log("点击删除后提交的地址")
        console.log(userInfor)
        that.setData({
            userInfor: userInfor
        })
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
			data: {
				action: 'modifyadr',
                userInfor: JSON.stringify(that.data.userInfor),
				skey: that.data.skey
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			dataType: 'json',
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