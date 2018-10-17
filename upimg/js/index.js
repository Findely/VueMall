(function($){
    $.fn.extend({
        pageination:function(options ){
         	//面向对象的写法
         	new page(this,options);
        }
        
    });
    var page=function(ele,options){
        if(options==null)
        alert("arg error")
        this.element=ele;
        this.options={
            pageIndex:1,
            pageSize:20,
            pageCount:15,
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
    
})(window.jQuery);

//$("#page").pageination({
//            pageCount: 10,
//            pageSize: 300,
//            callback: function(ele) {
//                    //alert(ele.html())
//                     } 
//   } );