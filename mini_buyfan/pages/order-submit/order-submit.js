// pages/order-submit/order-submit.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		// 到店下单way
		shopway: 'shopself'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            orderway: options.orderway,
        })
        // actionData
        if (app.globalData.actionData) {
            // console.log("app.globalData.actionData.orderway.tackout.pick")
            // console.log(app.globalData.actionData.orderway.tackout.pick)
            var pick = app.globalData.actionData.orderway.tackout.pick
            var tackoutprice = pick.tackoutprice
            var other = app.globalData.actionData.orderway.tackout.other
            that.setData({
                pick: pick
            })
            var otherItem = [{
                name: other.name,
                value: other.price,
                checked: 'true'
            }, ]
            that.setData({
                otherItem: otherItem,
                tisuPrice: other.price,
                tackoutprice: tackoutprice,
            })
            var pickstate = pick.state;
            if (pickstate == 1) {
                that.setData({
                    pickstate: pickstate
                })
            }
        }
        // 购物车
        if (app.globalData.cartObjectsStorage) {
            that.setData({
                cartObjects: app.globalData.cartObjectsStorage
            })
        }
        var cartObjects = that.data.cartObjects
        for (var i = 0; i < cartObjects.length; i++) {
            var numPrice = cartObjects[i].num * cartObjects[i].cartFood.sPrice
            cartObjects[i].numPrice = numPrice
        }
        that.setData({
            cartObjects: cartObjects
        })
        that.amount()
        that.allAmount()
        // 判断外卖或堂食
        if (that.data.orderway == "shopfor") {
            that.setData({
                shopfor: true
            })
        } else {
            that.setData({
                tackout: true
            })
            // addressinit
            // 选择地址
            wx.getStorage({
                key: 'orderAddress',
                success: function(res) {
                    var address = res.data;
                    that.setData({
                        address: address,
                        addressLat: address.latitude,
                        addressLon: address.longitude,
                    })
                },
                fail: function(res) {
                    // console.log("fail.res")
                    // console.log(res)
                    if (app.globalData.userInfo) {
                        var address = app.globalData.userInfo.data.userInfor[0]
                        that.setData({
                            address: address,
                            addressLat: address.latitude,
                            addressLon: address.longitude,
                        })
                    }
                },
                complete: function(res) {},
            })
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
		// var storeId = wx.getStorageSync('orderStoreId');
		// if (storeId) {
		// 	that.showStore(storeId)
		// } else 
		if (options.storeId) {
			var storeId = options.storeId;
			that.showStore(storeId)
		}
	},
	// 到店下单way
	radioChange: function (e) {
		console.log('radio发生change事件，携带value值为：', e.detail.value)
	},
	// 传入分店id显示分店
	showStore: function (storeId) {
		var that = this;
		var storesData = that.data.storesData;
		for (var i = 0; i < storesData.length; i++) {
			if (storesData[i].id == storeId) {
				that.setData({
					storeId: storeId,
					shopName: storesData[i].shopName,
					shopLatitude: storesData[i].shopLocal.latitude,
					shopLongitude: storesData[i].shopLocal.longitude,
				})
			}
		}
	},
    // 商品总额结算
    amount: function(cartObjects) {
        var that = this;
        var cartObjects = that.data.cartObjects;
        var amount = 0;
        var num = 0;
        cartObjects.forEach(function(item, index) {
            amount += item.num * item.cartFood.sPrice;
            num += item.num;
        });
        that.setData({
            amount: amount,
        });
    },
    // 支付总额
    allAmount: function() {
        var that = this;
        var tisuPrice = +that.data.tisuPrice;
        var allAmount = that.data.amount;
        allAmount += tisuPrice;
        that.setData({
            allAmount: allAmount
        })
    },
    // 选择分店
    changeshop: function() {
        var that = this;
        wx.navigateTo({
            url: '../stores/stores?stores=' + that.data.storestring + '&orderway=' + that.data.orderway + '&ordersubmit=true',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 选择收货地址
    addaddress: function() {
        var that = this;
        wx.navigateTo({
            url: '../../pages/address/address?ordersubmit=true&orderway=' + that.data.orderway + '&storeId=' + that.data.storeId,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 餐巾纸选择
    checkboxChange: function(e) {
        var that = this;
        var check = e.detail.value;
        if (!check.length) {
            that.setData({
                tisuPrice: ""
            })
            that.allAmount()
        } else {
            that.setData({
                tisuPrice: check[0]
            })
            that.allAmount()
        }
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
		// 获取选择地址
        wx.getStorage({
            key: 'orderAddress',
            success: function(res) {
                var address = res.data;
                that.setData({
                    address: address,
                    addressLat: address.latitude,
                    addressLon: address.longitude,
                })
            },
            fail: function(res) {},
            complete: function(res) {},
        })
		// 获取选择店铺
		var storeId = wx.getStorageSync('menuStoreId');
		if (storeId) {
			that.showStore(storeId)
		}
        // 实例化API核心类
        var demo = new QQMapWX({
            key: app.globalData.locationKey // 必填
        });
        // 调用接口
        demo.calculateDistance({
            mode: 'driving',
            form: [{
                latitude: that.data.addressLat,
                longitude: that.data.addressLon
            }],
            to: [{
                latitude: that.data.shopLatitude,
                longitude: that.data.shopLongitude
            }],
            success: function(res) {
                var distance = app.commafy(res.result.elements[0].distance);
                that.setData({
                    distance: distance
                })
                // console.log("demo.calculateDistance");
                // console.log(res);
                var distancePrice
                var pick = that.data.pick
                // console.log("pick")
                // console.log(pick)
                var distance = that.data.distance
                // 标准配送距离（公里）
                var mindistance = pick.mindistance
                // 标准配送距离收费
                var minpickprice = pick.minpickprice
                // 最大配送距离
                var maxdistance = pick.maxdistance
                // 超出标准配送距离每公里收费
                var over = pick.over
                if (distance > mindistance && distance <= maxdistance) {
                    distanceover = +maxdistance - distance;
                    distancePrice = mindistance * minpickprice + distanceover * over
                    that.setData({
                        distancePrice: distancePrice
                    })
                } else {
                    distancePrice = Math.round(+distance * +minpickprice)
                    that.setData({
                        distancePrice: distancePrice
                    })
                }
            },
            fail: function(res) {
                console.log("demo.calculateDistance");
                console.log(res);
            },
            complete: function(res) {
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