// pages/edtiAddressed/edtiAddressed.js
const app = getApp()
var telReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var addtessItem = JSON.parse(options.item)
		var userInforIndex = options.userInforIndex
        console.log(addtessItem)
        that.setData({
            addtessItem: addtessItem,
            username: addtessItem.username,
            tel: addtessItem.tel,
            // currInfo: addtessItem.currInfo,
			adr: addtessItem.adr,
            latitude: addtessItem.latitude,
            longitude: addtessItem.longitude,
			userInforIndex: userInforIndex
        })
        var key = wx.getStorageSync('key');
        that.setData({
            key: key
        })
        // 地址内容
        wx.getStorage({
            key: 'userInforAddress',
            success: function(res) {
                if (res.data !== "" || res.data !== null || res.data !== "undefined") {
                    var userInforArr = res.data
                    that.setData({
                        userInforArr: userInforArr
                    })
                } else {
                    userInforArr = []
                    that.setData({
                        userInforArr: userInforArr
                    })
                }
            },
            fail: function(res) {},
            complete: function(res) {},
        })
    },
    // 提交地址
    edtiAddress: function(e) {
        var that = this;
        // console.log('form发生了submit事件，携带数据为：', e.detail.value);
        var userInforForm = e.detail.value;
        // userInforForm['adr'] = that.data.adr;
        userInforForm['latitude'] = that.data.latitude;
        userInforForm['longitude'] = that.data.longitude;
		console.log('userInforForm')
		console.log(userInforForm)
        if (userInforForm.username == that.data.addtessItem.username &&
            userInforForm.tel == that.data.addtessItem.tel &&
            userInforForm.latitude == that.data.addtessItem.latitude &&
            userInforForm.longitude == that.data.addtessItem.longitude &&
			userInforForm.adr == that.data.addtessItem.adr) {
            wx.navigateBack({
                delta: 1,
            })
        } else {
            var username = userInforForm.username;
            var tel = userInforForm.tel;
            var adr = userInforForm.adr;
            var latitude = userInforForm.latitude;
            var longitude = userInforForm.longitude;
            if (!username) {
                app.showBox("请输入姓名")
                return
            } else if (!tel) {
                app.showBox("请输入手机号码")
                return
            } else if (!telReg.test(tel)) {
                app.showBox("请输入正确的手机号码")
                return
            } else if (!adr) {
                app.showBox("请选择正确地址")
                return
            } else if (!latitude) {
                app.showBox("请选择正确地址")
                return
            }
            var userInforArr = that.data.userInforArr;
			userInforArr.splice(that.data.userInforIndex, 1, userInforForm);
            wx.request({
                url: 'https://app.jywxkj.com/shop/baifen/request/usermanage.php',
                data: {
                    action: 'modifyadr',
                    key: that.data.key,
                    userInfor: JSON.stringify(userInforArr)
                },
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function(res) {
                    console.log("添加地址");
                    console.log(res);
                    console.log('edtiAddress.userInforArr')
                    console.log(userInforArr)
                    wx.setStorage({
                        key: 'userInforAddress',
                        data: userInforArr,
                        success: function(res) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        },
                        fail: function(res) {},
                        complete: function(res) {},
                    })
                },
                fail: function(res) {},
                complete: function(res) {},
            })
        }
    },
    // 地址定位
    taplocation: function() {
        var that = this;
        wx.showLoading({
            title: '加载中'
        })
        setTimeout(function() {
            wx.hideLoading()
        }, 2000)
        wx.chooseLocation({
            success: function(res) {
                console.log("地址定位")
                console.log(res)
                that.setData({
                    adr: res.name,
                    latitude: res.latitude,
                    longitude: res.longitude,
                })
            },
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
    onShow: function() {},

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