// pages/menu/menu.js

const app = getApp()
// 最大行数
var max_row_height = 5;
// 行高
var cart_offset = 99;
// 底部栏偏移量
var food_row_height = 50;
// 招牌高度
var signH = 90;
// tabbar点餐评价商家高度
var tabbarH = 42.5;
Page({

    /**
     * 页面的初始数据
     */
	data: {
        goodsItems: [],
        amount: 0,
        isModal: false,
        maskVisual: 'hidden',
        cartObjects: [],
        cartData: {},
        chooseObjects: [],
        goodsnum: 1,
        hasCart: false,
        hasAddCart: false,
        hasLike: false,
        likeNum: "",
        storesImgList: [
            "../../images/shopimg.jpg",
			"../../images/shopimg.jpg",
			"../../images/shopimg.jpg",
			"../../images/shopimg.jpg",
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
        type_sort: [],
        goods: [],
		

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        // 分类赋值
        if (app.globalData.actionData) {
            var actionData = app.globalData.actionData
            that.setData({
                type_sort: actionData.appClass,
                appName: actionData.appName,
                appPersonback: actionData.appPersonback,
				categoryGoodsclass: actionData.appClass[0],
				mesuScrollHeight: app.screenHeight - signH - tabbarH - food_row_height
            })
        }
		// 所有商品
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/goodsmanage.php',
            data: {
                action: "xcxgoodsshow"
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function(res) {

                var goods = res.data.data;
                that.setData({
                    goods: res.data.data,
                    // goodsSpecDetail: res.data.data.goodsSpecDetail,
                })
				
                for (var j = 0; j < goods.length; j++) {
                }
                // var type_sort = that.data.type_sort;
                // for (var i = 0; i < type_sort.length; i++) {
                // 	console.log(type_sort[i])
                // 	for (var j = 0; j < goods.length; j++) {
                // 		if (goods[i].goodsclass == type_sort[i]) {
                // 			var goodsItem = goods[j]
                // 			console.log("goodsItem")
                // 			console.log(goodsItem)
                // 		}
                // 	}
                // }


            },
            fail: function(res) {},
            complete: function(res) {},
        })
		// 商家分店
		wx.request({
			url: 'https://app.jywxkj.com/shop/baifen/request/shop.php',
			data: {
				action: 'xcxcchopshow'
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			method: 'post',
			success: function(res) {
				console.log("商家分店")
				console.log(res)
				var storestring = JSON.stringify(res.data);
				that.setData({
					stores: res.data,
					storestring: storestring
				})
			},

			fail: function(res) {},
			complete: function(res) {},
		})
    },
	changeshop: function () {
		var that = this;
		wx.navigateTo({
			url: '../stores/stores?stores=' + that.data.storestring,
			success: function(res) {},
			fail: function(res) {},
			complete: function(res) {},
		})
	},
	previewImage: function () {
		wx.previewImage({
			current: '', // 当前显示图片的http链接
			urls: [] // 需要预览的图片http链接列表
		})
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
	// 商家店铺照片
	scroll: function (e) {
		// console.log(e)
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
            selectA: e.currentTarget.dataset.gid
        });
    },
    // 获取分类id
    categoryClick: function(e) {
        var that = this;
        console.log(e)
        that.setData({
			categoryGoodsclass: e.currentTarget.dataset.goodsclass,
            activeCategoryId: e.currentTarget.dataset.id
        });
    },
    /**
     * 绑定加数量事件
     */
    addCount: function(e) {
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
    cartToArray: function(foodId) {
        var that = this;
        var goods = that.data.goods;
        var cartData = that.data.cartData;
        var cartObjects = that.data.cartObjects;
        var cartFood;
        var cart = {};
        cart.quantity = cartData[foodId];
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].gid == foodId) {
                cartFood = goods[i];
            }
        }
        for (var i = 0; i < cartObjects.length; i++) {
            if (cartObjects[i].cartFood.gid == foodId) {
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
                that.amount();
                return
            }
        }
        cart.cartFood = cartFood;
        cart.quantity = cartData[foodId];
        cartObjects.push(cart)
        that.setData({
            cartObjects: cartObjects,
        });
        that.amount();
        console.log("cartToArray.that.data.cartObjects")
        console.log(that.data.cartObjects)
    },
    /**
     * 绑定减数量事件
     */
    minusCount: function(e) {
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
        // that.cascadePopup();
        if (that.data.maskVisual == 'show') {
            that.cascadeDismiss();
        } else {
            that.cascadePopup();
        }

    },

    cascadePopup: function() {
        var that = this;
        // 购物车打开动画
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-in-out',
        });
        that.animation = animation;
        // scrollHeight为商品列表本身的高度
		var scrollHeight = (that.data.cartObjects.length <= max_row_height ? that.data.cartObjects.length : max_row_height) * food_row_height;
        console.log("scrollHeight")
        console.log(scrollHeight)
        // cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
		var cartHeight = scrollHeight + cart_offset;
        animation.translateY(-cartHeight).step();
        that.setData({
            animationData: that.animation.export(),
            maskVisual: 'show',
            scrollHeight: scrollHeight,
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
            animationMask: that.animationMask.export(),
        });
    },
    cascadeDismiss: function() {
        var that = this;
        // 购物车关闭动画
        that.animation.translateY(that.data.cartHeight).step();
        that.setData({
            animationData: that.animation.export()
        });
        // 遮罩渐变动画
        var animationMask = that.animationMask;
        animationMask.opacity(0).step();
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
    chooseMoal: function(e) {
		// console.log(e)
		var that = this;
		var goodsSpec = e.currentTarget.dataset.goodsspec;
        var cartData = that.data.cartData;
        var chooseObjects = that.data.chooseObjects;
        var goods = that.data.goods;
        var cartFood;
        var cart = {};
        that.setData({
            isModal: true,
            // isChoose: true,
            chooseFoodId: e.currentTarget.dataset.foodId,
			goodsSpec: goodsSpec
        })
        var chooseFoodId = that.data.chooseFoodId;
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].gid == chooseFoodId) {
                cartFood = goods[i];
            }
        }
        for (var i = 0; i < chooseObjects.length; i++) {
            if (chooseObjects[i].cartFood.gid !== chooseFoodId || chooseObjects[i].cartFood.gid == chooseFoodId) {
                chooseObjects.splice(i, 1);
            }
            that.setData({
                chooseObjects: chooseObjects,
            });
        }
        cart.cartFood = cartFood;
        chooseObjects.push(cart);

        that.setData({
            chooseObjects: chooseObjects,
        });
        // console.log("choose.that.data.chooseObjects")
        // console.log(that.data.chooseObjects)
    },
	chooseList: function (e) {
		var that = this;
		console.log(e)
		var goodsSpecIndex = e.currentTarget.dataset.goodsspecIndex;
		// console.log("goodsSpecIndex")
		// console.log(goodsSpecIndex)
		var goodsSpec = that.data.goodsSpec;
		var goodsSpecItem = goodsSpec[goodsSpecIndex];
		// console.log("chooseList.goodsSpecItem")
		// console.log(goodsSpecItem)
		that.setData({
			goodsSpecItem: goodsSpecItem,
			goodsspecIndex: goodsspecIndex
		})
	},
    choosesty: function(e) {
        var that = this;
        console.log(e)
        that.setData({
			itemIndex: e.currentTarget.dataset.itemIndex
		});
		// console.log("that.data.itemIndex")
		// console.log(that.data.itemIndex)
		// var goodsSpecItem = that.data.goodsSpecItem;
		// console.log("choosesty.goodsSpecItem")
		// console.log(goodsSpecItem)
    },
    // 关闭蒙层
    toastClode: function() {
        var that = this;
        that.setData({
            isModal: false
        })
    },
    amount: function() {
        var that = this;
        var cartObjects = that.data.cartObjects;
        var amount = 0;
        var quantity = 0;
        cartObjects.forEach(function(item, index) {
            amount += item.quantity * item.cartFood.sPrice;
            quantity += item.quantity;
        });
        that.setData({
            amount: amount.toFixed(2),
            quantity: quantity
        });
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