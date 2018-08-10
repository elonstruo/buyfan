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

})