//app.js

var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
App({
    d: {
        hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
        shareTitle: '佰分buyfun', //分享标题
    },

    globalData: {
        userInfo: null,
        hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
        // actionData: null,
        storesData: null,
        locationData: null,
        locationKey: 'CT2BZ-I57RV-HIGP7-UMN64-ORLUV-LRB22',
		cartObjectsStorage: []

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

		// actionrequest
		that.actionrequest()
		// 商家分店
		that.stores()
        // 登录
        that.commomLogin()
		// 购物车存储
		that.cartStorage()
    },
	// 加载错误弹窗
	showBox: function(title) {
		wx.showToast({
			title: title,
			icon: 'none',
			// image: '',
			duration: 2000,
			mask: true,
		})
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
			success: function (res) {
				that.globalData.actionData = res.data.data
				if (that.actionDataCallback) {
					that.actionDataCallback(res)
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
		
		// if (getCurrentPages().length != 0) {
		//     getCurrentPages()[getCurrentPages().length - 1].onLoad()
		// }

    },
	// 购物车存储
	cartStorage: function () {
		var that = this;
		wx.getStorage({
			key: 'cartObjectsStorage',
			success: function (res) {
				that.globalData.cartObjectsStorage = res.data
			 },
			fail: function (res) { },
			complete: function (res) { },
		})
	},
    // 商家分店
    stores: function () {
        var that = this;
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
            data: {
                action: 'xcxcchopshow'
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: function(res) {
                // console.log("商家分店")
                // console.log(res)
				if (res.data.data) {
					that.globalData.storesData = res.data.data
					if (that.storesDataCallback) {
						that.storesDataCallback(res)
					}
				}
            },
            fail: function(res) {
				that.showBox("网络出错！")
				that.stores()
			},
            complete: function(res) {},
        })
    },
    // 获取定位
    onShow: function () {
        var that = this;
        // 实例化API核心类
        var qqmapsdk = new QQMapWX({
            key: that.globalData.locationKey
        });
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                // 调用接口
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: function (res) {
                        // console.log("app.getLocation.success.res")
                        // console.log(res)
                        that.globalData.locationData = res
                        if (getCurrentPages().length != 0) {
                            getCurrentPages()[getCurrentPages().length - 1].onLoad()

                        }
                    },
                    fail: function (res) {
                        console.log("getLocation.fail.res")
                        console.log(res);
                    },
                    complete: function (res) {
                    }
                });
            }
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
							wx.setStorageSync('uid', res.data.data.uid);
							wx.setStorageSync('userInforAddress', res.data.data.userInfor);
							wx.setStorageSync('member', res.data.data.member);
							wx.setStorageSync('money', res.data.data.money);
							wx.setStorageSync('coupons', res.data.data.coupons);
						} else {
							// that.has_login()
                            // wx.showModal({
                            //     title: '提示',
                            //     content: '登录失败',
                            //     success: function(res) {}
                            // }) 
                        }
                    },
                    fail: function(res) {
                        console.log("loginfail")
                        console.log(res)
						that.has_login()
                    }
                })
            }
        })
    },
    //获取本地key登录
    isLogined: function(cb) {
        var that = this;
        var key = wx.getStorageSync('key');
        if (key != '' && key != null && key != undefined) {

			if (that.globalData.userInfo) {
				typeof cb == "function" && cb(that.globalData.userInfo)
			} else {
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
					if (res.data.request == "fail") {
						wx.showModal({
							title: '授权过期',
							content: '请重新授权',
							showCancel: true,
							confirmText: '授权',
							confirmColor: '#333',
							success: function (res) {
								if (res.confirm) {
									that.has_login()
								}
							},
							fail: function(res) {},
							complete: function(res) {},
						})
					} else {
						that.globalData.userInfo = res.data;
						typeof cb == "function" && cb(that.globalData.userInfo)
						wx.setStorageSync('uid', res.data.data.uid);
						wx.setStorageSync('userInforAddress', res.data.data.userInfor);
						wx.setStorageSync('member', res.data.data.member);
						wx.setStorageSync('money', res.data.data.money);
						wx.setStorageSync('coupons', res.data.data.coupons);
					}
                },
            })
			}
        } 
		else {
			that.has_login()
        }
	},
	getUserInfo: function (e) {
		var that = this;
		// 登录
		that.commomLogin()
	},
    //js数字千分符处理
    commafy: function (num) {
        num = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
            num = num.replace(re, "$1.$2")
        }
        return num;
    },
    // 微信支付
    wxpay: function(key, order_sn,funname) {
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
							that.showBox("支付成功")
							return funname
							// wx.redirectTo({
							// 	url: '../orders/orders',
							// 	success: function(res) {},
							// 	fail: function(res) {},
							// 	complete: function(res) {},
							// })
                        },
                        fail: function(res) {
							// if (res.errMsg == "requestPayment:fail cancel") {
							that.showBox("支付未完成")
							return funname
							// wx.redirectTo({
							// 	url: '../orders/orders',
							// 	success: function (res) { },
							// 	fail: function (res) { },
							// 	complete: function (res) { },
							// })
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
	// 生成订单日期
	timedetail: function () {
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000;
		var n = timestamp * 1000;
		var date = new Date(n);
		var Y = date.getFullYear();
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		var h = date.getHours();
		var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();;
		var s = date.getSeconds();
		return Y + '' + M + '' + D + '' + h + '' + m + '' + s
	},
	// 生成订单流水号
	randomnum: function () {
		var chars = '1234567890';
		var maxPos = chars.length;
		var pwd = '';
		for (var i = 0; i < 4; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
})