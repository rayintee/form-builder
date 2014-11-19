/**
 * Created by raolongfei on 2014-11-11.
 * 表单定制器lib库
 */
//初始化表单字段组件
function initComponent(){
    $.get('assets/data/componet.json', function(data){

    });
}

//根据参数动态的切换编辑、预览模式
function viewFormPage(val){
    if(val) { //预览模式
        $('#viewArea').removeClass('hideEle');
        $('#editorArea').addClass('hideEle');
    } else { //编辑模式
        $('#editorArea').removeClass('hideEle');
        $('#viewArea').addClass('hideEle');
    }
}

//download Form Page
function downLoadPage(){
    var $tmp = $('.form-page').html();
    $('#viewArea').children().empty().append($('<div class="form-page">').append($tmp));
    var $t = $('#viewArea').children();//对该片段进行编辑
    $t.find('.preview, .drag, .remove, .editor, .add, .plus').remove();//删除编辑操作等部分
    $t.find('.header-content').attr('class', 'header-content').find('.fp-header')
        .attr('class', 'fp-header').find('.fp-title').removeAttr('id');//清除多余的属性
    $t.find('.body-content').attr('class', 'body-content').removeAttr('id').find('.fp-module')
        .attr('class', 'fp-module').removeAttr('style').each(function() {
        $(this).children().children().find('.fp-module-title');//清除模块标题
        var $module_content = $(this).children().children().find('.fp-module-content').attr('class', 'fp-module-content');
        $module_content.children().each(function(){//清除模块内容
            $(this).attr('class', 'fp-row').removeAttr('style').find('.fp-row').attr('class', 'fp-row').removeAttr('style');
            $(this).find('.fp-column').attr('class', 'fp-column');
        });
    });
    $t.find('.footer-content').attr('class', 'footer-content').removeAttr('id').find('.fp-footer').attr('class', 'fp-footer')
        .find('.fp-column').attr('class', 'fp-column');
    //去除掉view和row-fluid元素
    $t.find('.view > .row-fluid').each(function(){
        $(this).parent().before($(this).children());//插入到view前面
        $(this).parent().remove();//删除该节点
    });
    //改变底部button的结构
    $t.find('.fp-footer').children('.fp-column').each(function(){
        $(this).before($(this).children());//插入到view前面
        $(this).remove();//删除fp-column节点
    });
}

//删除div片段
function removeHtml(){
    $('.form-page').on('click', '.remove', function(e){
        e.stopImmediatePropagation();//阻止冒泡事件
        var isFooter = $(this).parent().parent().hasClass('fp-footer');
        if(isFooter){ //底部按钮动态的删除
            var _length = $('.footer-content .fp-footer').find('.fp-column').length -1;
            _length = _length >0 ? _length : 0;
            $(this).parent().remove();//删除该片段
            if(_length > 0){
                var _percent = parseFloat((100 - _length*2.22)/_length).toFixed(2);
                $('.footer-content .fp-footer').find('.fp-column').attr('style', 'width:' +_percent + '%;')
            } else {
                $('.footer-content .fp-footer').addClass('hideEle');//隐藏fp-footer class
                $('.footer-content').find('span.add').removeClass('hideEle');
            }
        } else  $(this).parent().remove();//删除节点
    });
}

//添加底部按钮
function addFooterBtn(){
    $('.footer-content').on('click', 'span.add', function(e){
        e.stopImmediatePropagation();//阻止默认事件
        $('.footer-content').find('span.add').addClass('hideEle');//隐藏button
        var _tpl = '<div class="fp-column bg-2 bs-1" style="width: 48.50%;"><a href="#close" class="remove label label-important">' +
            '<i class="icon-remove icon-white"></i>删除</a><span class="editor label" data-target="#editorPageNavBtn" role="button" data-toggle="modal">' +
            '<i class="icon-edit"></i>编辑</span><span class="plus label" data-target="#addFooterBtns" role="button" data-toggle="modal">' +
            '<i class="icon-plus"></i>添加</span><div class="view"><div class="row-fluid mg-3 tac"><button type="button">button按钮</button></div></div></div>'+
            '<div class="fp-column bg-2 bs-1" style="width: 48.50%;"><a href="#close" class="remove label label-important">' +
            '<i class="icon-remove icon-white"></i>删除</a><span class="editor label" data-target="#editorPageNavBtn" role="button" data-toggle="modal">' +
            '<i class="icon-edit"></i>编辑</span><span class="plus label" data-target="#addFooterBtns" role="button" data-toggle="modal">' +
            '<i class="icon-plus"></i>添加</span><div class="view"><div class="row-fluid mg-3 tac"><button type="button">button按钮</button></div></div></div>';
        $('.footer-content .fp-footer').empty().html(_tpl).removeClass('hideEle');
    });
}

//清空modal框
function clearEditorPageNavBtnModal(){
    $('#btnId').val('');
    $('#btnClass').val('');
    $('#btnName').val('');
    $('#btnText').val('');
}
function clearAddPageNavBtnModal(){
   /* $('input[name=btnPosition]').removeAttr("checked");
    $('input[name=btnPosition]').eq(1).attr("checked", "checked");*/
    $('#btnCol').val(1);
}

//初始化设计容器
function initContainer() {
    //表单块拖拽排序
    $("#bodyContent").sortable({
        placeholder: "drag-style-2",
        opacity: .45,
        handle: ".drag"
    });
    removeHtml();//删除操作
    addFooterBtn();//添加按钮操作
}

/*文档就绪函数，工程入口*/
$(function(){
    //加载右侧拖拽区域
    initContainer();

    //左侧表单块拖拽组件
    $(".side-bar .fp-module").draggable({
        connectToSortable: "#bodyContent",
        helper: "clone",
        handle: ".drag",
        start: function (e, t) {
        },
        drag: function (e, t) {
            t.helper.width(400);
        },
        stop: function (e, t) {
            //行拖拽排序
            $("#bodyContent .fp-module-content").sortable({
                connectWith: ".fp-module-content",
                opacity: .45,
                handle: ".drag",
                placeholder: "drag-style-2"
            });
        }
    });
    //左侧表单行拖拽组件
    $("#layout .fp-row").draggable({
        connectToSortable: "#bodyContent .fp-module-content",
        helper: "clone",
        handle: ".drag",
        drag: function (e, t) {
            t.helper.width(400);
        },
        stop: function () {
            $("#bodyContent .fp-column").sortable({
                connectWith: ".fp-column",
                placeholder: "drag-style-3",
                opacity: .45,
                handle: ".drag"
            });
        }
    });
    //左侧组件拖拽
    $("#component .fp-row").draggable({
        connectToSortable: "#bodyContent .fp-column",
        helper: "clone",
        handle: ".drag",
        drag: function (e, t) {
            t.helper.width(400);
        },
        stop: function () {
        }
    });

    //左边菜单折叠效果
    $('.groups-header').on('click', function (e) {
        e.stopImmediatePropagation();//阻止默认事件
        var $groups = $(this).parent(), $tab = $groups.parent();
        if(!$groups.hasClass('opened')) {//动态的隐藏和显示
            var $openedGroups = $tab.find('.opened');//已经处于激活状态
            $openedGroups.find('.groups-body').slideUp('fast');
            $openedGroups.removeClass('opened');//去除激活状态
            $openedGroups.find('.icon').attr('class', 'icon icon-plus');//折叠
            $groups.addClass('opened').find('.groups-body').slideDown('fast');
            $(this).find('.icon').removeClass('icon-plus').addClass('icon-minus');//展开本次点击
        } else return false;
    });

    //页标题编辑
    $('#ephBtn').on('click', function() {
        var _txt = $('#header-title').text();
        $('#pageHeaderVal').val(_txt);
    });
    $('#saveHTitle').on('click', function(){
        var v = $('#pageHeaderVal').val();
        if (v == undefined || v == '') {
            alert('页面标题不能为空');
            return false;
        }
        $('#header-title').html('').html(v);
        $('#editorPageHeader').modal('hide');
    });

    //模块标题编辑
    $('.body-content').on('click', '.fp-module .editor', function(){
        var _txt = $(this).parent().addClass('current-editor').find('.fp-module-title').text();
        $('#pageModuleVal').val(_txt);
    });
    $('#saveMTitle').on('click', function(){
        var _v = $('#pageModuleVal').val();
        if (_v == undefined || _v == '') {
            alert('模块标题不能为空');
            return false;
        }
        $('.current-editor .fp-module-title').text(_v);
        $('.current-editor').removeClass('current-editor');
        $('#editorPageModule').modal('hide');
    });
    $('.close-mt').on('click', function(){
        $('.current-editor').removeClass('current-editor');
        $('#editorPageModule').modal('hide');
    });

    //按钮属性编辑
    $('.footer-content').on('click', '.editor', function(){
        var $btn = $(this).parent().addClass('current-btn').find('button'),
            _id = $btn.attr('id'), _class = $btn.attr('class'), _name = $btn.attr('name'), _txt = $btn.text();
        //赋值
        if(_id) $('#btnId').val(_id);
        if(_class) $('#btnClass').val(_class);
        if(_name) $('#btnName').val(_name);
        if(_txt) $('#btnText').val(_txt);
    });
    $('#saveBtnProperties').on('click', function() {
        var $btn = $('.current-btn').removeClass('current-btn').find('button');
        if($('#btnId').val() != '') $btn.attr('id', $('#btnId').val());
        if($('#btnClass').val() != '') $btn.attr('class', $('#btnClass').val());
        if($('#btnName').val() != '') $btn.attr('name', $('#btnName').val());
        if($('#btnText').val() != '') $btn.text($('#btnText').val());
        clearEditorPageNavBtnModal();//清除modal框内容
        $('#editorPageNavBtn').modal('hide');
    });
    $('.close-btn').on('click', function(){
        $('.current-btn').removeClass('current-btn');//清除激活的样式
        clearEditorPageNavBtnModal();//清除modal框内容
        $('#editorPageNavBtn').modal('hide');
    });

    //添加按钮、按钮数目控制
    $('.btn-icon').on('click', function(){
        var $this = $(this), _isPlus = $this.hasClass('btn-icon-plus'),
            _num = parseInt($('#btnCol').val());
        if(_isPlus){
            _num += 1;//新增一个
        } else {
            if(_num == 1) return false;//最低为1
            _num -= 1;//减去一个
        }
        $('#btnCol').val(_num);//重新赋值
        return false;
    });
    $('.footer-content').on('click', '.plus', function(){
        clearAddPageNavBtnModal();//清除modal框内容
        $(this).parent().addClass('current-btn');//激活编辑列
    });
    $('#addBtn').on('click', function(){
        var _p = $('#addFooterBtns input[name=btnPosition]:checked').val(),
            _num = parseInt($('#btnCol').val()), _length = $('.fp-footer .fp-column').length,
            _percent =  parseFloat((100 - (_num + _length)*2.4)/(_num + _length)).toFixed(2),
            _tpl = '';
        for(var i=0; i<_num; i++){
            _tpl += '<div class="fp-column bg-2 bs-1" style="width: '+ _percent + '%;"><a href="#close" class="remove label label-important">' +
            '<i class="icon-remove icon-white"></i>删除</a><span class="editor label" data-target="#editorPageNavBtn" role="button" data-toggle="modal">' +
            '<i class="icon-edit"></i>编辑</span><span class="plus label" data-target="#addFooterBtns" role="button" data-toggle="modal">' +
            '<i class="icon-plus"></i>添加</span><div class="view"><div class="row-fluid mg-3 tac"><button type="button">button按钮</button></div></div></div>';
        }
        $('.fp-footer .fp-column').attr('style', 'width:'+_percent+'%;');
        if(_p==0) $('.current-btn').before(_tpl);
        else $('.current-btn').after(_tpl);
        $('.current-btn').removeClass('current-btn');//清除激活的样式
        $('#addFooterBtns').modal('hide');
    });
    $('.close-add-btn').on('click', function(){
        $('.current-btn').removeClass('current-btn');//清除激活的样式
        $('#addFooterBtns').modal('hide');
    });

    //头部和底部是否显示
    $('#showHeader').on('click', function () {
        $('.header-content').toggle('fast', function(){
            if(($(this).attr('style')==undefined?'':$(this).attr('style')).indexOf('none')!=-1){
                if($('.body-content').hasClass('mh-2')) $('.body-content').removeClass('mh-2').addClass('mh-3');
                else if($('.body-content').hasClass('mh-3')) $('.body-content').removeClass('mh-3').addClass('mh-0');
            } else {
                if($('.body-content').hasClass('mh-3')) $('.body-content').removeClass('mh-3').addClass('mh-2');
                else if($('.body-content').hasClass('mh-0')) $('.body-content').removeClass('mh-0').addClass('mh-3');
            }
        });
    });
    $('#showFooter').on('click', function(){
        $('.footer-content').toggle('fast', function(){
            if(($(this).attr('style')==undefined?'':$(this).attr('style')).indexOf('none')!=-1){
                if($('.body-content').hasClass('mh-2')) $('.body-content').removeClass('mh-2').addClass('mh-3');
                else if($('.body-content').hasClass('mh-3')) $('.body-content').removeClass('mh-3').addClass('mh-0');
            } else {
                if($('.body-content').hasClass('mh-3')) $('.body-content').removeClass('mh-3').addClass('mh-2');
                else if($('.body-content').hasClass('mh-0')) $('.body-content').removeClass('mh-0').addClass('mh-3');
            }
        });
    });

    //清空
    $('#clear').on('click', function(e){
        $('#header-title').html('').html('页标题');//重置页标题
        $('#bodyContent').empty();//清空主体部分
        var _tpl = '<span class="add label"><i class="icon-plus"></i>添加按钮</span><div class="fp-footer bs-1 mh-1 ps-1 hideEle"></div>';
        $('#footerContent').empty().html(_tpl);//还原底部按钮导航
    });

    //预览
    $('#sourcepreview').on('click', function(){
        downLoadPage();//先解析
        viewFormPage(true);//后预览
    });
    //编辑
    $('#devpreview').on('click', function(){
        viewFormPage(false);
    });
    //保存
    $('#savePage').on('click', function() {
        //downLoadPage();//解析入口
        alert('暂未连接数据库');
    });
});