
		// console.log("that.data.goodsspecIndex")
		// console.log(that.data.goodsspecIndex)
		var goodsspecIndex = that.data.goodsspecIndex;
		var chooseObjects = that.data.chooseObjects;
		// console.log("choosesty.chooseObjects")
		// console.log(chooseObjects)
		var goodsSpec = chooseObjects[0].cartFood.goodsSpec;
		var GoodsSpecDetailL = chooseObjects[0].cartFood.goodsSpecDetail;
		var itemIndex = e.currentTarget.dataset.itemIndex;
		var itemName = e.currentTarget.dataset.itemName;
		var goodsSpecDetail = that.data.goodsSpecDetail;
		var detailL = that.data.choosestyList.detailL;
		// detail.push(goodsSpec[goodsspecIndex].detail[itemIndex].name)
		detailL[0] = goodsSpec[0].detail[itemIndex].name;
		if (goodsSpec[1]) {
			detailL[1] = goodsSpec[1].detail[itemIndex].name;
		}
		// for (var i = 0; i < goodsSpec[goodsspecIndex].detail.length; i++) {
		// 	for (var j = 0; j < goodsSpec.length; j++) {
		// 		if (goodsspecIndex == i && detail.length>1) {
		// 			detail.splice(i, 1);
		// 		}
		// 	}
		// }
		// console.log("that.data.choosestyList.detail")
		// console.log(that.data.choosestyList.detail)
		// console.log(goodsSpec)
		// console.log("goodsSpec")
		// for (var i = 0; i < goodsSpec.length; i++) {
		// 	goodsSpec[i].detail
			// for (var j = 0; j < goodsSpec[goodsspecIndex].detail.length; j++) {
			// 	if (goodsspecIndex == i && detail.length>1) {
			// 		detail.splice(j, 1);
			// 	}
			// }
		// }
		console.log("goodsSpec.detail")
		console.log(detailL)
		goodsSpecDetail.push(that.data.choosestyList)
		if (that.data.choosestyList.detailL.length > 1 || goodsSpecDetail.length > 1) {
			for (var i = 0; i < goodsSpecDetail.length;i++) {
				goodsSpecDetail.splice(i, 1);
			}
		}
		that.setData({
			goodsSpecDetailL: goodsSpecDetail
		})
		console.log("goodsSpecDetailL")
		console.log(goodsSpecDetailL)