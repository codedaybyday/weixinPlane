(function($){
	//var pageSwitch = (function(elem,options){
		function pageSwitch(elem,options){
			this.options = options;
			this.elem = elem;
			this.defaults = {
				direction:'vertical',
				loop:false,
				pagination:true,
				keyboard:true,
				easing:'ease',
				index:0,
				duration:500,
				selectors:{
					sections:'.sections',
					section:'.section',
					page:'.page'
				},
				callBack:''
			};
			this._init();
		}
		/*防止相同的事件快速重复触发*/
		var _timer = {};
		function delay_till_last(id, fn, wait) {
			if (_timer[id]) {
				window.clearTimeout(_timer[id]);
				delete _timer[id];
			}
		 
			return _timer[id] = window.setTimeout(function() {
				fn();
				delete _timer[id];
			}, wait);
		}
		pageSwitch.prototype = {
			/*
			相关数据的初始化
			 */
			_init:function(){
				this.settings = $.extend(true,this.defaults,this.options||{});
				this.selectors = this.settings.selectors;
				this.sections = this.selectors.sections;
				this.section = this.selectors.section;
				this.page = this.selectors.page;
				//this.elem = elem;
				this.duration = this.settings.duration;
				this.easing = this.settings.easing;
				this.pageLength = this.pageLength();
				this.index = this.settings.index<0||this.settings.index>this.pageLength?0:this.settings.index;
				this.direction = this.settings.direction = 'vertical'? true:false;
				this.loop = this.settings.loop;
				this.keyboard = this.settings.keyboard;
				this.pagination = this.settings.pagination;
				//var offset = 
				this.position = $(this.sections).offset().top;
				this.winHeight = $(window).height();
				this.callBack = this.settings.callBack;
				//alert(this.position)
				this._initLayerout();
				this._initEvent();
			},
			/*
			布局
			 */
			_initLayerout:function(){
				var width = this.pageLength*100+'%';
				var cellWidth = (1/this.pageLength).toFixed(2)*100+'%';
				$(this.sections).width(width).height('100%').css({
					'transition':'all 0.5s'
				});
				$(this.section).width(cellWidth).height('100%');
				if(!this.direction){
					$(this.section).css('float','left');
				}
				if(this.pagination){
					this._pagination();
				}
			},
			/*生成导航DOM结构*/
			_pagination:function(){
				var pageHtml = "<ul class="+this.page.substring(1)+">";
				for(var i=0;i<this.pageLength;i++){
					pageHtml += "<li></li>";
				}
				pageHtml += "</ul>";
				$(this.elem).css('position','relative').append(pageHtml);
				$(this.page).css({
					'height':20*this.pageLength+'px',
					'width':'20px',
					'position':'absolute',
					'right':'2%',
					'top':'40%'
				});
				$(this.page+' li').css({
					'border-radius':'50%',
					'background':'#eee',
					'width':'20px',
					'height':'20px',
					'marginBottom':'10px'
				});
				this.pageItem = $(this.page+' li')
				this._active();
			},
			/*分页导航激活当前项*/
			_active:function(){
				this.pageItem.css('background','#eee').eq(this.index).css('background','orange');
			},
			_initEvent:function(){
				var _this = this;
				/*点击事件*/
				$(_this.page).on('click','li',function(){
					var index = $(this).index();
					_this.index = index;
					//alert(_this.index)
					_this._move();
				});
				/*键盘事件*/
				$(document).on('keydown',function(e){
					if(e.keyCode == 37 || e.keyCode == 38){
						_this._prev();
					}else if(e.keyCode  == 39 || e.keyCode == 40){
						_this._next();
					}
				})
				/*滚轮事件*/
				//var lock;
				$(document).on('DOMMouseScroll mousewheel',function(e){
					//console.log(e)
					var event = e.originalEvent;
					var detail = event.wheelDelta || -event.detail;
					
					if(detail<0){
						delay_till_last('id',function(){
							_this._next();
						},300);
					}else{
						delay_till_last('id',function(){
							_this._prev();
						},300);
					}
				});
				/*窗口大小发生变化时*/
				var timer = null;
				$(window).on('resize',function(){
					clearTimeout(timer);
					timer = setTimeout(function(){
						_this._initLayerout();
					},300);
				});
			},
			/*
			滚动
			 */
			_move:function(){
				var _this = this;
				//alert(_this.index);
				_this.position = _this.direction?$(_this.section).eq(_this.index).offset().top:$(_this.section).eq(_this.index).offset().left;
				console.log(_this.position,_this.index)//点击导航上的第一个和第二个是，控制台上的结果还是一样，难道是position函数获取错误
				if(_this._isSupport(['transform','transition'])){
					$(_this.sections).css({
						'transition':'all '+_this.duration+'ms '+_this.ease,
						'transform':'translate(0px,-'+_this.position+'px)'
					});
				}else{
					$(_this.sections).css('position','absolute').animate({
						'top':_this.position+'px'
					},_this.duration);
				}
				if(_this.pagination){
					_this._active();
				}
			},
			_prev:function(){
				var _this = this;
				
				if((_this.loop)|| (!_this.loop && _this.index!=0)){
					_this.index =--_this.index<0?_this.pageLength-1:_this.index;
					//console.log(_this.index);
					_this._move();
				}
			},
			_next:function(){
				var _this = this;
				
				if((_this.loop)|| (!_this.loop && _this.index!=_this.pageLength-1)){
					_this.index = ++_this.index>_this.pageLength-1?0:_this.index;
					_this._move();
				}
			},
			_isSupport:function(property){
				var _this = this;
				for(var i=0;i<property.length;i++){
					if(!property[i] in $('body')[0].style){
						return false;
					}
				}
				return true;
			},
			pageLength:function(){
				return $(this.section).length;
			}
		}
	//	return pageSwitch;
	//})();
	$.fn.pageSwitch = function(options){
		return $(this).each(function(){
			var instance;
			var options = options || {};
			//alert(instance)
			instance = new pageSwitch(this,options);
			/*if(instance === 'undefined'){
				instance = new pageSwitch(this,options);
			}*/
		});
	}
})(jQuery);