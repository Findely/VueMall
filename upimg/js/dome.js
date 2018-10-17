(function($){
	$.fn.extend({
		myUpimg:function(options){
			console.log(options)
         	new setImg(this,options);
		}
	})
	 var setImg=function(ele,options){
        if(options==null)
        alert("arg error")
        this.element=ele;
        this.options={
            pageIndex:1,
            callback:function(){}
        };
        this.options=$.extend({},this.options,options);
        this.init();
    }
	 
    //初始化对象
    page.prototype={
        init:function(){
            //初始化
	        this.createHtml();
	        this.bindEvent();
        },
        createHtml:function(){
            var that=this;
            var content="";
            //结尾工作
            that.element.html(content);
        },
        bindEvent:function(){ 
            var that=this;
            that.element .on('click','a',function(){
                that.createHtml();
                //回调函数
                if(that.options.callback){
                    that.options.callback($(this));
                }
            })
        }
        
    }
})(jQuery)
