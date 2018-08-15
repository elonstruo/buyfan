var app = getApp()
var adrID; //当前操作地址id
var username;
var tel;
var adr;
Page({
    data: {},
    onLoad: function(options) {
        var that = this;
        app.getUserInfo(function(userdata) {
            that.setData({
                userInfor: userdata.userInfor
            })
        })
    },
    inputname: function(e) {
        username = e.detail.value;
    },
    inputtel: function(e) {
        tel = e.detail.value;
    },
    inputadr: function(e) {
        adr = e.detail.value;
    },
    addadr: function() {
        var that = this;
        var userInfor = that.data.userInfor;
        var newadr = {
            username: username,
            tel: tel,
            adr: adr
        };
        if (userInfor == '' || userInfor == null) {
            userInfor = [newadr];
        } else {
            userInfor[userInfor.length] = newadr;
        }
        that.adrsave(userInfor)
    },
    modifyadr: function() {
        var that = this;
        var userInfor = that.data.userInfor;
        userInfor[adrID].username = username;
        userInfor[adrID].tel = tel;
        userInfor[adrID].adr = adr;
        if (userInfor == '' || userInfor == null) {
            userInfor = [newadr];
        } else {
            userInfor[userInfor.length] = newadr;
        }
        that.adrsave(userInfor);
    },
    deleteadr: function(e) {
        var that = this;
        var i = e.currentTarget.dataset.index; //当前操作的第几条地址
        var userInfor = that.data.userInfor.splice(i, 1);
        that.adrsave(userInfor);
    },
    defaultadr: function(e) {
        var that = this;
        var i = e.currentTarget.dataset.index; //当前操作的第几条地址
        var userInfor = that.data.userInfor;
        var a = userInfor[i];
        userInfor[i] = userInfor[0];
        userInfor[0] = a;
        that.adrsave(userInfor);
    },
    adrsave: function(userInfor) {
        wx.request({
            url: '',
            data: {
                userInfor: JSON.stringify(userInfor)
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            success: function(res) {},
        })
    },
})