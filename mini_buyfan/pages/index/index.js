//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
    data: {
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
			var appSlideshow = app.globalData.actionData.appSlideshow
			var orderway = app.globalData.actionData.orderway
			that.setData({
				appSlideshow: appSlideshow,
			})
		} else {
			app.actionDataCallback = res => {
				var appSlideshow = app.globalData.actionData.appSlideshow
				var orderway = app.globalData.actionData.orderway
				that.setData({
					appSlideshow: appSlideshow,
				})
                console.log("index.app.actionDataCallback")
                console.log(res)
			}
		}

		// location
		if (app.globalData.locationData) {
			// console.log("index.app.globalData.locationData")
			// console.log(app.globalData.locationData)
			var locationData = app.globalData.locationData;
			that.setData({
				street: locationData.result.address_component.street
			})
		} else {
			that.setData({
				street: "定位中"
			})
			
		}

    },
	onShow: function () {
		var that = this;


	},

})