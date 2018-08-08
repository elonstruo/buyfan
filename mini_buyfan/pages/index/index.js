//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
		indicatorDots: true,
		swiperCurrent: 0,
		selectCurrent: 0,
		autoplay: false,
		interval: 5000,
		duration: 1000,
	},
	// swiper dots 变化
	swiperchange: function (e) {
		this.setData({
			swiperCurrent: e.detail.current
		})
	},
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
	toVIP: function () {
		wx.navigateTo({
			url: '../vip/vip',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
    onLoad: function() {
		var that = this;
		
		// banner
		if (app.globalData.actionData) {
			console.log("index.app.globalData.actionData")
			console.log(app.globalData.actionData)
			var appSlideshow = app.globalData.actionData.appSlideshow
			that.setData({
				appSlideshow: appSlideshow
			})
		}

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
	onShow: function () {
		var that = this;

		// 实例化API核心类
		var qqmapsdk = new QQMapWX({
			key: 'CT2BZ-I57RV-HIGP7-UMN64-ORLUV-LRB22'
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
						that.setData({
							street: res.result.address_component.street
						})
					},
					fail: function (res) {
						console.log(res);
					},
					complete: function (res) {
					}
				});
			}
		})
	},
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})