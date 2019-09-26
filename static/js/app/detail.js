mui.init({
	keyEventBind:{
		backbutton:false,
		menubutton:false,
	}
})

mui.plusReady(function(){
	//绑定自定义事件
	window.addEventListener('detailItem',detailItemHandler);
});

function detailItemHandler(event){
	//触发首页里面的显示返回按钮
	qiao.h.indexPage().evalJS('showBackBtn();');
	//获取未完成的id
	var detailId = event.detail.id;
	var sql = 'select * from t_plan_day_todo where id =' + detailId;
	qiao.h.query(db,sql,function(res){
		if(res.rows.length > 0){
			var data = res.rows.item(0);
			$('#detailTitle').text(data.plan_title);
			$('#detailContent').html(data.plan_content);
			
			qiao.h.show('detail', 'slide-in-right', 300)
		}
	})
}

