//先初始化,加载一个子界面
mui.init({
	subpages:[qiao.h.normalPage('list')]
})

//初始化变量
var main = null;   //主界面
var showMenu = false;  //是否是显示还是隐藏菜单的变量
var menu = null;
var add = null;
var detail = null;

//凡是调用H5+的方法都需要写到这个方法里面
mui.plusReady(function(){
	setColor("#ffffff");
	//侧滑菜单
	main = qiao.h.indexPage();
	var menuoptions = qiao.h.page('menu',{
		styles:{
			left:0,
			width:'70%',
			zindex:-1
		}
	})
	
	//提前预加载菜单界面preload
	menu = mui.preload(menuoptions);
	
	//绑定点击事件
	qiao.on('.mui-icon-bars','tap',opMenu);   //菜单按钮绑定
	main.addEventListener('maskClick',opMenu);  //主界面阴影层
	mui.menu = opMenu;  //当手机自带菜单按钮的时候
	//添加界面
	add = mui.preload(qiao.h.normalPage('add',{popGesture:'none'}));
	//给添加按钮绑定事件
	qiao.on('.adda','tap',showAdd);
	//隐藏添加界面
	qiao.on('.mui-icon-back','tap',hideAdd);
	//预加载详细界面
	detail = mui.preload(qiao.h.normalPage('detail',{popGesture:'none'}))
	//给返回按钮绑定事件
	mui.back = function(){
		if($(".adda").is(":hidden")){
			hideAdd()
		}else if(showMenu){
			closeMenu()
		}else{
			//退出应用
			qiao.h.exit()
		}
	}
})

function showAdd(){
	showBackBtn();
	//添加界面显示
	qiao.h.show('add','slide-in-bottom',2000)
}
function hideAdd(){
	hideBackBtn();
	qiao.h.getPage('add').hide();
	qiao.h.getPage('detail').hide();
}
//显示后退按钮
function showBackBtn(){
	$(".menua").removeClass("mui-icon-bars").addClass("mui-icon-back");
	$(".adda").hide()
}

function hideBackBtn(){
	$(".menua").removeClass("mui-icon-back").addClass("mui-icon-bars");
	$(".adda").show()
}
// menu 判断是隐藏菜单 还是打开菜单
function opMenu(){
	if(showMenu)
	{
		closeMenu(); //关闭菜单
	}else{
		openMenu();  //打开菜单
	}
}

//打开菜单
function openMenu(){
	//判断添加按钮是否可见
	if($(".adda").is(":visible"))
	{
		setColor("#333333");
		//none 无任何效果，0持续的时间
		menu.show('none',0,function(){
			// 设置index样式
			main.setStyle({
				mask:'rgba(0,0,0,0.4)',
				left: '70%',
				transition: {
					duration: 150
				}
			})
		});
		
		//已经显示菜单完毕
		showMenu = true;
	}
}

//关闭菜单
function closeMenu(){
	setColor("#0ff");
	
	//主界面移动回来
	main.setStyle({
		mask: 'none',
		left: '0',
		transition: {
			duration: 100
		}
	})
	
	showMenu = false;
	
	setTimeout(function() {
		menu.hide();
	}, 300);
}

//设置状态栏的颜色
function setColor(color){
	if(mui.os.ios && color) plus.navigator.setStatusBarBackground(color);
}