mui.init({
	keyEventBind:{
		backbutton:false,
		menubutton:false
	}
})

mui.plusReady(function(){
	resetPage();
	qiao.on('.addItemBtn','tap',addItem);
})

function resetPage(){
	$("#addTitle").val("");
	$("addContent").val("");
}

function addItem(){
	var title = $.trim($("#addTitle").val());
	var content = $.trim($("#addContent").val()).replace(/\n/g,'<br/>');
	if(!title){
		qiao.h.alert("请填写待办事项标题")
	}else{
		//添加完成后，隐藏掉添加界面
		qiao.h.getPage('add').hide()
		//清空界面中输入框的值
		resetPage()
		//添加的操作并没有在add界面执行，而是提交一个请求，让list.html界面来执行
		//子给父  用自定义的事件
		//触发list.html 当中的 addItem事件 并且传递了一个对象
		qiao.h.fire('list','addItem',{title:title, content:content})
	}
}