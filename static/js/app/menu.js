mui.init({
	ketEventBind:{
		backbutton:false
	}
})

mui.plusReady(function(){
	//初始化已完成表的数据
	initDoneList();
	//绑定自定义事件，在list.html里面点击已完成触发的效果
	window.addEventListener('doneItem',doneItemHandler)
})

function doneItemHandler(event){
	//先获取到点击的id
	var todoId = event.detail.todoId;
	//查询数据是否存在，追加字符串，插入已完成，删除未完成
	qiao.h.query(db,"SELECT * FROM t_plan_day_todo where id="+todoId,function(res){
		if(res.rows.length > 0){
			//获取到未完成的数据
			var data = res.rows.item(0);
			//查询已完成表里面的最大id值
			qiao.h.query(db,"select max(id) mid from t_plan_day_done",function(res1){
				//追加字符串
				$('#donelist').prepend(genLi(data.plan_title)).show();
				//插入已完成
				var id = (res1.rows.item(0).mid) ? res1.rows.item(0).mid : 0;
				qiao.h.update(db,'insert into t_plan_day_done (id,plan_title, plan_content) values ('+(id+1)+', "'+data.plan_title+'","'+data.plan_content+'")');
				//删除未完成
				qiao.h.update(db, 'delete from t_plan_day_todo where id=' + todoId);
			})
		}
	})
}
function initDoneList(){
	var $ul = $('#donelist').empty();
	//查询已完成的数据
	qiao.h.query(db,"SELECT * FROM t_plan_day_done order by id desc",function(res){
		for(var i = 0;i < res.rows.length;i++){
			$ul.append(genLi(res.rows.item(i).plan_title));
		}
		showList($ul)
	})
}
function genLi(title){
	return '<li class="mui-table-view-cell">' + title + '</li>';
}
function showList(ul){
	if(ul.find('li').size() > 0 && ul.is(':hidden')) ul.show();
}