// pages/menu/menu.js
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({

    /**
     * 页面的初始数据
     */
    data: {
        maskVisual: 'hidden',
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
        type_sort: ["特价", "销量好评", "商家推荐"],
        list: [{
				id: "1",
                img: "../../images/shopimg.jpg",
                name: "樱花碧根果奶缇樱花碧根果奶缇",
                description: "营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果",
                sale: "444",
                price: "16.60",
				goodsnum: 1
            },
            {
				id: "12"	,
                img: "../../images/shopimg.jpg",
                name: "樱花碧根果奶缇樱花碧根果奶缇",
                description: "营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果",
                sale: "444",
                price: "16.60",
				goodsnum: 1
            }
        ],

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.createSelectorQuery().select('.carts-list').boundingClientRect(function(rect) {
            that.setData({
				cartHeight: rect.height // 节点的高度
            })
        }).exec()
    },
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
    scroll: function(e) {
        console.log(e)
    },
    tabClick: function(e) {
        var that = this;
        that.setData({
            selectedId: e.currentTarget.dataset.id
        });
    },
    appraisesClick: function(e) {
        var that = this;
        that.setData({
            selectA: e.currentTarget.dataset.id
        });
    },
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
    addCount(e) {
        var that = this;
        // 所点商品id
        var foodId = e.currentTarget.dataset.id;
        // console.log(foodId);
        // 读取目前购物车数据
        var cartData = that.data.cartData;
        // 获取当前商品数量
        var foodCount = cartData[foodId] ? cartData[foodId] : 0;
        // 自增1后存回
        cartData[foodId] = ++foodCount;
        // 设值到data数据中
        that.setData({
            cartData: cartData
        });
        // 转换成购物车数据为数组
        // that.cartToArray(foodId);
    },

    /**
     * 绑定减数量事件
     */
	minusCount(e) {
        var that = this;
        // 所点商品id
        var foodId = e.currentTarget.dataset.id;
        // 读取目前购物车数据
        var cartData = that.data.cartData;
        // 获取当前商品数量
        var foodCount = cartData[foodId];
        // 自减1
        --foodCount;
        // 减到零了就直接移除
        if (foodCount == 0) {
            delete cartData[foodId]
        } else {
            cartData[foodId] = foodCount;
        }
        // 设值到data数据中
        that.setData({
            cartData: cartData
        });
    },
    cascadeToggle: function () {
        var that = this;
        //切换购物车开与关
        // console.log(that.data.maskVisual);
        if (that.data.maskVisual == 'show') {
            that.cascadeDismiss();
        } else {
            that.cascadePopup();
        }
    },
    cascadePopup: function () {
        var that = this;
        // 购物车打开动画
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-in-out',
        });
        that.animation = animation;
        // scrollHeight为商品列表本身的高度
        var scrollHeight = (that.data.cartObjects.length <= max_row_height ? that.data.cartObjects.length : max_row_height) * food_row_height;
        // cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
        var cartHeight = scrollHeight + cart_offset;
        animation.translateY(- cartHeight).step();
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
        animationMask.opacity(0.8).step();
        that.setData({
            animationMask: that.animationMask.export(),
        });
    },
    cascadeDismiss: function () {
        var that = this;
        // 购物车关闭动画
        that.animation.translateY(that.data.cartHeight).step();
        that.setData({
            animationData: that.animation.export()
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