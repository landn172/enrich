
(function(){
		document.body.innerHTML+='<style type="text/css">ul,li{padding:0;margin:0;text-indent:1em}'
			+'.ulAlertInfo{z-index:999;width:200px;background:#333;color:#fff;position:absolute;right:0;cursor:pointer}'
			+'.ulAlertInfo li{list-style:none;border-bottom:1px dashed #666;}'
			+'.ulAlertInfo li:hover{background:RGB(10,111,213)}</style>'+'<ul id="alertInfo" class="ulAlertInfo"></ul>';

})();
function alertInfo(){
	this.elemID='alertInfo';
	this.className='ulAlertInfo';	
	this.elem=this.$('alertInfo')||null;
	this.init();
	//this.listener=['mouseover','mouseout','mousemove'];
	// if(arguments!=null){
	// 	this.add(arguments[0]);
	// }
}
alertInfo.prototype={
	$:function(id){
		if(typeof id=='string')return document.getElementById(id);
		if(typeof id=='object')return id;
	},
	init:function(){		
		this.elem=this.$('alertInfo');
		this.add('tips');
		this.drag();
		return this;
	},
	add:function(str){
		if(this.elem!=undefined){
			this.elem.innerHTML+='<li>'+str+'</li>';
		}else{			
			this.init();
		}
		return this;		
	},
	getCount:function(){
		return this.elem.getElementsByTagName('li').length;
	},
	addListener:function(evt,fn,dom){
		var elem=dom==undefined?this.elem:dom;
		if (elem.addEventListener){
		    elem.addEventListener(evt, fn, false);
		}else if(elem.attachEvent){
		    elem.attachEvent('on'+evt,fn);
		}else{
			elem["on"+evt]=fn;
		}
	},
	removeListener:function(evt,fn,dom){
		var elem=dom==undefined?this.elem:dom;
		 if(elem.removeEventListener){
		     elem.removeEventListener(evt,fn,false);
		 }else if(elem.detachEvent){
		     elem.detachEvent('on'+evt,fn);
		 }else{
		 	elem["on"+evt]=null;
		 }
	},
	drag:function(){
		var self=this.elem,
			oldX=0,
			oldY=0;
		self.onmousedown=function(ev){
			var oEvent=ev||event;
			self.style.cursor='move';			
			oldX=oEvent.clientX-self.offsetLeft;
			oldY=oEvent.clientY-self.offsetTop;
			document.onmousemove=function(ev){
				var oEvent=ev||event;
				var oLeft=oEvent.clientX-oldX;
				var oTop=oEvent.clientY-oldY;
				setTimeout(function(){
					self.style.left=oLeft+'px';
					self.style.top=oTop+'px';
				},150);
				
			}			
			document.onmouseup=function()  //鼠标松开时
	        {
	        	self.style.cursor='pointer';
	            document.onmousemove=null;  //把鼠标移动清楚
	            document.onmouseup=null;  //把鼠标松开清楚
	        }
		}
	}
}