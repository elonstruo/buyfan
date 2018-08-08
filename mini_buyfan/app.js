//app.js
App({
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	d: {
		hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
		shareTitle: '佰分buyfun', //分享标题
	},

	globalData: {
		userInfo: null,
		hostUrl: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
		actionData: null

	},

	data: {
		// 是否显示申请入会
		hasForm: false,
		// 是否显示通讯录
		hasReg: false,
		isApply: true,
	},

	onLaunch: function () {

		var that = this;

		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 登录
		that.commomLogin()
		// actionrequest
		that.actionrequest()
	},

	//通用后台登录方法
	commomLogin: function () {
		var that = this;
		var token = wx.getStorageSync('token');
		if (token != '' && token != null && token != undefined) {
			that.isLogined();
		} else {
			that.has_login();
		}
	},
	actionrequest: function () {
		var that = this;
		wx.request({
			url: that.globalData.hostUrl,
			data: { action: 'show' },
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			success: function (res) {
				that.globalData.actionData = res.data
				if (getCurrentPages().length != 0) {
					getCurrentPages()[getCurrentPages().length - 1].onLoad()

				}
				
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},
	// 登录
	has_login: function () {
		var that = this;
		// 登录
		wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
				//发起网络请求
				wx.request({
					url: that.globalData.hostUrl + 'Api/Login/wechatLogin',
					method: 'POST',
					data: {
						code: res.code
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function (res) {
						console.log("loginsuccess")
						console.log(res)
						if (res.data.res == 1) {
							wx.setStorageSync('token', res.data.session_3rd);
							// console.log("______login")
							// console.log(wx.getStorageSync("token"))
							that.has_signup()
						} 
						// else {
						// 	wx.showModal({
						// 		title: '提示',
						// 		content: '登录失败',
						// 		success: function (res) { }
						// 	})
						// }
					},
					fail: function (res) {
						console.log("loginfail")
						console.log(res)
					}
				})
			}
		})
	},

	//获取本地token登录
	isLogined: function () {
		var that = this;
		var token = wx.getStorageSync('token');
		if (token != '' && token != null && token != undefined) {
			wx.request({
				url: that.globalData.hostUrl + 'Api/Login/tokenLogin',
				method: 'POST',
				data: {
					token: token
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				success: function (res) {
					console.log(res.data);
					that.globalData.userInfo = res.data;
					that.has_signup()
				}
			})
			return 1;
		} else {
			return 0;
		}
	},

	// 请求用户注册状态
	has_signup: function () {
		var that = this;
		var token = wx.getStorageSync("token")
		if (token) {
			wx.request({
				url: that.globalData.hostUrl + 'Api/Index/has_signup',
				data: {
					token: token
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				success: function (res) {
					console.log(res)
					wx.setStorageSync("has_signup_status", res.data.status)
					wx.setStorageSync("users_type", res.data.users_type)
				},
				fail: function (res) { },
				complete: function (res) { },
			})
		} else {
			that.has_login()
		}
	},

	// 微信支付
	wxpay: function (token, order_sn) {
		var that = this;
		wx.request({
			url: that.globalData.hostUrl + 'Api/Wxpay/wxpay',
			data: {
				token: token,
				order_sn: order_sn
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			success: function (res) {
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
						success: function (res) {
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
						fail: function (res) {
							// var payFail = false
							// console.log("[payFail]")
							// console.log(payFail)
							// return payFail

						},
						complete: function (res) { },
					})
				}
			},
			fail: function (res) { },
			complete: function (res) { },
		})
	},

	// 保存用户微信授权信息
	setInfo: function (info) {
		var that = this;
		var token = wx.getStorageSync('token');
		var infostr = JSON.stringify(info);
		console.log("#######   info   ########");
		console.log(info);
		wx.request({
			url: that.globalData.hostUrl + 'Api/Login/setUserInfo',
			method: 'POST',
			data: {
				'userInfo': infostr,
				'token': token
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: function (res) {
				console.log(res);
				if (res.data == 1) {
					that.globalData.userInfo = info;
					console.log("res.data == 1 that.globalData.userInfo")
					console.log(that.globalData.userInfo)
				} else {
					wx.showModal({
						title: '提示',
						content: '注册信息失败',
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定')
							}
						}
					})
				}
			}
		})
	},
})