//moban1:隐藏上一个focus显示当前focus
//index为初始值;count为总数;name为需要控制的元素id的前缀;flag为是否循环：0为不循环（其他默认循环）
//args放html或blur或focus或select等些参数
function ani_blur_focus(index,count,name,flag,args){
	this.index=0,this.count=count,this.name=name,this.blur=ui.blur,this.focus=ui.focus,this.item=[];
	for(var i=index;i<=count;i++){
		this.item.push($(this.name+i));
	}
	if(args){			
		this.html=args.html==undefined?null:args.html;//跳转html
		if(this.html!=null){//若果有html的话添加select方法
			this.select=function(){
				window.location.href=this.html[this.index];				
			}
		}
		this.blur=args.blur==undefined?ui.blur:args.blur;//对上一焦点处理方法（默认消失）
		this.focus=args.focus==undefined?ui.focus:args.focus;	//对当前焦点处理方法（默认显示）		
	}
	switch(flag){//是否循环
		case 0:
			this.move=function(f){
				this.blur(this.item[this.index]);
				if(f>0){
					var t=index==1?this.count-1:this.count;
					this.index=Math.min(this.index+1,t);
				}else if(f<0){
					var t=index==1?index-1:index;
					this.index=Math.max(this.index-1,t);			
				}
				this.focus(this.item[this.index]);
				return this;
			}
			break;
			default:
				this.move=function(f){			
					this.blur(this.item[this.index]);
					this.index=(this.index+f+this.count)%this.count;			
					this.focus(this.item[this.index]);
					return this;
				}
			break;
	}	
	
}
ani_blur_focus.prototype={
	jump:function(jumpTo){
		this.blur(this.item[this.index]);
		this.index=jumpTo==undefined?this.index:jumpTo;
		this.focus(this.item[this.index]);
	},
	init:function(){
		this.index=0;
		this.focus(this.item[this.index]);
	},
	quit:function(){
		this.blur(this.item[this.index]);
	} 	
}

//moban2:移动focus
//count为总数(index变化的最大值);id为需要控制的元素的id
//args存放的是需要控制的元素的top和left变换信息(若有则加上跳转html的地址)
function ani_move(count,id,args,flag){
	var o={};
	o.index=0,o.count=count,o.elem=$(id);
	if(args!=undefined){
		o.html=args.html==undefined?null:args.html;
		if(o.html!=null){//若果有html的话添加select方法
			o.select=function(){
				window.location.href=o.html[this.index];				
			}
		}
		o.top=args.top==undefined?null:args.top;
		o.left=args.left==undefined?null:args.left;
		o.moveFunc=args.moveFunc==undefined?null:args.moveFunc;
	}
	switch(flag){
		case 0:
			o.move=function(f){
				if(f>0){
					this.index=Math.min(this.index+1,this.count);			
				}else if(f<0){
					this.index=Math.max(this.index-1,0);			
				}	
				this.switch();	
				return this;
			}
		break;
		default:
			o.move=function(f){
				this.index=(this.index+f+this.count)%this.count;
				this.switch();
				return this;
			}
		break;
	}
	
	o.switch=function(){
		if(o.moveFunc){
			var animate_arg={};
			if(this.left){
				animate_arg.left=this.left[this.index];
			}
			if(this.top){
				animate_arg.top=this.top[this.index];
			}
			o.moveFunc(o.elem,animate_arg);
		}else{
			if(this.left){
				ui.moveLeft(this.elem,this.left[this.index]);
			}
			if(this.top){
				ui.moveTop(this.elem,this.top[this.index]);
			}
		}		
	}
	o.jump=function(jumpTo){
		if(jumpTo){
			this.index=jumpTo;
		}
		ui.focus(this.elem);		
		this.switch();
	}
	o.init=function(){
		this.index=0;
		ui.focus(this.elem);
		this.switch();
	}
	// if(!o.select){		
	// 	o.select=function(){

	// 	}
	// }
	o.quit=function(){
		ui.blur(this.elem);
	} 
	return o;
}

function changebg(img){
	return function(e){
		e.style.background=img;
	}
}
function $(E){
	var o={};
	o=document.getElementById(E);
	o.ani=ani;
	o.animate=animate;
	return o;
}
//动画效果
function animate(arg,time,endFunction){	
	var o={},t=arg,j=0;
	o.elem=this||document;
	if(o.elem.timeout!=undefined){//清除当前项的动画（可以隐藏）
		clearInterval(o.elem.timeout);
	}
	//动画总时长
	o.time=time==undefined?100:time;
	//动画间隔
	o.speed=50;
	//执行次数
	o.timeSum=Math.ceil(o.time/o.speed);
	//起始元素属性
	// o.startLeft=this.offsetLeft;
	// o.startTop=this.offsetTop;
	// o.startWidth=this.offsetWidth;
	// o.startHeight=this.offsetHeight;
	for(var i in arg){
		switch(i){
			case 'left':
				o.startLeft=this.offsetLeft;
				o.endLeft=arg[i];
				o.moveLeftLen=(o.endLeft-o.startLeft)/o.timeSum;
			break;
			case 'top':
				o.startTop=this.offsetTop;
				o.endTop=arg[i];
				o.moveTopLen=(o.endTop-o.startTop)/o.timeSum;
			break;
			case 'width':
				o.startWidth=this.offsetWidth;
				o.endWidth=arg[i];
				o.changeWidthLen=(o.endWidth-o.startWidth)/o.timeSum;
				break;
			case 'height':
				o.startHeight=this.offsetHeight;
				o.endHeight=arg[i];
				o.changeHeightLen=(o.endHeight-o.startHeight)/o.timeSum;
				break;
		}
	}
	o.elem.timeout=setInterval(function() {
		//var args={};
		if(o.endLeft!=null){
			o.startLeft+=o.moveLeftLen;
			t.left=o.startLeft+"px";
		}
		if(o.endTop!=null){
			o.startTop+=o.moveTopLen;
			t.top=o.startTop+"px";
		}
		if(o.endWidth!=null){
			o.startWidth+=o.changeWidthLen;
			t.width=o.startWidth+"px";
		}
		if(o.endHeight!=null){
			o.startHeight+=o.changeHeightLen;
			t.height=o.startHeight+"px";
		}
		o.elem.ani(t);
		j++;
		if(j>=o.timeSum){
			clearInterval(o.elem.timeout);
			if(endFunction){//结束后运行方法
				endFunction();
			}
		}
	},o.speed);
	return o.elem;
}
//执行动画参数
function ani(arg) {	//传入键值对,ex{left:5px,top:30px}
	for(var i in arg){
		switch(i){
			case 'src':
				this.src=arg[i];
			default:
				this.style[i]=arg[i];
			break;
		}
		
	}	
	return this;
}
function createElems(args){//动态创建元素
	var array=[];
	for(var i in args){//查找元素标签
		if(i){
			var e=document.createElement(i);			
			for(var j in args[i]){	//查找元素属性或标签
				if(j){
					if(typeof(args[i][j])=='object'){//标签
						var _arg={};			
						_arg[j]=args[i][j];
						var t=createElems(_arg);//将得出的元素返回
						for(var k in t){
							e.appendChild(t[k]);//添加元素
						}						
					}else{//添加属性
						e.setAttribute(j,args[i][j]);
					}										
				}		
			}
			array.push(e);//创建的元素存放到数组中
		}		
	}
	return array;
}
function createTable(args){
	var table=document.createElement('table');
	table.setAttribute('style','position:absolute;width:200px;left:500px;border:1px solid #000;');
	for(var r in args){
		var tr=document.createElement('tr');
		var _td=args[r].td;

		for(var i=0;i<_td.length;i++){
			var td=document.createElement('td');
			td.innerHTML=_td[i];
			if(args[r].w){
				if(args[r].w[i]){
					td.width=args[r].w[i];
				}
			}			
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	document.body.appendChild(table);
}
var ui = {	
	focus: function(e) {
		var o=typeof(e)=='string'?$(e):e;		
		o.style.display = 'block';
	},
	blur: function(e) {
		var o=typeof(e)=='string'?$(e):e;
		o.style.display = 'none';
	},
	moveTop:function(e,top){
		e.style.top=top+"px";
	},
	moveLeft:function(e,left){
		e.style.left=left+"px";
	},
	hasClass:function (element, className){
		 var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		 return element.className.match(reg);
	},
	addClass:function (elem,value){
			    if(!elem.className){
			        elem.className=value;
			    }else{
			        var oValue=elem.className;
			        oValue+=" ";
			        oValue+=value;
			        elem.className=oValue;
			    }
	}, 
	removeClass:function (element, className){
		if (ui.hasClass(element, className)) {
			var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
			element.className = element.className.replace(reg, '');
		}
	},
	removeAllClass:function(element){
		element.className ="";
	},getQueryParam:function(){	
		var args={},value=null, item, name=null, i=null;
		var qs=window.location.search.length>0?window.location.search.substring(1):"";
		if(qs!=""){
			if(qs.search("&")!=-1){
				var items=qs.split("&");
				for(i=0; i<items.length;i++){
					item=items[i].split("=");
					name=decodeURIComponent(item[0]);
					value=decodeURIComponent(item[1]);
					args[name]=value;
				}
			}else{
				name=decodeURIComponent(qs.split("=")[0]);
				value=decodeURIComponent(qs.split("=")[1]);
				args[name]=value;
			}
			return args;
		}
		return null;
	}
}


