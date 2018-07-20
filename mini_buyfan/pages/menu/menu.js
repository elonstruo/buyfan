// pages/menu/menu.js
var order = ['red', 'yellow', 'blue', 'green', 'red']
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        list: [
            {
                img:"../../images/shopimg.jpg",
                name:"樱花碧根果奶缇樱花碧根果奶缇",
                description:"营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果牛奶搭配淡淡香气的",
                sale:"444",
                price:"16.60"
            },
            {
                img: "../../images/shopimg.jpg",
                name: "樱花碧根果奶缇樱花碧根果奶缇",
                description: "营养极高的碧根果牛奶搭配淡淡香气的营养极高的碧根果牛奶搭配淡淡香气的",
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
		console.log(that.data.storesImgList.length)
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
	scroll: function (e) {
		console.log(e)
	},
    tabClick: function(e) {
        var that = this;
        that.setData({
            selectedId: e.currentTarget.dataset.id
        });
	},
	appraisesClick: function (e) {
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
        // const index = e.currentTarget.dataset.index;
        // let carts = this.data.carts;
        // let num = carts[index].num;
        // num = num + 1;
        // carts[index].num = num;
        that.setData({
            // carts: carts,
			hasAddCart: true
        });
        // this.getTotalPrice();
    },

    /**
     * 绑定减数量事件
     */
    minusCount(e) {
        console.log(e)
        const index = e.currentTarget.dataset.index;
        const obj = e.currentTarget.dataset.obj;
        let carts = this.data.carts;
        let num = carts[index].num;
        if (num <= 1) {
            return false;
        }
        num = num - 1;
        carts[index].num = num;
        this.setData({
            carts: carts
        });
        this.getTotalPrice();
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