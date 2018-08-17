// pages/menu/menu.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
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
        itemIndex0: 0,
        itemIndex1: 0,
        goodsSpecDetail: [],
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
        // console.log("menu.options")
        // console.log(options)
        // 分类赋值
        if (app.globalData.actionData) {
            var actionData = app.globalData.actionData
            var appLogo = app.globalData.actionData.appLogo
            that.setData({
                type_sort: actionData.appClass,
                categoryGoodsclass: actionData.appClass[0],
                // mesuScrollHeight: app.screenHeight - signH - tabbarH - food_row_height,
                mesuScrollHeight: app.screenHeight - signH - tabbarH,
                appLogo: appLogo
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
        var storeId = options.id;
        for (var i = 0; i < storesData.length; i++) {
            if (storesData[i].id == storeId) {
                var stores = storesData[i]
            }
        }
        // console.log("stores = storesData[i]")
        // console.log(stores)
        that.setData({
            stores: stores,
            shopLatitude: stores.shopLocal.latitude,
            shopLongitude: stores.shopLocal.longitude
        })
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
                })

                console.log("goods")
                console.log(that.data.goods)
                // for (var i = 0; i < goods.length; i++) {
                // 	if (goods[i].goodsclass) {
                // 		var goodsItem = goods[i]
                // 		console.log("goodsItem")
                // 		console.log(goodsItem)
                // 	}
                // }


            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    changeshop: function() {
        var that = this;
        wx.navigateTo({
            url: '../stores/stores?stores=' + that.data.storestring,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    previewImage: function() {
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
    scroll: function(e) {
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
        // console.log(e)
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
        var goodsSpecDetail = that.data.goodsSpecDetail;
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
        var goodsSpec;
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
        goodsSpec = cartFood.goodsSpec;
        if (goodsSpec.length > 1) {
            that.chooseList0();
            that.chooseList1();
            cart.goodsSpecDetail = that.data.goodsSpecDetail;
        } else if (goodsSpec.length == 1) {
            that.chooseList0();
            cart.goodsSpecDetail = that.data.goodsSpecDetail;
        }
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
        var cartData = that.data.cartData;
        var chooseObjects = that.data.chooseObjects;
        var goods = that.data.goods;
        var cartFood;
        var goodsSpec
        var cart = {};
        var chooseFoodId = e.currentTarget.dataset.foodId;
        that.setData({
            isModal: true,
            chooseFoodId: chooseFoodId,
        })
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].gid == chooseFoodId) {
                cartFood = goods[i];
            }
        }
        cart.cartFood = cartFood;
        cart.quantity = cartData[chooseFoodId];
        goodsSpec = cartFood.goodsSpec;
        chooseObjects.push(cart);
        that.setData({
            chooseObjects: chooseObjects,
            goodsSpec: goodsSpec,
            itemIndex0: 0,
            itemIndex1: 0,
            
        });
        console.log("choose.that.data.chooseObjects")
        console.log(that.data.chooseObjects)
    },
    chooseList0: function() {
        var that = this;
        var goodsSpec = that.data.goodsSpec;
        var goodsSpec0 = goodsSpec[0];
        var goodsSpecDetail = that.data.goodsSpecDetail;
        var itemIndex0 = that.data.itemIndex0;
        var chooseLists = {
            "detail": goodsSpec0.detail[itemIndex0].name
        }
        goodsSpecDetail.push(chooseLists)
        if (goodsSpecDetail.length > 1) {
            for (var i = 0; i < goodsSpecDetail.length; i++) {
                goodsSpecDetail.splice(i, 1);
            }
        }
        that.setData({
            goodsSpecDetail: goodsSpecDetail
        })
        console.log("goodsSpecDetail")
        console.log(that.data.goodsSpecDetail)
    },
    chooseList1: function() {
        var that = this;
        var goodsSpec = that.data.goodsSpec;
        var goodsSpec0 = goodsSpec[0];
        var goodsSpec1 = goodsSpec[1];
        var goodsSpecDetail = that.data.goodsSpecDetail;
        var chooseLists = {
            "detail": goodsSpec0.detail[that.data.itemIndex0].name + "," + goodsSpec1.detail[that.data.itemIndex1].name
        }
        goodsSpecDetail.push(chooseLists)
        if (goodsSpecDetail.length > 1) {
            for (var i = 0; i < goodsSpecDetail.length; i++) {
                goodsSpecDetail.splice(i, 1);
            }
            that.setData({
                goodsSpecDetail: goodsSpecDetail
            })
        }
        console.log("goodsSpecDetail")
        console.log(that.data.goodsSpecDetail)
    },
    choosesty0: function(e) {
        var that = this;
        var itemIndex = e.currentTarget.dataset.itemIndex
        that.setData({
            itemIndex0: itemIndex
        })
    },
    choosesty1: function(e) {
        var that = this;
        var itemIndex = e.currentTarget.dataset.itemIndex
        that.setData({
            itemIndex1: itemIndex
        })
    },
    // 关闭蒙层
    toastClode: function() {
        var that = this;
        that.setData({
            isModal: false,
            chooseObjects: []
        })
    },
    amount: function (cartObjects) {
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
    //js数字千分符处理
    commafy: function(num) {　　
        num = num + "";　　
        var re = /(-?\d+)(\d{3})/　　
        while (re.test(num)) {　　　　
            num = num.replace(re, "$1.$2")　　
        }　　
        return num;
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
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
            success: function(res) {
                // console.log("demo.calculateDistance");
                // console.log(res);
                var distance = that.commafy(res.result.elements[0].distance);
                that.setData({
                    distance: distance
                })
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