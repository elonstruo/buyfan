// pages/address/address.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // isAddress: false,
        toAddress: true,
        isAddress: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // console.log("address.options")
        // console.log(options)
        if (options.ordersubmit) {
            that.setData({
                ordersubmit: options.ordersubmit,
                orderway: options.orderway,
                storeId: options.storeId,
                isAddress: true,
            })
        }
		var key = wx.getStorageSync('key');
		that.setData({
			key: key
		})
        // 地址内容
        wx.getStorage({
            key: 'userInforAddress',
            success: function(res) {
                that.setData({
                    userInfor: res.data
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    //回到订单支付页面
    toOrderSubmit: function(e) {
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
    edtiAddress: function(e) {
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
    toAddress: function() {
        wx.redirectTo({
            url: '../edtiAddress/edtiAddress',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })

    },
    // 删除地址
    deleteAddress: function(e) {
        var that = this;
        // 地址列表
        var userInforArr = that.data.userInfor;
        // 选中地址
        var userInforIndex = e.currentTarget.dataset.index;
		console.log('userInforIndex')
		console.log(userInforIndex)
        wx.showModal({
            content: '确定删除该地址吗？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '删除',
            confirmColor: '#333',
            success: function(res) {
                console.log('deleteAddress.res')
                console.log(res)
                if (res.confirm == true) {
                    // 删除地址列表中选中的地址
					userInforArr.splice(userInforIndex, 1)
                    wx.request({
                        url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
                        data: {
                            action: 'modifyadr',
							userInfor: JSON.stringify(userInforArr),
                            key: that.data.key
                        },
                        header: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST',
                        success: function(res) {
							wx.setStorage({
								key: 'userInforAddress',
								data: userInforArr,
								success: function(res) {
									app.showBox("删除成功")
									wx.getStorage({
										key: 'userInforAddress',
										success: function(res) {
											that.setData({
												userInfor: res.data
											})
										},
										fail: function(res) {},
										complete: function(res) {},
									})
								},
								fail: function(res) {},
								complete: function(res) {},
							})
                        },
                        fail: function(res) {},
                        complete: function(res) {},
                    })
                }
            },
            fail: function(res) {},
            complete: function(res) {},
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
        var that = this;
        // 地址内容
        wx.getStorage({
            key: 'userInforAddress',
            success: function(res) {
                that.setData({
                    userInfor: res.data
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })
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