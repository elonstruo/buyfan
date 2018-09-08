// pages/vip/vip.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isVIPNo: true,
        isVIPYes: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 充值内容action
        if (app.globalData.actionData) {
            // console.log("vip.app.globalData.actionData")
            // console.log(app.globalData.actionData)
            var actionData = app.globalData.actionData;
            that.setData({
                rights: actionData.member.rights,
                charge: actionData.member.charge.price,
                recharge: actionData.member.recharge,
            })
        } else {
            app.actionDataCallback = res => {
                // console.log("vip.actionDataCallback.app.globalData.actionData")
                var actionData = app.globalData.actionData;
                that.setData({
                    rights: actionData.member.rights,
                    charge: actionData.member.charge.price,
                    recharge: actionData.member.recharge,
                })
            }
        }
        // 个人信息
        if (app.globalData.userInfo) {
            // console.log("user.app.globalData.userInfo")
            // console.log(app.globalData.userInfo)
            var member = app.globalData.userInfo.data.member;
            var key = app.globalData.userInfo.data.skey;
            that.setData({
                // member: member,
                key: key
            })
        }
        var member = wx.getStorageSync("member")
        that.setData({
            member: member
        })

    },
    // 开通会员
    orderSubmit: function(e) {
        var that = this;
        var topupprice = e.currentTarget.dataset.price;
        var out_trade_no = app.timedetail() + '' + app.randomnum();
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
            data: {
                action: 'orderadd',
                key: that.data.key,
                ordernum: out_trade_no,
                price: topupprice,
                // price: 0.01,
                pickState: 4,
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: function(res) {
                console.log("orderSubmit.success.res")
                console.log(res)
                if (res.statusCode == 200) {
                    that.wxpay(that.data.key, out_trade_no)
                }
            },
            fail: function(res) {
                console.log("orderSubmit.success.res")
                console.log(res)
            },
            complete: function(res) {},
        })
    },
    // 会员充值
    topUp: function(e) {
        var that = this;
        var member = that.data.member;
        if (member == 0) {
            wx.showToast({
                title: '请先开通会员',
                icon: 'none',
                duration: 2000,
                mask: true,
            })
        } else if (member == 1) {
            var topupprice = e.currentTarget.dataset.price;
            var out_trade_no = app.timedetail() + '' + app.randomnum();
            wx.request({
                url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
                data: {
                    action: 'orderadd',
                    key: that.data.key,
                    ordernum: out_trade_no,
                    // price: topupprice,
                    price: 0.01,
                    pickState: 4,
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                success: function(res) {
                    console.log("orderSubmit.success.res")
                    console.log(res)
                    if (res.statusCode == 200) {
                        that.wxpay(that.data.key, out_trade_no)
                    }
                },
                fail: function(res) {
                    console.log("orderSubmit.success.res")
                    console.log(res)
                },
                complete: function(res) {},
            })
        }

    },
    // 微信支付
    wxpay: function(key, order_sn) {
        var that = this;
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
            // url: payurl,
            data: {
                action: 'encryption',
                key: key,
                ordernum: order_sn
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
                console.log(res)
                console.log(res.data)
                // if (res.data.status == 1) {
                var payArr = res.data.param;
                var timeStamp = payArr.timeStamp;
                var nonceStr = payArr.nonceStr;
                var arrPackage = payArr.package;
                var signType = payArr.signType;
                var paySign = payArr.paySign;
                wx.requestPayment({
                    timeStamp: timeStamp,
                    nonceStr: nonceStr,
                    package: arrPackage,
                    signType: 'MD5',
                    paySign: paySign,
                    success: function(res) {
                        console.log("success/pay/res")
                        console.log(res)
                        app.showBox("充值成功")
						wx.setStorageSync("member", 1)
						app.commomLogin()
                    },
                    fail: function(res) {
                        // if (res.errMsg == "requestPayment:fail cancel") {
                        app.showBox("充值未完成")
                        // }
                    },
                    complete: function(res) {},
                })
                // }
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
		var member = wx.getStorageSync("member")
		that.setData({
			member: member
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