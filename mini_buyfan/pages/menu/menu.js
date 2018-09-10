// pages/menu/menu.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
const app = getApp()
// 最大行数
var max_row_height = 5;
// 行高
var cart_offset = 60;
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
        appage: 0,
        page: 0,
        cart: {},
        detailsArr: [],
        itemIndex0: 0,
        itemIndex1: 0,
        goodsSpecDetail: [],
        amount: 0,
        isModal: false,
        maskVisual: 'hidden',
        isCartModal: false,
        // cartObjects: [],
        cartData: {},
        chooseObjects: {},
        goodsnum: 1,
        hasCart: false,
        hasAddCart: false,
        hasLike: false,
        likeNum: "",
        // storesImgList: [
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        // ],
        // appraisesImgList: [
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        //     "../../images/shopimg.jpg",
        // ],
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
        // console.log('menu.options')
        // console.log(options)
        that.setData({
            orderway: options.orderway,
            storeId: options.id
        })
        // 获取购物车
        // wx.setStorageSync("cartObjectsStorage", [])

        // if (app.globalData.cartObjectsStorage) {
        //     var cart = that.data.cart
            that.setData({
                cartObjects: [],
            })
        //     var cartObjects = that.data.cartObjects
        //     var cart = that.data.cart
        //     var foodId = []
        //     for (var i = 0; i < cartObjects.length; i++) {
        //         cart[cartObjects[i].gid] = cartObjects[i].num
        //         that.setData({
        //             cart: cart
        //         })
        //     }
        //     that.amount();
        // }
        // 个人信息
        if (app.globalData.userInfo) {
            // console.log("menu.app.globalData.userInfo")
            // console.log(app.globalData.userInfo)
            var uid = app.globalData.userInfo.data.uid;
            that.setData({
                uid: uid
            })
        }
        // 分类赋值
        if (app.globalData.actionData) {
            var actionData = app.globalData.actionData
            var appLogo = app.globalData.actionData.appLogo
            that.setData({
                type_sort: actionData.appClass,
                categoryGoodsclass: actionData.appClass[0],
                screenWidth: app.screenWidth,
                screenHeight: app.screenHeight,
                // cartItem: app.screenHeight * 0.089788732394366,
                // topItem: app.screenHeight * 0.051056338028169,
                // cartBarItem: app.screenHeight * 0.073943661971831,
                // mesuScrollHeight: app.screenHeight - signH - tabbarH - food_row_height,
                mesuScrollHeight: app.screenHeight - signH - tabbarH,
                appLogo: appLogo
            })
        } else {
            app.actionDataCallback = res => {
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
        }
        // 商家分店
        if (app.globalData.storesData) {
            var storesData = app.globalData.storesData
            var storestring = JSON.stringify(storesData);
            that.setData({
                storestring: storestring,
                storesData: storesData
            })
        } else {
            app.storesDataCallback = res => {
                var storesData = app.globalData.storesData
                var storestring = JSON.stringify(storesData);
                that.setData({
                    storestring: storestring,
                    storesData: storesData
                })
            }
        }
        // 商店id
        if (options.id) {
            var storeId = options.id;
            that.showStore(storeId)
        }
        // 所有商品
        that.getGoods()
    },
    // 所有商品
    getGoods: function() {
        var that = this;
        wx.showLoading({
            title: '菜单加载中…',
            mask: true,
        })
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
                wx.hideLoading()
            },
            fail: function(res) {
                app.showBox("网络出错！")
            },
            complete: function(res) {},
        })
    },
    // 传入分店id显示分店
    showStore: function(storeId) {
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
    //切换分店
    changeshop: function() {
        var that = this;
        wx.navigateTo({
            url: '../stores/stores?stores=' + that.data.storestring + '&orderway=' + that.data.orderway,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 图片预览
    previewImage: function(e) {
        var that = this;
        var commentimg = e.currentTarget.dataset.commentimg
        var appraisesImgsrc = that.data.appraisesImgsrc
        wx.previewImage({
            current: appraisesImgsrc,
            urls: commentimg
        })
    },
    // 图片预览index
    getAppraisesIndex: function(e) {
        var that = this;
        var imgsrc = e.currentTarget.dataset.imgsrc
        that.setData({
            appraisesImgsrc: imgsrc
        })
    },
    // tabbar触发请求评价列表
    tabClick: function(e) {
        var that = this;
        that.setData({
            selectedId: e.currentTarget.dataset.id
        });
        if (that.data.selectedId == "2") {
            wx.request({
                url: 'https://app.jywxkj.com/shop/baifen/request/commentmanage.php',
                data: {
                    action: 'xcxshow',
                    page: that.data.page,
                    uid: that.data.uid
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                success: function(res) {
                    if (res.statusCode == "200") {
                        var comments = res.data.data
                        for (var i = 0; i < comments.length; i++) {
                            that.setData({
                                likenum: comments[i].likenum
                            })
                        }
                        console.log('likenum')
                        console.log(that.data.likenum)
                        that.setData({
                            comments: comments
                        })
                    }
                },
                fail: function(res) {},
                complete: function(res) {},
            })
        }
    },
    // 评价：最新/最热
    appraisesClick: function(e) {
        var that = this;
        that.setData({
            selectA: e.currentTarget.dataset.id
        });
    },
    // 点赞
    likeClick: function(e) {
        var that = this;
        var cid = e.currentTarget.dataset.cid;
        var comments = that.data.comments;
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/commentmanage.php',
            data: {
                action: 'commentlike',
                uid: that.data.uid,
                cid: cid
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: function(res) {
                console.log('likeClick')
                console.log(res)
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].cid == cid) {
                        if (comments[i].likestate == 1) {
                            app.showBox("您已点赞")
                        } else {
                            that.setData({
                                likenum: ++comments[i].likenum,
                            })
                        }
                    }
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
        // if (that.data.hasLike == false) {
        //     that.setData({
        //         likeNum: that.data.likeNum + 1,
        //         hasLike: true
        //     })
        // } else {
        //     that.setData({
        //         likeNum: that.data.likeNum - 1,
        //         hasLike: false
        //     })
        // }
    },
    // 商家店铺照片
    scroll: function(e) {
        // console.log(e)
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
        var that = this;
        var foodId = e.currentTarget.dataset.foodId;
        var chooseObjects
        if (e.currentTarget.dataset.chooseobjects) {
            chooseObjects = e.currentTarget.dataset.chooseobjects
        } else {
            chooseObjects = that.data.chooseObjects
        }
        // 读取目前购物车数据
        var cart = that.data.cart;
        // 获取当前商品数量
        var foodCount = cart[foodId] ? cart[foodId] : 0;
        // 自增1后存回
        cart[foodId] = ++foodCount;
        that.setData({
            cart: cart
        });
        var cartObjects = that.data.cartObjects;
        var cartData = that.data.cartData;
        var goodsSpecDetail;
        var num = 1;
        var goods = that.data.goods
        var goodsSpecLength = e.currentTarget.dataset.goodsSpec;
        var oroginDetails;
        var detailsArr = that.data.detailsArr;
        if (chooseObjects.length > 0) {
            chooseObjects = that.data.chooseObjects
        }
        if (goodsSpecLength !== null && goodsSpecLength !== undefined && goodsSpecLength !== "null" && goodsSpecLength.length >= 1) {
            cartData = {
                gid: chooseObjects.gid,
                name: chooseObjects.name,
                img: chooseObjects.img,
                price: chooseObjects.price,
                goodsSpec: goodsSpecLength,
                spec: chooseObjects.spec,
                num: num,

            }
            goodsSpecDetail = that.data.goodsSpecDetail;
            if (cartObjects.length !== 0) {
                for (var i = 0; i < cartObjects.length; i++) {
                    if (cartObjects[i].gid == foodId) {
                        cartObjects[i].quantity = cart[foodId];
                    }
                    if (cartObjects[i].gid == foodId && cartObjects[i].spec == chooseObjects.spec) {
                        cartObjects[i].num = ++cartObjects[i].num;
                        cartData = cartObjects[i];
                        cartObjects.splice(i, 1);
                    }
                }
            }
            cartObjects.push(cartData)
            that.setData({
                cartObjects: cartObjects,
                chooseObjects: cartData,
            })
            that.amount()
            wx.setStorage({
                key: 'cartObjectsStorage',
                data: cartObjects,
                success: function(res) {
                    app.cartStorage()
                },
                fail: function(res) {},
                complete: function(res) {},
            })

        } else {
            for (var i = 0; i < goods.length; i++) {
                if (goods[i].gid == foodId) {
                    var cartFood = goods[i];
                }
            }

            cartData = {
                gid: cartFood.gid,
                name: cartFood.goodsName,
                img: cartFood.goodsImage,
                price: cartFood.sPrice,
                num: num
            }

            if (cartObjects.length > 1) {
                for (var i = 0; i < cartObjects.length; i++) {
                    if (cartObjects[i].gid == foodId) {
                        cartObjects[i].num = ++cartObjects[i].num;
                        cartData = cartObjects[i]
                        cartObjects.splice(i, 1);

                    }
                }
            }
            cartObjects.push(cartData)
            that.setData({
                cartObjects: cartObjects,
                cart: cart
            })
            that.amount()
            // console.log("cart")
            // console.log(that.data.cart)
            // console.log("cartObjects")
            // console.log(cartObjects)
            wx.setStorage({
                key: 'cartObjectsStorage',
                data: cartObjects,
                success: function(res) {
                    app.cartStorage()
                },
                fail: function(res) {},
                complete: function(res) {},
            })
        }
    },
    /**
     * 绑定减数量事件
     */
    minusCount: function(e) {
        // console.log(e)
        var that = this;
        var foodId = e.currentTarget.dataset.foodId;
        var cartData = that.data.cartData;
        // 读取目前购物车数据
        var cart = that.data.cart;
        // 获取当前商品数量
        var foodCount = cart[foodId];
        // 自减1
        --foodCount;
        // 减到零了就直接移除
        if (foodCount == 0) {
            delete cart[foodId]
        } else {
            cart[foodId] = foodCount;
        }
        // 设值到data数据中
        that.setData({
            cart: cart
        });
        var cartObjects = that.data.cartObjects;
        var chooseObjects = e.currentTarget.dataset.chooseobjects;

        if (chooseObjects) {
            for (var i = 0; i < cartObjects.length; i++) {
                if (cartObjects[i].gid == foodId && cartObjects[i].spec == chooseObjects.spec) {
                    cartObjects[i].num = --cartObjects[i].num;
                    chooseObjects.num = cartObjects[i].num;
                    cart[foodId] = cartObjects[i].num;
                    if (cartObjects[i].num == 0) {
                        cartObjects.splice(i, 1);
                        chooseObjects.num = "";
                    }
                }
                that.setData({
                    cartObjects: cartObjects,
                    chooseObjects: chooseObjects
                })
                that.amount()
                wx.setStorage({
                    key: 'cartObjectsStorage',
                    data: cartObjects,
                    success: function(res) {
                        app.cartStorage()
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                })
            }
        } else {
            for (var i = 0; i < cartObjects.length; i++) {
                if (cartObjects[i].gid == foodId) {
                    cartObjects[i].num = --cartObjects[i].num;
                    cart[foodId] = cartObjects[i].num;
                    if (cartObjects[i].num == 0) {
                        cartObjects.splice(i, 1);
                    }
                }
                that.setData({
                    cartObjects: cartObjects,
                })
                that.amount()
                wx.setStorage({
                    key: 'cartObjectsStorage',
                    data: cartObjects,
                    success: function(res) {
                        app.cartStorage()
                    },
                    fail: function(res) {},
                    complete: function(res) {},
                })
            }
        }

    },
    //切换购物车开与关
    cascadeToggle: function() {
        var that = this;
        // that.cascadePopup();
        if (that.data.isCartModal == true) {
            that.cascadeDismiss();
        } else {
            that.cascadePopup();
        }

    },
    cascadePopup: function() {
        var that = this;
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
        // 购物车动画
        var animationCart = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
        });
        that.animationCart = animationCart;
        animationCart.opacity(1).step();
        that.setData({
            animationCart: that.animationCart.export(),
        });
        // 隐藏遮罩层
        that.setData({
            isCartModal: true
        });
    },
    cascadeDismiss: function() {
        var that = this;
        // 购物车关闭动画
        var animationCart = that.animationCart;
        animationCart.opacity(0).step();
        that.animationCart = animationCart;
        that.setData({
            animationCart: that.animationCart.export()
        });
        // 遮罩渐变动画
        var animationMask = that.animationMask;
        animationMask.opacity(0).step();
        that.setData({
            animationMask: that.animationMask.export(),
        });
        // 隐藏遮罩层
        that.setData({
            isCartModal: false
        });
    },
    // 结算
    toTakeOut: function() {
        var that = this;
        var cartObjects = JSON.stringify(that.data.cartObjects);
        var orderway = that.data.orderway;
        var storeId = that.data.storeId;
        wx.navigateTo({
            url: '../../pages/order-submit/order-submit?orderway=' + orderway + '&storeId=' + storeId,
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
    // 规格弹窗
    chooseMoal: function(e) {
        // console.log(e)
        var that = this;
        var cartData = that.data.cartData;
        var chooseObjects = {};
        var cartObjects = that.data.cartObjects;
        var goods = that.data.goods;
        var cartFood;
        var goodsSpec
        // var cart = {};
        var num = 0;
        var chooseFoodId = e.currentTarget.dataset.foodId;
        that.setData({
            isModal: true,
            chooseFoodId: chooseFoodId,
            itemIndex0: 0,
            itemIndex1: 0,
        });
        for (var i = 0; i < goods.length; i++) {
            if (goods[i].gid == chooseFoodId) {
                cartFood = goods[i];
            }
        }
        chooseObjects.gid = cartFood.gid;
        chooseObjects.name = cartFood.goodsName;
        chooseObjects.img = cartFood.goodsImage;
        chooseObjects.price = cartFood.sPrice;
        chooseObjects.goodsSpec = cartFood.goodsSpec;
        if (chooseObjects.goodsSpec.length > 1) {
            chooseObjects.spec = cartFood.goodsSpec[0].detail[that.data.itemIndex0].name + "," + cartFood.goodsSpec[1].detail[that.data.itemIndex1].name;
        } else {
            chooseObjects.spec = cartFood.goodsSpec[0].detail[that.data.itemIndex0].name;
        }
        if (cartObjects.length !== 0) {
            for (var i = 0; i < cartObjects.length; i++) {
                if (cartObjects[i].gid == chooseFoodId && cartObjects[i].spec == chooseObjects.spec) {
                    chooseObjects = cartObjects[i]
                }
            }
        }
        that.setData({
            chooseObjects: chooseObjects,
        });
        // console.log('chooseMoal.chooseObjects')
        // console.log(chooseObjects)
    },
    // 具体规格
    choosesty0: function(e) {
        var that = this;
        var cartObjects = that.data.cartObjects
        var itemIndex = e.currentTarget.dataset.itemIndex
        that.setData({
            itemIndex0: itemIndex,
        })
        var chooseObjects = that.data.chooseObjects;
        var chooseObj = {};
        var foodId = chooseObjects.gid
        chooseObj.gid = chooseObjects.gid;
        chooseObj.name = chooseObjects.name;
        chooseObj.img = chooseObjects.img;
        chooseObj.price = chooseObjects.price;
        chooseObj.goodsSpec = chooseObjects.goodsSpec;
        if (chooseObjects.goodsSpec.length > 1) {
            chooseObj.spec = chooseObjects.goodsSpec[0].detail[itemIndex].name + ',' + chooseObjects.goodsSpec[1].detail[that.data.itemIndex1].name;
        } else {
            chooseObj.spec = chooseObjects.goodsSpec[0].detail[itemIndex].name;
        }
        if (cartObjects.length !== 0) {
            for (var i = 0; i < cartObjects.length; i++) {
                if (cartObjects[i].gid == foodId && cartObjects[i].spec == chooseObj.spec) {
                    chooseObj = cartObjects[i]
                }
            }
        }
        that.setData({
            chooseObjects: chooseObj
        })
    },
    // 具体规格第二种
    choosesty1: function(e) {
        var that = this;
        var cartObjects = that.data.cartObjects;
        var itemIndex = e.currentTarget.dataset.itemIndex
        that.setData({
            itemIndex1: itemIndex
        })
        var chooseObjects = that.data.chooseObjects;
        var chooseObj = {};
        var foodId = chooseObjects.gid
        chooseObj.gid = chooseObjects.gid;
        chooseObj.name = chooseObjects.name;
        chooseObj.img = chooseObjects.img;
        chooseObj.price = chooseObjects.price;
        chooseObj.goodsSpec = chooseObjects.goodsSpec;
        chooseObj.spec = chooseObjects.goodsSpec[0].detail[that.data.itemIndex0].name + "," + chooseObjects.goodsSpec[1].detail[that.data.itemIndex1].name;
        if (cartObjects.length !== 0) {
            for (var i = 0; i < cartObjects.length; i++) {
                if (cartObjects[i].gid == foodId && cartObjects[i].spec == chooseObj.spec) {
                    chooseObj = cartObjects[i]
                }
            }
        }
        that.setData({
            chooseObjects: chooseObj
        })
    },
    // 关闭蒙层
    toastClode: function() {
        var that = this;
        that.setData({
            isModal: false,
            // chooseObjects: []
        })
    },
    // 清空购物车
    deleteCart: function() {
        var that = this;
        var cartObjects = [];
        wx.setStorageSync('cartObjectsStorage', cartObjects)
        that.setData({
            cartObjects: cartObjects,
            amount: "0.00",
            num: "",
            cart: {}
        });
        that.amount()

        wx.setStorage({
            key: 'cartObjectsStorage',
            data: cartObjects,
            success: function(res) {
                app.cartStorage()
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 商品总数
    amount: function(cartObjects) {
        var that = this;
        var cartObjects = that.data.cartObjects;
        var amount = 0;
        var num = 0;
        cartObjects.forEach(function(item, index) {
            amount += item.num * item.price;
            num += item.num;
        });
        that.setData({
            amount: amount.toFixed(2),
            num: num
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
        var that = this;
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
            to: [{
                latitude: that.data.shopLatitude,
                longitude: that.data.shopLongitude
            }],
            success: function(res) {
                // console.log("demo.calculateDistance");
                // console.log(res);
                var distance = app.commafy(res.result.elements[0].distance);
                var duration = that.SecondToDate(res.result.elements[0].duration);
                that.setData({
                    distance: distance,
                    duration: duration
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
    SecondToDate: function(msd) {
        var time = msd
        if (null != time && "" != time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + "秒";
            } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            } else if (time >= 60 * 60 * 24) {
                time = parseInt(time / 3600.0 / 24) + "天" + parseInt((parseFloat(time / 3600.0 / 24) -
                        parseInt(time / 3600.0 / 24)) * 24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            } else {
                time = parseInt(time) + "秒";
            }
        }
        return time;
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