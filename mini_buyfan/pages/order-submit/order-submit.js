// pages/order-submit/order-submit.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
		userInforSubmit: {},
		content: {},
		// 到店下单way
		shopway: 'shopself',
		storeWay: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		var that = this;
		// app.globalData.userInfo
		if (app.globalData.userInfo) {
			// console.log("ordersubmit.app.globalData.userInfo")
			// console.log(app.globalData.userInfo.data)
			var userInfo = app.globalData.userInfo.data;
			var key = userInfo.skey;
			that.setData({
				userInfo: userInfo,
				userInfoString: JSON.stringify(userInfo),
				key: key
			})
		}
		// 下单方式
        that.setData({
            orderway: options.orderway,
		})
		// 判断外卖或堂食
		if (that.data.orderway == "shopfor") {
			var storeWay = that.data.storeWay
			that.setData({
				shopfor: true,
				pickState: storeWay
			})
		} else {
			that.setData({
				tackout: true,
				pickState: 1
			})
			// addressinit
			// 选择地址
			wx.getStorage({
				key: 'orderAddress',
				success: function (res) {
					if (!res.data) {
						if (app.globalData.userInfo) {
							var address = app.globalData.userInfo.data.userInfor[0];
							var addressString = JSON.stringify(address)
							console.log("orderSubmitaddress")
							console.log(address)
							that.setData({
								address: address,
								addressString: addressString,
								addressLat: address.latitude,
								addressLon: address.longitude,
							})
							// 距离计算
							that.orderDistance(that.data.addressLat, that.data.addressLon)
						}
					}
				},
				fail: function (res) {
					console.log("fail.res")
					console.log(res)
				},
				complete: function (res) { },
			})
		}
		// 获取商店列表
		if (app.globalData.storesData) {
			var storesData = app.globalData.storesData
			var storestring = JSON.stringify(storesData);
			that.setData({
				storestring: storestring,
				storesData: storesData
			})
		}
		// 商家分店
		if (options.storeId) {
			var storeId = options.storeId;
			that.showStore(storeId)
		}
        // actionData
        if (app.globalData.actionData) {
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
                cartObjects: app.globalData.cartObjectsStorage,
				cartObjectsStorage: JSON.stringify(app.globalData.cartObjectsStorage)
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
	},
	// 距离计算
	orderDistance: function (lat, log) {
		var that = this;var form = lat + "," + log
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'distance',
				from: form
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'post',
			success: function (res) {
				var distanceShopArr = res.data.data
				var storeId = that.data.storeId
				for (var i = 0; i < distanceShopArr.length; i++) {
					if (distanceShopArr[i].id == storeId) {
						// console.log("distanceShopArr[i]")
						// console.log(distanceShopArr[i])
						that.setData({
							deliveryTime: distanceShopArr[i].deliveryTime,
							distance: distanceShopArr[i].distance
						})
					}
				}
				var distance = parseInt(app.commafy(that.data.distance))
				var distancePrice
				var pick = that.data.pick
				var distanceover
				// console.log("pick")
				// console.log(pick)
				// 标准配送距离（公里）
				var mindistance = parseInt(pick.mindistance)
				// 标准配送距离收费
				var minpickprice = parseInt(pick.minpickprice)
				// 最大配送距离
				var maxdistance = parseInt(pick.maxdistance)
				// 超出标准配送距离每公里收费
				var over = parseInt(pick.over)
				if (distance > mindistance && distance <= maxdistance) {
					distanceover = +distance - mindistance;
					distancePrice = minpickprice + distanceover * over
					that.setData({
						distancePrice: distancePrice.toFixed(2)
					})
					that.allAmount()
				} else if (distance <= mindistance) {
					distancePrice = Math.round(+distance * +minpickprice)
					that.setData({
						distancePrice: distancePrice.toFixed(2)
					})
					that.allAmount()
				}
			},
			fail: function (res) {
				console.log("距离计算.fail")
				console.log(res)
			 },
			complete: function (res) { },
		})
	},
	// 到店下单way
	storeWay: function (e) {
		var that = this;
		that.setData({
			storeWay: e.detail.value,
			pickState: e.detail.value,
		})
	},
	// 到店桌号
	deskNum: function (e) {
		var that = this;
		that.setData({
			desk: e.detail.value,
		})
	},
	// 自提姓名
	selfName: function (e) {
		var that = this;
		that.setData({
			username: e.detail.value,
		})
	},
	// 自提联系方式
	selfTel: function (e) {
		var that = this;
		that.setData({
			tel: e.detail.value,
		})
	},
	// 自提时间
	selfTime: function (e) {
		this.setData({
			ztTime: e.detail.value
		})
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
					cshopinfor: storesData[i]
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
		var amount = +that.data.amount;
        var tisuPrice = +that.data.tisuPrice;
		var distancePrice = +that.data.distancePrice;
        var allAmount = that.data.amount;
		if (that.data.orderway == "shopfor") {
			allAmount = tisuPrice + amount;
		} else {
			allAmount = tisuPrice + distancePrice + amount;
		}
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
	// 订单备注
	remark: function (e) {
		var that = this;
		that.setData({
			remarkText: e.detail.value
		})
	},
	// 提交订单
	orderSubmit: function () {
		var that = this;
		var out_trade_no = app.timedetail() + '' + app.randomnum();
		var allAmount = that.data.allAmount;
		var cartObjectsStorage = that.data.cartObjectsStorage;
		var addressString = that.data.addressString;
		var address = that.data.address;
		var pickState = that.data.pickState;
		// if ()
		// var Attach = [
		// 		{
		// 		name: "餐巾纸",
		// 	}, {
		// 		num: 1,
		// 	}, {
		// 		price: allAmount
		// 	}
		// ]
		var userInforSubmit = that.data.userInforSubmit;
		userInforSubmit.username = that.data.address.username
		userInforSubmit.tel = that.data.address.tel
		userInforSubmit.adr = that.data.address.adr
		userInforSubmit.latitude = that.data.address.latitude
		userInforSubmit.longitude = that.data.address.longitude
		userInforSubmit.desk = that.data.desk
		var content = that.data.content;
		content.shopcar = that.data.cartObjects
		console.log("content")
		console.log(content)
		console.log("userInforSubmit")
		console.log(userInforSubmit)
		content = JSON.stringify(content)
		userInforSubmit = JSON.stringify(userInforSubmit)
		console.log("content")
		console.log(content)
		console.log("userInforSubmit")
		console.log(userInforSubmit)
		console.log("that.data.pickState");
		console.log(that.data.pickState);
		console.log("parseInt(that.data.storeId");
		console.log(parseInt(that.data.storeId));
		console.log("that.data.cshopinfor");
		console.log(that.data.cshopinfor);
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/ordermanage.php',
			data: {
				action: 'orderadd',
				key: that.data.key,
				ordernum: out_trade_no,
				content: content,
				userInfor: userInforSubmit,
				price: parseFloat(that.data.allAmount),
				remark: that.data.remarkText,
				pickState: that.data.pickState,
				cshopid: parseInt(that.data.storeId),
				cshopinfor: JSON.stringify(that.data.cshopinfor),
				distance: parseFloat(that.data.distance),
				discount: 0
			},
			header: { 'Content-Type': 'application/x-www-form-urlencoded'},
			method: 'post',
			dataType: 'json',
			responseType: 'text',
			success: function(res) {
				console.log("orderSubmit.success.res")
				console.log(res)
			},
			fail: function (res) {
				console.log("orderSubmit.success.res")
				console.log(res)},
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
		// 获取选择地址
        wx.getStorage({
            key: 'orderAddress',
            success: function(res) {
                var address = res.data;
				var addressString = JSON.stringify(address)
				console.log("onshowOrderSubmitaddress")
				console.log(address)
				if (res.data) {
					that.setData({
						address: address,
						addressString: addressString,
						addressLat: address.latitude,
						addressLon: address.longitude,
					})
					// 距离计算
					that.orderDistance(that.data.addressLat, that.data.addressLon)
				}
            },
            fail: function(res) {},
            complete: function(res) {},
        })
		// 获取选择店铺
		var storeId = wx.getStorageSync('menuStoreId');
		if (storeId) {
			that.showStore(storeId)
		}
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