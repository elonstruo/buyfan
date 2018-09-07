// pages/takeOut/takeOut.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myOrderData: "",
        orderslist: "",
        remindeText: "催单"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        if (app.globalData.userInfo) {
            // console.log("menu.app.globalData.userInfo")
            // console.log(app.globalData.userInfo)
            var key = app.globalData.userInfo.data.skey;
            that.setData({
                key: key
            })
        }
        // 个人订单
        that.myOrder(function(orderslist) {
            //更新数据
            that.setData({
                orderslist: orderslist
            })
            // console.log('更新数据.orderslist');
            // console.log(orderslist);
        })
    },

    // 距离计算获取送达时间
    orderDistance: function(lat, log, storeId) {
        var that = this;
        var form = lat + "," + log
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
            data: {
                action: 'distance',
                from: form
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: function(res) {
                var distanceShopArr = res.data.data
                for (var i = 0; i < distanceShopArr.length; i++) {
                    if (distanceShopArr[i].id == storeId) {
                        that.setData({
                            deliveryTime: distanceShopArr[i].deliveryTime,
                        })
                    }
                }
            },
            fail: function(res) {
                console.log("距离计算.fail")
                console.log(res)
            },
            complete: function(res) {},
        })
    },
    // 个人订单
    myOrder: function(cb) {
        var that = this;
        var takeout = [];
        var delivery = [];
        if (that.data.orderslist) {
            typeof cb == "function" && cb(that.data.orderslist)
        } else {
            wx.request({
                url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
                data: {
                    action: 'userordershows',
                    key: that.data.key
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                dataType: 'json',
                success: function(res) {
                    if (res.statusCode == 200) {
                        var orderslist = that.data.orderslist;
                        orderslist = res.data.data;
                        that.setData({
                            orderslist: orderslist
                        })
                        typeof cb == "function" && cb(that.data.orderslist)
                        for (var i = 0; i < orderslist.length; i++) {
                            if (orderslist[i].pickState == "1") {
                                takeout.push(orderslist[i])
                            }
                            // console.log('takeout')
                            // console.log(takeout)
                        }
                        for (var i = 0; i < takeout.length; i++) {
                            if (takeout[i].orderState == "delivery" || takeout[i].orderState == "adopt" || takeout[i].orderState == "accept") {
                                delivery.push(takeout[i])
                            }
                        }
						that.setData({
							delivery: delivery
						})
                        if (delivery.lenght) {
                            var order = delivery[0]
                            console.log('takeout.order')
                            console.log(order)
                            var shopLocal = JSON.parse(order.cshopInfor.shopLocal)
                            var homeLocal = order.userInfor
                            var shoplat = shopLocal.latitude
                            var shoplog = shopLocal.longitude
                            var homelat = homeLocal.latitude
                            var homelog = homeLocal.longitude
                            // var runLocal = order.deliveryInfor
                            if (order.deliveryInfor) {
                                var runLocal = order.deliveryInfor
                                var runlat = runLocal.latitude
                            } else {
                                var runLocal = {
                                    latitude: 23.557275,
                                    longitude: 116.364060,
                                }
                            }
                            var runlat = runLocal.latitude
                            var runlog = runLocal.longitude
                            var operation = order.operation
                            var last = operation[operation.length - 1]
                            var storeId = order.cshopInfor.id
                            that.orderDistance(homelat, homelog, storeId)

                            that.setData({
                                stateText: last.name,
                                delivery: delivery,
                                shopLocal: shopLocal,
                                homeLocal: homeLocal,
                                shoplat: shoplat,
                                shoplog: shoplog,
                                homelat: homelat,
                                homelog: homelog,
                                // polyline: [{
                                // 	points: [{
                                // 		iconPath: "../../images/icon-map-shop.png",
                                // 		id: 0,
                                // 		latitude: shoplat,
                                // 		longitude: shoplog,
                                // 		width: 28,
                                // 		height: 37
                                // 	},
                                // 	{
                                // 		iconPath: "../../images/icon-map-home.png",
                                // 		id: 1,
                                // 		latitude: homelat,
                                // 		longitude: homelog,
                                // 		width: 28,
                                // 		height: 37
                                // 	}
                                // 	],
                                // 	color: '#aed8a2',
                                // 	width: 8,
                                // 	dottedLine: false

                                // }],
                                markers: [{
                                        iconPath: "../../images/icon-map-shop.png",
                                        id: 0,
                                        latitude: shoplat,
                                        longitude: shoplog,
                                        width: 28,
                                        height: 37
                                    },
                                    {
                                        iconPath: "../../images/icon-map-home.png",
                                        id: 1,
                                        latitude: homelat,
                                        longitude: homelog,
                                        width: 28,
                                        height: 37
                                    }, {
                                        iconPath: "../../images/icon-map-run.png",
                                        id: 2,
                                        latitude: runlat,
                                        longitude: runlog,
                                        width: 22,
                                        height: 22
                                    }
                                ],
                            })
                        }

                    }
                },
                fail: function(res) {
                    console.log(res)
                    wx.hideLoading()
                    wx.showToast({
                        title: '网络出错',
                        icon: 'none',
                        duration: 2000,
                        mask: true,
                    })
                },
                complete: function(res) {},
            })
        }
    },
    // 催单
    reminde: function() {
        var that = this;
        wx.showToast({
            title: '已催单!',
            icon: 'none',
            duration: 2000,
            mask: true,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
        that.setData({
            remindeText: "已催单"
        })
    },
	// 去点单
	tomenu: function () {
		wx.navigateTo({
			url: '../menu/menu?orderway=shopfor&id=1',
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
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
        // 个人订单
        that.myOrder(function(orderslist) {
            //更新数据
            that.setData({
                orderslist: orderslist
            })
            // console.log('更新数据.orderslist');
            // console.log(orderslist);
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