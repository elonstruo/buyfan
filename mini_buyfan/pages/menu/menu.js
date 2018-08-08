// pages/menu/menu.js

const app = getApp()
var cartsBarH = 100;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isModal: false,
        maskVisual: 'hidden',
        cartObjects: [],
        cartData: {},
        goodsnum: 1,
        hasCart: false,
        hasAddCart: false,
        hasLike: false,
        likeNum: "",
        storesImgList: [
            "../../images/shopimg.jpg",
            "../../images/shopimg.jpg",
        ],
        appraisesImgList: [
            "../../images/shopimg.jpg",
            "../../images/shopimg.jpg",
            "../../images/shopimg.jpg",
        ],
        selectA: "1",
        activeCategoryId: "0",
        selectedId: "1",
        type_sort: ["特价", "销量好评", "商家推荐", "特价", "销量好评", "商家推荐"],
        list: [{
                id: "1",
                img: "../../images/shopimg.jpg",
                name: "樱花碧根果奶缇樱花碧根果奶缇",
                description: "营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果",
                sale: "444",
                price: "16.60"
            },
            {
                id: "12",
                img: "../../images/shopimg.jpg",
                name: "樱花碧根果奶缇樱花碧根果奶缇",
                description: "营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果",
                sale: "444",
                price: "16.60"
            }
        ],

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 购物城高度
        wx.createSelectorQuery().select('.modal-content').boundingClientRect(function(rect) {
            that.setData({
                // cartHeight: rect.height // 节点的高度
            })
        }).exec()
        // 分类赋值
		if (app.globalData.actionData) {
			var actionData = app.globalData.actionData
			that.setData({
				type_sort: actionData.appClass,
				appName: actionData.appName,
				appPersonback: actionData.appPersonback,
			})
		}
    },
    // 点赞
    likeClick: function(e) {
        var that = this;
        if (that.data.hasLike == false) {
            that.setData({
                likeNum: that.data.likeNum + 1,
                hasLike: true
            })
        } else {
            that.setData({
                likeNum: that.data.likeNum - 1,
                hasLike: false
            })
        }
    },
    // tabbar触发
    tabClick: function(e) {
        var that = this;
        that.setData({
            selectedId: e.currentTarget.dataset.id
        });
    },
    // 评价：最新/最热
    appraisesClick: function(e) {
        var that = this;
        that.setData({
            selectA: e.currentTarget.dataset.id
        });
    },
    // 获取分类id
    categoryClick: function(e) {
        var that = this;
        console.log(e)
        that.setData({
            activeCategoryId: e.currentTarget.dataset.id
        });
    },
    /**
     * 绑定加数量事件
     */
	addCount: function (e) {
		// console.log(e)
		var that = this;
		var foodId = e.currentTarget.dataset.foodId;
		var cartData = that.data.cartData;
		var foodCount = cartData[foodId] ? cartData[foodId] : 0;
		cartData[foodId] = ++foodCount;
		that.setData({
			cartData: cartData,
			foodId: foodId
		})
		that.cartToArray(foodId)

	},
    // 转换购物车数据
	cartToArray: function (foodId) {
		var that = this;
		var list = that.data.list;
		var cartData = that.data.cartData;
		var cartObjects = that.data.cartObjects;
		var cartFood;
		var cart = {};
		cart.quantity = cartData[foodId];
		for (var i = 0; i < list.length; i++) {
			if (list[i].id == foodId) {
				cartFood = list[i];
			}
		}
		for (var i = 0; i < cartObjects.length; i++) {
			if (cartObjects[i].cartFood.id == foodId) {
				// 如果是undefined，那么就是通过点减号被删完了
				if (cartData[foodId] == undefined) {
					cartObjects.splice(i, 1);
				} else {
					cartObjects[i].quantity = cartData[foodId];
				}
				that.setData({
					cartObjects: cartObjects
				});
				console.log(that.data.cartObjects)
				return
			}
		}
		cart.cartFood = cartFood;
		cart.quantity = cartData[foodId];
		cartObjects.push(cart)
		that.setData({
			cartObjects: cartObjects,
            quantity: cartData[foodId]
		});
	},
    /**
     * 绑定减数量事件
     */
	minusCount: function (e) {
		// console.log(e)
		var that = this;
		var foodId = e.currentTarget.dataset.foodId;
		var cartData = that.data.cartData;
		var foodCount = cartData[foodId];
		--foodCount;
		if (foodCount == 0) {
			delete cartData[foodId]
		} else {
			cartData[foodId] = foodCount;
		}
		that.setData({
			cartData: cartData
		})
		that.cartToArray(foodId)

	},
    cascadeToggle: function() {
        var that = this;
        //切换购物车开与关
        that.cascadePopup();

    },
    cascadePopup: function() {
        var that = this;
        // 购物车打开动画
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-in-out',
        });
        that.data.animation = animation;
        var cartHeight = that.data.cartHeight + cartsBarH;
        animation.translateY(-cartHeight).step();
        that.setData({
            animationData: animation.export(),
            maskVisual: 'show',
            cartHeight: cartHeight
        });
        // 遮罩渐变动画
        var animationMask = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
        });
        that.animationMask = animationMask;
        animationMask.opacity(0.5).step();
        that.setData({
            animationMask: animationMask.export(),
        });
    },
    cascadeDismiss: function() {
        var that = this;
        var animation = that.data.animation;
        var cartHeight = that.data.cartHeight;
        // 购物车关闭动画
        animation.translateY(cartHeight).step();
        that.setData({
            animationData: animation.export(),
            cartHeight: cartHeight - cartsBarH
        });
        // 遮罩渐变动画
        that.animationMask.opacity(0).step();
        that.setData({
            animationMask: that.animationMask.export(),
        });
        // 隐藏遮罩层
        that.setData({
            maskVisual: 'hidden'
        });
    },
    // 外卖
    toTakeOut: function() {
        wx.navigateTo({
            url: '../../pages/order-submit/order-submit',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 显示购物车
    showCart: function() {
        var that = this;
        if (that.data.hasCart == false) {
            that.setData({
                hasCart: true
            })
        } else {
            that.setData({
                hasCart: false
            })
        }
    },
    // 显示规格选择
    chooseMoal: function (e) {
        var that = this;
        that.setData({
            isModal: true,
            chooseFoodId: e.currentTarget.dataset.foodId
        })
    },
	choosesty: function (e) {
		var that = this;
		console.log(e)
		that.setData({
			choosestyId: e.currentTarget.dataset.id
		});
	},
    // 关闭蒙层
    toastClode: function () {
        var that = this;
        that.setData({
            isModal: false
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