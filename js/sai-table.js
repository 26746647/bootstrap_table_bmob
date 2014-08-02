/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};

//自定义类型的分页
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#"><span class="glyphicon glyphicon-backward"></span></a></li>'+
					'<li class="next disabled"><a href="#"><span class="glyphicon glyphicon-forward"></span></a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );

var delText = null;
var modifyText = null;
var addText = null;
var oTable = null;
var modifyNode = null;
var editFlag=null;
var addFlag=null;
var	order = [0,1,2,3,4,5];

function hideBtnCSS(id){
	//隐藏按钮样式自定义
    $('.ColVis_Button').addClass('btn btn-danger  ColVis_btn_margin');
    $($('.ColVis_Button')[0].children).addClass('glyphicon glyphicon-ok');
	$('.ColVis_Button').removeClass('ColVis_Button ColVis_MasterButton');
};

function addBtnCSS(id){
	//增加按钮样式自定义
	$('#ToolTables_' + id + '_0').removeClass('DTTT_button DTTT_button_text');
    $('#ToolTables_' + id + '_0').addClass('btn btn-success ColVis_btn_margin');
    $($('#ToolTables_' + id + '_0')[0].children).addClass('glyphicon glyphicon-plus');
};

function modifyBtnCSS(id){
    //修改按钮样式自定义
	$('#ToolTables_' + id + '_1').removeClass('DTTT_button DTTT_button_text');
    $('#ToolTables_' + id + '_1').addClass('btn btn-primary ColVis_btn_margin');
    $($('#ToolTables_' + id + '_1')[0].children).addClass('glyphicon glyphicon-edit');
};

function delBtnCSS(id){
    //删除按钮样式自定义
	$('#ToolTables_' + id + '_2').removeClass('DTTT_button DTTT_button_text');
    $('#ToolTables_' + id + '_2').addClass('btn btn-warning ColVis_btn_margin');
    $($('#ToolTables_' + id + '_2')[0].children).addClass('glyphicon glyphicon-remove');
};

function moreBtnCSS(id){
    //更多按钮样式自定义
	$('#ToolTables_' + id + '_3').removeClass('DTTT_button_collection DTTT_button');
    $('#ToolTables_' + id + '_3').addClass('btn btn-info ColVis_btn_margin');
    $($('#ToolTables_' + id + '_3')[0].children).addClass('caret');
    $($('#ToolTables_' + id + '_3')[0].children).attr('id','collection');
    
    $('#collection').empty();
    $('#collection').before('更多');
};

//更多按钮中的二级按钮的id是递增ToolTables_id_4,ToolTables_id_5,ToolTables_id_6

//表初始化，在表的第一列加上checkbox
function addCheckbox() {
	$('table.dataTable thead tr th')[0].innerHTML = '<input type="checkbox" name="check-all">';
	$("input[name='check-all']").click(function(){
     	$("input[name='check-opt']").prop("checked",this.checked);
	});
	$("input[name='check-opt']").click(function(){
        $("input[name='check-all']").prop("checked",$("input[name='check-opt']").length == $("input[name='check-opt']:checked").length);
 	});
};
//点击列,行的颜色改变
function changeRowCSS() 
{
	$("table tbody tr td").click(function(){
		$(this).addClass("focus").parent("tr").addClass("active");
	});
	
	$("table tbody tr td").mouseover(function(){
		$(this).removeClass("focus").parent("tr").removeClass("active");
	});
};

function retrieveData( sSource, aoData, fnCallback ) {
	//iDisplayLength表格显示的行数，iDisplayStart分页时开始页数，sSearch输入过滤关键字，
	//iSortCol_0 排序的列数，iSortDir_0 排序的算法
	if(delText != null && delText.length > 0){
    	aoData.push( { "name": "delete", "value": delText} );//添加删除数据
	}
	
	if(modifyText != null && modifyText.length > 0){
    	aoData.push( { "name": "modify", "value": modifyText} );//添加删除数据
	}
	
	if(addText != null && addText.length > 0){
    	aoData.push( { "name": "add", "value": addText} );//添加删除数据
	}
	//列拖动后,iSortCol_0没有办法知道是哪个列，用以下办法解决
	var ids = ['','inputNumber','inputName','inputSex','inputPhone','inputEmail'];
	var	orderTable = [1,2,3,4,5];
	if(aoData[31].value != 0){
		aoData.push({ "name": "orderCol", "value": ids[order[aoData[31].value]]} );
	}
	
	//解决ie8 unicode转码问题
	eval("var ao_data = '"+JSON.stringify(aoData)+"';");
	$.ajax( {    
		"type": "get",     
		"contentType": "application/json",    
		"url": sSource,     
		"dataType": "json",    
		"data": { aoData: ao_data}, // 以json格式传递  
		"success": function(resp) {
			aoData.pop();
			delText = null;
			modifyText = null;
			addText = null;
    		fnCallback(resp[0]);   
		}, 
		"failure":function (resp) {  
			aoData.pop();
			delText = null;
			modifyText = null;
			addText = null;
    		fnCallback(resp[0]);   
         } 
	});
};

//表分页的时候，取消所有checkout勾选状态
function changeCheckboxState(checked) {
		$("input[name='check-all']").prop("checked",checked);
		$("input[name='check-opt']").prop("checked",checked);
};
//增加框
function addModel( nButton) 
{
	var ids = ['','inputNumber','inputName','inputSex','inputPhone','inputEmail'];
	if(!$('#add').length>0){
		nButton.setAttribute("data-toggle", "modal");
		nButton.setAttribute("data-target", "#add");
		$(nButton).after('<div class="modal fade" id="add" tabindex="-1" role="dialog" aria-labelledby="addLabel" aria-hidden="true">'
							+'<div class="modal-dialog">' 
								+'<div class="modal-content">'
								+'<div class="modal-header">'
								+'<h4 class="modal-title" id="modifyLabel">增加</h4>'
							+'</div>'
							+'<div class="modal-body">'
								+'<form role="form" class="form-horizontal">'
									+'<div class="form-group">'
										+'<label class="col-lg-2 col-sm-2 control-label">工号</label>'
											+'<div class="col-lg-9 col-sm-9 pr">'
											+'<input type="text" id="inputNumber" class="form-control" maxlength="11">'
											+'</div>'
									+'</div>'
									+'<div class="form-group">'
										+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">名字</label>'
											+'<div class="col-lg-9 col-sm-9 pr">'
											+'<input type="text" id="inputName"class="form-control" maxlength="12">'
											+'</div>'
									+'</div>'
									+'<div class="form-group">'
										+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">性别</label>'
											+'<div class="col-lg-9 col-sm-9 pr">'
											+'<input type="text" id="inputSex"class="form-control" maxlength="12">'
											+'</div>'
									+'</div>'
									+'<div class="form-group">'
											+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">电话</label>'
												+'<div class="col-lg-9 col-sm-9 pr">'
												+'<input type="text" id="inputPhone"class="form-control" maxlength="12">'
												+'</div>'
									+'</div>'
									+'<div class="form-group">'
											+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">邮件</label>'
												+'<div class="col-lg-9 col-sm-9 pr">'
												+'<input type="text" id="inputEmail"class="form-control" maxlength="30">'
												+'</div>'
									+'</div>'
									+'</form>'
									+'</div>'
									+'<div class="modal-footer">'
									+'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'
									+'<button type="button" class="btn btn-primary" data-dismiss="modal" onClick="addRow();">确认</button>'
									+'</div>'
								+'</div>'
							+'</div>'
		  				+'</div>');
	}
	
	for(var i = 1; i < ids.length; i++){
		$('#' + ids[i]).val("");
	}
};
//修改框
function modifyModal( nButton, order) 
{
	var ids = ['','inputNumber2','inputName2','inputSex2','inputPhone2','inputEmail2'];
	var anSelected = $("input[name='check-opt']:checked");
	if(anSelected.length == 1 && !$('#modify').length>0){
		nButton.setAttribute("data-toggle", "modal");
		nButton.setAttribute("data-target", "#modify");
		$(nButton).after('<div class="modal fade" id="modify" tabindex="-1" role="dialog" aria-labelledby="modifyLabel" aria-hidden="true">'
								+'<div class="modal-dialog">' 
									+'<div class="modal-content">'
									+'<div class="modal-header">'
									+'<h4 class="modal-title" id="modifyLabel">修改</h4>'
								+'</div>'
								+'<div class="modal-body">'
									+'<form role="form" class="form-horizontal">'
										+'<div class="form-group">'
											+'<label class="col-lg-2 col-sm-2 control-label">工号</label>'
												+'<div class="col-lg-9 col-sm-9 pr">'
												+'<input type="text" id="inputNumber2" class="form-control" maxlength="11">'
												+'</div>'
										+'</div>'
										+'<div class="form-group">'
											+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">名字</label>'
												+'<div class="col-lg-9 col-sm-9 pr">'
												+'<input type="text" id="inputName2" class="form-control" maxlength="12">'
												+'</div>'
										+'</div>'
										+'<div class="form-group">'
											+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">性别</label>'
												+'<div class="col-lg-9 col-sm-9 pr">'
												+'<input type="text" id="inputSex2" class="form-control" maxlength="12">'
												+'</div>'
										+'</div>'
										+'<div class="form-group">'
												+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">电话</label>'
													+'<div class="col-lg-9 col-sm-9 pr">'
													+'<input type="text" id="inputPhone2" class="form-control" maxlength="12">'
													+'</div>'
										+'</div>'
										+'<div class="form-group">'
												+'<label class="col-lg-2 col-sm-2 control-label" for="inputPassword">邮件</label>'
													+'<div class="col-lg-9 col-sm-9 pr">'
													+'<input type="text" id="inputEmail2" class="form-control" maxlength="30">'
													+'</div>'
										+'</div>'
										+'</form>'
										+'</div>'
										+'<div class="modal-footer">'
										+'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'
										+'<button type="button" class="btn btn-primary" data-dismiss="modal" onClick="modifyRow();">确认</button>'
										+'</div>'
									+'</div>'
								+'</div>'
						 +'</div>');
	}
	
	modifyNode = anSelected[0].parentNode.parentNode;
	var childrens = modifyNode.children;
	for(var i = 1; i < order.length; i++){
		$('#' + ids[order[i]]).val(childrens[i].innerText);
	}
};
//删除框
function delModal() 
{
   	var anSelected = $("input[name='check-opt']:checked");
	for(var i = 0; i<anSelected.length;i++)
	{				
		delText = "";
		var childrens = anSelected[i].parentNode.parentNode.children;
		for(var j = 1; j < childrens.length; j++){
			delText += "\t" + childrens[j].innerText;
		}
		delText = $.trim(delText);
		//删除选中的行，fnDeleteRow触发回调fnServerData函数（删除多行会多次被调用）
		oTable.fnDeleteRow(anSelected[i].parentNode.parentNode);

	}
	$("input[name='check-all']").prop("checked",false);
}

function tableEdit(id, flag)
{
	$("form").removeClass("form-inline");
	
	$(".dataTables_filter").hide();
	$(".table td:not(:nth-child(3))").hide();	
	$(".table th:not(:nth-child(3))").hide();
	$(".DTTT_container").hide();
	$(".ColVis").hide();
	$(".dataTables_length").hide();
	$(".dataTables_info").hide();
	$(".dataTables_paginate ").hide();
	
	$("#" + id).animate({width:"16.667%"},600).addClass("tableEdit-content");
	$(".tableEdit-aside").animate({left:"17.3%"},600);
	
	editFlag = flag;
}

function tableDefault(id)
{
	$("form").addClass("form-inline");
	$(".dataTables_filter").show();
	$(".DTTT_container").show();
	$(".ColVis").show();
	$(".dataTables_length").show();
	$(".dataTables_paginate ").show();
	$(".dataTables_info").show();

	$("#" + id).animate({width:"100%"},200,function(){
		$(".table td").add(".table th").show();
		$(".table-responsive form>div:not(:nth-child(2))").show();
	}).removeClass("tableEdit-content");
	
	$(".tableEdit-aside").animate({left:"100%"},400);
}

function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return (localhostPaht+projectName);
}
