/**
 * jquery表格插件
 * @author ZouHao
 * @param ascImgUrl  升序图片地址
 * @param descImgUrl 降序图片地址
 * 例子:
 * 1:默认使用语法
 * $("table").sort();
 * 2:参数使用语法
 * $("table").sort({
 * 		'ascImgUrl':'/static/images/bullet_arrow_up.png',
		'descImgUrl':'/static/images/bullet_arrow_down.png',
		'endRow':0,		//最后一行
		'isHeaderTh':true    //头部是th或者td
 * });
 */
;(function ($) {  
	$.fn.sort = function (options) {  
		var settings = $.extend({
			'ascImgUrl':'images/bullet_arrow_up.png', //升序图片
			'descImgUrl':'images/bullet_arrow_down.png', //降序图片
			'endRow':0,		//最后一行
			'isHeaderTh':true    //头部是th或者td
		},options);
		init(this);
		function init(p){
			//初始化一些变量
			var node=settings.isHeaderTh?'th':'td';
			var trList=$(p).find("tr "+node+"[sort='true']");
			trList.css("cursor","pointer"); 
			if(settings.endRow==0){
				settings.endRow=$(p).find("tr").size();
			}else if(settings.endRow<0){
				settings.endRow=$(p).find("tr").size()+settings.endRow;
			}else{
				settings.endRow=$(p).find("tr").size()-settings.endRow;
			}
			//初始化点击表格头部事件
			trList.click(function(){
				//获取当前行数
				settings.startRow=$(this).parent().index() +1;
				settings.index=$(this).index();
				settings.endRow=$(p).find("tr").size();
				if($(this).find("img").size()==2){
					addImg(trList);
					removeImg(this,'asc');
					changeTableBody(p,'asc');
				}else{
					if($(this).find("img").attr("src")==settings.ascImgUrl){
						addImg(trList);
						removeImg(this,'desc');
						changeTableBody(p,'desc');
					}else{
						addImg(trList);
						removeImg(this,'asc');
						changeTableBody(p,'asc');
					}
				}
			});
			//初始化头部图片
			addImg(trList);
		}
		//将数据进行排序
		function changeTableBody(p,sort){
			data=new Array();
			//所选的行
			var trBodyList=$(p).find("tr:lt("+settings.endRow+"):gt("+settings.startRow+")");
			trBodyList.each(function(i){
				data[i]=new Array();
				$(this).find("td").each(function(j){
					data[i][j]=$(this).html();
				});
			});
			data.sort(function(x, y){  
				if(sort=='asc'){
					return x[settings.index].localeCompare(y[settings.index]);  
				}else{
					return y[settings.index].localeCompare(x[settings.index]);  
				}
			});
			trBodyList.each(function(i){
				$(this).find("td").each(function(j){
					$(this).html(data[i][j]);
				});
			});
		}
		/**
		 * 为每个表格头部添加图片
		 */
		function addImg(trList){
			trList.find("img").remove();
			trList.append('<img src="'+settings.ascImgUrl+'" style="width:8px;height:8px;" /><img src="'+settings.descImgUrl+'" style="width:8px;height:8px;" />')
		}
		/**
		 * 移出当前点击表格升序/降序图片
		 */
		function removeImg(p,sort){
			var imgUrl=sort=='desc'?settings.ascImgUrl:settings.descImgUrl;
			$(p).find("img").each(function(){
				if($(this).attr("src")==imgUrl){
					$(this).remove();
					return false;
				}
			});
		}
	};  
})(jQuery); 
