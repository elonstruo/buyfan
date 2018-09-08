// pages/appraise/appraise.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgList: [],
        imgIdList: '',
        upLoadImgNum: 0,
        imgl: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var ordernum = options.ordernum
        that.setData({
            ordernum: ordernum
        })
        // app.globalData.userInfo
        if (app.globalData.userInfo) {
            var userInfo = app.globalData.userInfo
            var userImg = userInfo.data.avatarUrl;
            var username = userInfo.data.nickName;
            var openid = userInfo.data.uid;
            that.setData({
                userImg: userImg,
                username: username,
                openid: openid,
            })
        }
    },

    addimg: function(e) {
        var that = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                that.setData({
                    imgList: that.data.imgList.concat(tempFilePaths)
                });
                console.log('tempFilePaths')
                console.log(tempFilePaths)
            }
        })
    },
    // 评论
    appraise: function(e) {
        var that = this;
        console.log('imgList')
        console.log(that.data.imgList)
        // console.log('form发生了submit事件，携带数据为：', e.detail.value);
        var content = e.detail.value.appraiseText;
        that.setData({
            content: content
        })
        if (that.data.imgList.length > 0) {
            that.imgup()
        } else {
            that.textup(content)
        }
    },
    // 评论有图片上传
    imgup: function() {
        var that = this;
        var content = that.data.content
        var imgListdemo = that.data.imgList
        var i = imgListdemo.length - 1;
        console.log('imgListdemo[i]')
        console.log(imgListdemo[i])
        // 评论图片上传
        wx.uploadFile({
            url: 'https://app.jywxkj.com/shop/baifen/request/commentmanage.php',
            filePath: imgListdemo[i],
            formData: {
                action: 'upimg',
            },
            name: 'myfile',
            success: function(res) {
                console.log('imgup.res')
                console.log(res)
                var imgData = JSON.parse(res.data)
                var imgl = that.data.imgl;
                imgl.push(imgData.img)
                that.setData({
                    imgl: imgl
                })
                if (imgListdemo.length) {
                    imgListdemo.splice(i, 1)
                    console.log('imgListdemo.splice')
                    console.log(imgListdemo)
                    if (imgListdemo.length > 0) {
                        that.setData({
                            imgListdemo: imgListdemo
                        })
                        that.imgup()
                    } else {
                        console.log('0finish.imgl')
                        console.log(imgl)
                        that.setData({
                            img: imgl
                        })
                        that.textup(content)
                    }
                } else {
                    console.log('1finish.imgl')
                    console.log(imgl)
                    that.setData({
                        img: imgl
                    })
                }
            }
        })
    },
    textup: function(text) {
        var that = this;
        wx.request({
            url: 'https://app.jywxkj.com/shop/baifen/request/commentmanage.php',
            data: {
                action: 'commentadd',
                userImg: that.data.userImg,
                username: that.data.username,
                content: text,
                commentImg: JSON.stringify(that.data.img),
                ordernum: that.data.ordernum,
                openid: that.data.openid,
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'post',
            success: function(res) {
                wx.hideLoading()
                wx.showModal({
                    content: '评价成功！',
                    showCancel: true,
                    cancelText: '返回订单',
                    cancelColor: '#333',
                    confirmText: '查看评价',
                    confirmColor: '#333',
                    success: function(res) {
                        if (res.confirm == true) {
                            wx.redirectTo({
                                url: '../menu/menu',
                                success: function(res) {},
                                fail: function(res) {},
                                complete: function(res) {},
                            })
                        } else {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    },
                    fail: function(res) {
                        console.log('fail.res')
                        console.log(res)
                    },
                    complete: function(res) {},
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