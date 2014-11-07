/**
 * Created by Rayintee on 14-10-15.
 */
var timerSave = 1000;
var stopsave = 0;
var startdrag = 0;

//清除容器
function clearDemo() {
    $(".right-content").empty();
    /*layouthistory = null;
     if (supportstorage())
     localStorage.removeItem("layoutdata");*/
}

//删除元素
function removeElm() {
    $(".right-content, .footer-content").delegate(".remove", "click", function (e) {
        e.preventDefault();
        var _isFooterBtn = $(this).parent().hasClass('box-column');
        $(this).parent().remove();
        if(_isFooterBtn) {//按钮删除
            var _num = $('#btn-field').children().length;
            if(_num > 0) {
                var percent = (100 / _num).toFixed(2) + '%';
                $('#btn-field').children().attr('style', 'width:' + percent);
            }
        }
        if (!$(".right-content .module").length > 0) {
            clearDemo();
        }
    });
}

//初始化设计容器
function initContainer() {
    //表单块拖拽排序
    $(".right-content").sortable({
        placeholder: "sort-state-highlight2",
        opacity: .45,
        handle: ".drag",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function (e, t) {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });
    $('.footer-content .box-column').sortable({
        placeholder: "sort-state-highlight3",
        connectWith: ".box-column",
        opacity: .45,
        handle: ".drag",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function (e, t) {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });

    removeElm();//移除元素
}

//清空modal框
function clearEditorPageNavBtnModal(){
    $('#btnId').val('');
    $('#btnClass').val('');
    $('#btnName').val('');
    $('#btnText').val('');
}

//解析模块
function parserHtml(){
    //赋值右侧的片段
    $("#download-layout").children().html($('.bulider-container .builder-right').html());
    var $t = $("#download-layout").children();
    $t.find('.preview, .drag, .remove, .editor').remove();//删除编辑操作等部分
    //定义参数
    var $html = $('<p>'), isHeadShow = ($t.find('.builder-header').attr('style')==undefined?'':$t.find('.builder-header').attr('style')).indexOf('none')==-1,
        $t_head = $t.find('.builder-header').children(), $t_body = $t.find('.builder-body').children(), $t_footer = $t.find('.builder-footer').children(),
        $tb = $('<div class="fp-modules">');

    // head 解析
    if(isHeadShow){
        //连同本身一起复制
        $t_head = ($('<div class="fp-header">').append($t_head.find('.title').removeAttr('id').attr('class', 'fp-head-title'))).clone();
        $html.append($t_head);
    }
    //body 解析
    $t_body.find('.module').each(function(){
        var $fm = $('<div class="fp-module">'), $legend = $('<div class="fp-module-title">').html($('legend', $(this)).html());
        $fm.append($legend);//添加到fp-module里面
        $(this).find('.field').each(function(){//循环遍历
            var $fr = $('<div class="fp-row">');//构造行
            $('.box-column', $(this)).each(function(){
                var $fc = $('<div class="fp-column" style="'+ $(this).attr('style') +'">');//构造列
                $(this).find('.box-group').each(function(){
                    var $fg = $('<div class="fp-group">').append($(this).children());
                    $fc.append($fg);
                });
                $fr.append($fc);//添加到行里
            });
            $fm.append($fr);
        });
        $tb.append($fm);
    });
    //footer解析
    $t_footer = $('<div class="fp-footer">').append($t_footer.find('button'));

    //添加到$html对象中
    $html.append($tb).append($t_footer);
    $("#download-layout").children().empty().html($html.html());

    return $html.html();
}

$(function () {//js程序入口函数
    //初始化右侧容器
    initContainer();

    //左侧表单块拖拽组件
    $(".left-content .module").draggable({
        connectToSortable: ".right-content",
        helper: "clone",
        handle: ".drag",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function (e, t) {
            t.helper.width(400)
        },
        stop: function (e, t) {
            //行拖拽排序
            $(".right-content .module .fieldset-content").sortable({
                connectWith: ".fieldset-content",
                placeholder: "sort-state-highlight",
                opacity: .45,
                handle: ".drag",
                start: function (e, t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function (e, t) {
                    if (stopsave > 0) stopsave--;
                    startdrag = 0;
                }
            });

            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });

    //左侧表单列拖拽组件
    $(".left-content .field").draggable({
        connectToSortable: ".right-content .fieldset-content",
        helper: "clone",
        handle: ".drag",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function (e, t) {
            t.helper.width(400)
        },
        stop: function () {
            $('.right-content .field').css('display', 'block').removeClass('manuColModel');
            $(".right-content .box-column").sortable({
                placeholder: "sort-state-highlight3",
                connectWith: ".box-column",
                opacity: .45,
                handle: ".drag",
                start: function (e, t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function (e, t) {
                    if (stopsave > 0) stopsave--;
                    startdrag = 0;
                }
            });
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });

    $(".left-content .box").draggable({
        connectToSortable: ".box-column",
        helper: "clone",
        handle: ".drag",
        start: function (e, t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function (e, t) {
            t.helper.width(400)
        },
        stop: function () {
            if (stopsave > 0) stopsave--;
            startdrag = 0;
        }
    });

    //手工输入模式
    $('#manuColModelBtn').on("click", function (e) {
        e.preventDefault();
        var col = $('#colPer').val(), percent = '100%', tpl;
        if (col == null || col == "") {
            alert("手工输入的比例不能为空");
            return false;
        }
        var tmp = col.split(',');//临时数组
        var _view = '';
        for (var i = 0; i < tmp.length; i++) {
            percent = tmp[i];
            tpl = '<div class="box-column" style="width: ' + percent + '"></div>';
            _view += tpl;
        }
        $('#manuColModel').html('').html(_view);//写入列模式
        $('#manuInput').val('').val(col);//定义列百分比
        $('.left-content .manuColModel').css('display', 'flex');
    });

    //修改页面标题
    $('#ephBtn').on('click', function () {
        var tt = $('#header-title').text();
        $('#pageHeaderVal').val(tt);
    });
    $('#savecontent').on('click', function () {
        var v = $('#pageHeaderVal').val();
        if (v == undefined || v == '') {
            alert('页面标题不能为空');
            return false;
        }
        $('#header-title').html('').html(v);
        $('#editorPageHeader').modal('hide');
    });
    $('#showHeader').on('click', function () {
        $('.builder-header').toggle();
    });

    //修改模块标题
    $('.right-content').on('click', '.epmBtn', function (e) {
        var $legend = $(this).parent().addClass('current-editor').find('legend'), //标识当前正在编辑的模块
            _txt = $legend.text();
        $('#pageModuleVal').val(_txt);
    });
    $('#saveMT').on('click', function(e){
        var _v = $('#pageModuleVal').val();
        if (_v == undefined || _v == '') {
            alert('模块标题不能为空');
            return false;
        }
        $('.current-editor legend').text(_v);
        $('.current-editor').removeClass('current-editor');
        $('#editorPageModule').modal('hide');
    });
    $('.close-mt').on('click', function(){
        $('.current-editor').removeClass('current-editor');
        $('#editorPageModule').modal('hide');
    });

    //左边菜单折叠效果
    $('.groups-header .icon').on('click', function () {
        var $parent = $(this).parent().parent(),
            $groupBd = $('.groups-body', $parent);
        $groupBd.slideToggle('fast');//动态的隐藏和显示
        if ($(this).hasClass('icon-plus')) {
            $(this).removeClass('icon-plus').addClass('icon-minus');
        } else {
            $(this).removeClass('icon-minus').addClass('icon-plus');
        }
    });

    // 清空设计器内容
    // 只清空body和底部
    $('#clear').on('click', function () {
        $(".right-content, .footer-content").empty();
    });

    //底部按钮数目控制
    $('.btnCol').on('click', function(e){
        e.stopImmediatePropagation();
        var $this = $(this), _isPlus = $this.hasClass('col-r'),
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

    //添加按钮
    $('#addBtn').on('click', function(e){
        e.stopImmediatePropagation();
        var _val = parseInt($('#btnCol').val()) + $('#btn-field').children().length;
        var percent = (100 / _val).toFixed(2) + '%';
        if($('#btn-field').children().length > 0) $('#btn-field').children().attr('style', 'width:' + percent);
        var $btnCol = '<div class="box-column ui-sortable" style="width:'+ percent + '">' +
        '<a href="#close" class="remove label label-important"><i class="icon-remove icon-white"></i>删除</a>' +
        '<span class="editor label" data-target="#editorPageNavBtn" role="button" data-toggle="modal">' +
        '<i class="icon-edit"></i>编辑</span><div class="btn-field ui-draggable"><div class="view">' +
        '<button type="button">button按钮</button></div></div></div>';
        for(var i=0; i< parseInt($('#btnCol').val()); i++){
            $('#btn-field').append($btnCol);//添加到末尾
        }
        return false;
    });

    //button属性编辑
    $('#btn-field').on('click', '.editor', function(e){
        e.preventDefault();
        var $parent = $(this).parent(), $btn = $('button', $parent),
            _id = $btn.attr('id'), _class = $btn.attr('class'),
            _name = $btn.attr('name'), _text = $btn.text();
        //赋值
        if(_id) $('#btnId').val(_id);
        if(_class) $('#btnClass').val(_class);
        if(_name) $('#btnName').val(_name);
        if(_text) $('#btnText').val(_text);
        $btn.addClass('editor-active');//标识当前正在编辑的按钮
    });
    //保存修改
    $('#saveBtnProperties').on('click', function(){
        var $btn = $('.editor-active', '#btn-field').removeClass('editor-active');
        if($('#btnId').val() != '') $btn.attr('id', $('#btnId').val());
        if($('#btnClass').val() != '') $btn.attr('class', $('#btnClass').val());
        if($('#btnName').val() != '') $btn.attr('name', $('#btnName').val());
        if($('#btnText').val() != '') $btn.text($('#btnText').val());
        clearEditorPageNavBtnModal();//清除modal框内容
        $('#editorPageNavBtn').modal('hide');
    });
    $('.btn-close').on('click', function(){
        $('.editor-active', '#btn-field').removeClass('editor-active');//清除激活的样式
        clearEditorPageNavBtnModal();//清除modal框内容
        $('#editorPageNavBtn').modal('hide');
    });

    //保存到数据库
    $('#savePage').on('click', function(e){
        e.preventDefault();
        var data_header = '', data_body, data_footer,
            _style = $('.builder-header').attr('style') == undefined ? '': $('.builder-header').attr('style'),
            header_exist = _style.indexOf('none') == -1;//头部是否存在
        if(header_exist) {
            data_header = $('.builder-header .header-content').html();
        }
        data_body = $('.builder-body .right-content').html();
        data_footer = $('.footer-content .field-box').html();
        var origin_data = {
            o_data: {
                header: data_header,
                body: data_body,
                footer: data_footer
            }
        };
        parserHtml();//解析模块
        //console.log(JSON.stringify(origin_data));
    });
});