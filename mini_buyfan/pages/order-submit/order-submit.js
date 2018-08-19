// pages/order-submit/order-submit.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            orderway: options.orderway,
            cartObjectsString: options.cartObjects,
            cartObjects: JSON.parse(options.cartObjects),
        })        
        var cartObjects = that.data.cartObjects
        for (var i = 0; i < cartObjects.length; i++) {
            var numPrice = cartObjects[i].num * cartObjects[i].cartFood.sPrice
            cartObjects[i].numPrice = numPrice
        }
        that.setData({
            cartObjects: cartObjects
        })
        that.amount()
        if (that.data.orderway== "shopfor") {
            that.setData({
                shopfor:true
            })
        } else {
            that.setData({
                tackout: true
            })
        }
        // actionDatainit
        if (app.globalData.actionData) {
            console.log("order-submit.app.globalData.actionData")
            console.log(app.globalData.actionData)
        }
        // 商家分店
        if (app.globalData.storesData) {
            var storesData = app.globalData.storesData
            var storestring = JSON.stringify(storesData);
            that.setData({
                storestring: storestring,
                storesData: storesData
            })
        }
        var storeId = options.storeId;
        var storesData = that.data.storesData;
        for (var i = 0; i < storesData.length; i++) {
            if (storesData[i].id == storeId) {
                console.log("storesData[i]")
                console.log(storesData[i])
                that.setData({
                    shopName: storesData[i].shopName,
                    shopLatitude: storesData[i].shopLocal.latitude,
                    shopLongitude: storesData[i].shopLocal.longitude,
                })
            }
        }
    },
    // 总额结算
    amount: function (cartObjects) {
        var that = this;
        var cartObjects = that.data.cartObjects;
        var amount = 0;
        var num = 0;
        cartObjects.forEach(function (item, index) {
            amount += item.num * item.cartFood.sPrice;
            num += item.num;
        });
        that.setData({
            amount: amount.toFixed(2),
        });
    },
    // 选择分店
    changeshop: function () {
        var that = this;
        wx.navigateTo({
            url: '../stores/stores?stores=' + that.data.storestring + '&orderway=' + that.data.orderway + '&ordersubmit=true' + '&cartObjectsString=' + that.data.cartObjectsString,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
	addaddress: function () {
		wx.navigateTo({
			url: '../../pages/address/address?ordersubmit=true',
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	radioChange: function (e) {
		// console.log('radio发生change事件，携带value值为：', e.detail.value)
	},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        // 实例化API核心类
        var demo = new QQMapWX({
            key: app.globalData.locationKey // 必填
        });
        // 调用接口
        demo.calculateDistance({
            mode: 'driving',
            to: [{
                latitude: that.data.shopLatitude,
                longitude: that.data.shopLongitude
            }],
            success: function (res) {
                var distance = app.commafy(res.result.elements[0].distance);
                that.setData({
                    distance: distance
                })
                console.log("demo.calculateDistance");
                console.log(that.data.distance);
            },
            fail: function (res) {
                console.log("demo.calculateDistance");
                console.log(res);
            },
            complete: function (res) {
                // console.log(res);
            }
        });
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