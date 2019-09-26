mui.init({
	keyEventBind:{
		backbutton:false,
		menubutton:false,
	},
	//设置长按屏幕是否可用
	gettureConfig:{
		longtap:true
	}
})

var tapId = null;  //点击的备忘录id

mui.plusReady(function(){
	// 获取列表 自定义方法
	initHelp();
	//右滑菜单
	window.addEventListener('swiperight', function(){
		qiao.h.indexPage().evalJS("opMenu();");
	});
	//长按删除
	qiao.on('#todolist li','longtap',function(){
		tapId = $(this).data('id');//获取当前点击的id
		qiao.h.pop();//弹出删除框
	})
	
	//点击删除按钮，绑定事件
	qiao.on('.delli','tap',delItem)
	
	//查看详细
	qiao.on("#todolist li","tap",function(){
		//触发detail.html 界面里面的 自定义事件
		console.log($(this).data('id'))
		qiao.h.fire('detail','detailItem',{id:$(this).data('id')})
	})
	
	//完成
	qiao.on('.doneBtn','tap',function(){
		var $li = $(this).parent().parent();
		var id = $li.data('id');
		$li.remove();
		showList($('#todolist'));
		
		//触发到menu.html 当中的 doneItem 事件
		qiao.h.fire('menu','doneItem',{todoId:id});
		return false
	})
})
function delItem(){
	if(tapId){
		//从本地存储里面删除掉
		qiao.h.update(db,'delete from t_plan_day_todo where id=' + tapId);
		//将删除框隐藏掉
		qiao.h.pop();
		//重新获取列表数据
		initList();
	}
}
function initHelp(){
	//获取help的本地存储  第二次进来不是null notfirst
	var help = qiao.h.getItem("help")
	if(help == null){
		qiao.h.update(db, 'create table if not exists t_plan_day_todo (id unique, plan_title, plan_content)');
		qiao.h.update(db, 'create table if not exists t_plan_day_done (id unique, plan_title, plan_content)');
		//往新建的表里面插入一条数据 未完成表
		var content = '1.右上角添加事项<br/>2.点击事项查看详情<br/>3.长按事项删除<br/>4.右滑事项完成<br/>5.左滑显示完成事项';
		var sql = 'insert into t_plan_todo (id, plan_title, plan_content) values (1, "功能介绍",'+content+'")';
		//执行sql语句
		qiao.h.update(db, sql);
		//插入一个本地存储 help:notfirst 防止他第二次进来继续插入数据
		qiao.h.insertItem('help','notfirst')
	}
	//初始化列表
	initList();
	//给添加界面绑定监听事件
	window.addEventListener('addItem',addItemHandler);
}

function initList(){
	qmask.show();
	//先把ul列表清空
	var $ul = $("#todolist").empty();
	//查询语句
	qiao.h.query(db, 'select * from t_plan_day_todo order by id desc', function(res){
		console.log(res.rows.item)
		for(var i = 0; i < res.rows.length; i++){
			
			$ul.append(genLi(res.rows.item(i)));
		}
		showList($ul);
	})
}
function genLi(data){
	var id = data.id;
	var title = data.plan_title;
	var content = data.plan_content;
	var li = 
		'<li class="mui-table-view-cell" id="todoli_' + id + '" data-id="' + id + '">' +
			'<div class="mui-slider-right mui-disabled">' + 
				'<a class="mui-btn mui-btn-red doneBtn">完成</a>' +
			'</div>' + 
			'<div class="mui-slider-handle">' + 
				'<div class="mui-media-body">' + 
					title + 
					'<p class="mui-ellipsis">'+content+'</p>' + 
				'</div>' + 
			'</div>' +
		'</li>';
		
		return li;
}

function showList(ul){
	if(ul.find('li').size() > 0 && ul.is(":hidden")) ul.show();
}

// 添加待办事项
function addItemHandler(event){
	// 主界面按钮修改
	qiao.h.indexPage().evalJS("hideBackBtn();");
	//获取提交的内容
	var title = event.detail.title;
	var content = event.detail.content ? event.detail.content : '暂无内容';
	//先查询出最大的id值，插入到未完成表，生成字符串，并且前追加到ul里面
	qiao.h.query(db,'select max(id) mid from t_plan_day_todo', function(res){
		var id = (res.rows.item(0).mid) ? res.rows.item(0).mid : 0;
		qiao.h.update(db, 'insert into t_plan_day_todo (id, plan_title, plan_content) values ('+(id+1) + ', "' + title + '", "' + content + '")');
		$("#todolist").prepend(genLi({id:id+1, 'plan_title':title,'plan_content': content})).show()
	})
}