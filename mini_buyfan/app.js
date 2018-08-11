//app.js
App({
    d: {
        hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
        shareTitle: '佰分buyfun', //分享标题
    },

    globalData: {
        userInfo: null,
        hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
        actionData: null

    },


    onLaunch: function() {

		var that = this;
		// 设备信息
		wx.getSystemInfo({
			success: function (res) {
				// console.log(res)
				that.screenWidth = res.windowWidth;
				that.screenHeight = res.windowHeight;
				that.pixelRatio = res.pixelRatio;
			}
		});

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        that.commomLogin()
        // actionrequest
        that.actionrequest()
    },
    // 数据初始化
    actionrequest: function() {
        var that = this;
        wx.request({
            url: that.globalData.hostUrl,
            data: {
                action: 'show'
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
                // console.log("actionrequest")
                // console.log(res)
                that.globalData.actionData = res.data
                if (getCurrentPages().length != 0) {
                    getCurrentPages()[getCurrentPages().length - 1].onLoad()

                }

            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    //通用后台登录方法
    commomLogin: function() {
        var that = this;
        var key = wx.getStorageSync('key');
        if (key != '' && key != null && key != undefined) {
            that.isLogined();
        } else {
            that.has_login();
        }
    },
    // 登录
    has_login: function() {
        var that = this;
        // 登录
        wx.login({
            success: res => {
                // console.log("wx.login.res")
                // console.log(res)
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                //发起网络请求
                wx.request({
                    url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
                    method: 'POST',
                    data: {
                        code: res.code,
                        action: 'xcxquery'
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {
                        console.log("loginsuccess")
                        console.log(res)
                        if (res.data.data.skey) {
                            that.globalData.userInfo = res.data;
                            wx.setStorageSync('key', res.data.data.skey);
                            // console.log("______login")
                            // console.log(wx.getStorageSync("key"))
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '登录失败',
                                success: function(res) {}
                            })
                        }
                    },
                    fail: function(res) {
                        console.log("loginfail")
                        console.log(res)
                    }
                })
            }
        })
    },

    //获取本地key登录
    isLogined: function() {
        var that = this;
        var key = wx.getStorageSync('key');
        if (key != '' && key != null && key != undefined) {
            wx.request({
                url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
                method: 'POST',
                data: {
                    key: key,
                    action: 'xcxshow'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    console.log("isLogined.res.data");
                    console.log(res.data);
                    that.globalData.userInfo = res.data;
                }
            })
            return 1;
        } else {
            return 0;
        }
    },
    // 微信支付
    wxpay: function(key, order_sn) {
        var that = this;
        wx.request({
            url: that.globalData.hostUrl + 'Api/Wxpay/wxpay',
            data: {
                key: key,
                order_sn: order_sn
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {
                console.log(res)
                console.log(res.data)
                if (res.data.status == 1) {
                    var payArr = res.data.arr;
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
                            console.log("res")
                            console.log(res)
                            // var paySuccess = true;
                            // console.log("[paySuccess]")
                            // console.log(paySuccess)
                            // return paySuccess
                            wx.showToast({
                                title: '支付成功',
                                icon: 'none',
                                duration: 2000,
                                mask: true,
                            })
                            wx.navigateBack({
                                delta: 1,
                            })
                        },
                        fail: function(res) {
                            // var payFail = false
                            // console.log("[payFail]")
                            // console.log(payFail)
                            // return payFail

                        },
                        complete: function(res) {},
                    })
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
})