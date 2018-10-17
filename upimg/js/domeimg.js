(function($){
	//会掉函数
	var callback=function(e){};
	$.fn.myUpImage=function(e,callback){
		//引用接口的设置
//		e = $.extend({
//		},e)
//		$.fn.myUpImage.init($(this),e,callback);
	};
	// 去除默认设置
	$.fn.myUpImage.init= function($this,e,callback){		
		preventEventPropagation();
		var _this = $this;
		var evt=e;
		var s = myUpImage.Events(_this,evt);
		callback(s);
	};
	//事件处理
	var myUpImage.Events = function($this,evt){
		$this.on('change',function(){
			//读取文件
			var reader = new FileReader();
			//result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容。
			reader.readAsDataURL(this.files[0]);
			//处理load事件。该事件在读取操作完成时触发。
			reader.onload = function(e) {
				//图片文件转base64;
				var dateurl=reader.result;
				var getimg = new Image();
				getimg.src=dateurl;
				getimg.onload=function(){
					if(getimg.width<=960&&getimg.height<=960){
						setUrl(getimg,getimg.width,getimg.height);
					}else{
						if(getimg.width>getimg.height){
							var scale = getimg.width/getimg.height;
						 	return setUrl(getimg,960,960/scale);
						}else{
							var scale = getimg.height/getimg.width;
							return setUrl(getimg,960/scale,960);
						}
					}
				}
			}
		});
	}
	
	//画入canvas方式
	var setUrl = function (getimg,width,height){
		var canvas= document.createElement('canvas');
		canvas.width=width;
		canvas.height=height;
		var context = canvas.getContext('2d');
		context.drawImage(getimg,0,0,width,height);
		canvas.toDataURL();
	}
	//去除默认事件
	function preventEventPropagation(evt) {
		var e = evt || window.event;
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		return false;
	}
})(jQuery)
