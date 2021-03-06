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
        that.myOrder()
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
    myOrder: function() {
        var that = this;
        var activeId = that.data.activeId;
        var all = [];
        var unpaid = [];
        var unpaidi = [];
        var delivery = [];
        var finish = [];
        var allrefund = [];
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
                wx.showLoading({
                    title: '正在加载',
                    mask: true,
                })
                if (res.statusCode == 200) {
					console.log('res.data.data')
					console.log(res.data.data)
                    that.setData({
                        orderslist: res.data.data
                    })
                    var orderslist = that.data.orderslist;
                    for (var i = 0; i < orderslist.length; i++) {
                        if (orderslist[i].pickState == 1) {
                            if (orderslist[i].orderState == "delivery" || orderslist[i].orderState == "adopt" || orderslist[i].orderState == "accept") {
                                delivery.push(orderslist[i])
                                that.setData({
                                    delivery: delivery
                                })
                            }
                        }
                    }
					console.log('that.data.delivery')
					console.log(that.data.delivery)
					if (that.data.delivery) {
						var order = that.data.delivery[0]
						var shopLocal = JSON.parse(order.cshopInfor.shopLocal)
						var homeLocal = order.userInfor
						var shoplat = shopLocal.latitude
						var shoplog = shopLocal.longitude
						var homelat = homeLocal.latitude
						var homelog = homeLocal.longitude
						if (order.deliveryInfor) {
							var runLocal = order.deliveryInfor
						} else {
							var runLocal = {
								latitude: 23.557275,
								longitude: 116.364060,
								name: '陈先生',
								tel: 15528282828
							}
						}
						var runlat = runLocal.latitude
						var runlog = runLocal.longitude
						var runname = runLocal.name
						var runtel = runLocal.tel
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
					wx.hideLoading()
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
    tomenu: function() {
        wx.navigateTo({
            url: '../menu/menu?orderway=takeout&id=1',
            success: function(res) {},
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
        // 个人订单
        that.myOrder()
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