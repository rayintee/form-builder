/**
 * Created by raolongfei on 2014-11-11.
 * 表单定制器lib库
 */
//蒙层提示
function loadingMsg(val){
    if(!val){
        $("body").find(".loading").remove();
    } else {
        var $task = $('<div class="loading"><div class="loading-task"><i class="loading-icon"></i><span class="loading-msg">加载中...</span></div></div>');
        $("body").append($task);
    }
}

//ajax请求处理
function getRequestByAjax(url, type, data, success, fail){
    var dataType = 'json', timeout = 30;
    $.ajax({
        url: url,
        type:type,
        data:data,
        dataType:dataType,
        timeout:timeout*1000,
        beforeSend: function () {
            loadingMsg(true);
        }
    }).always(function( data, textStatus,jqXHR ) {
        setTimeout(function(){//延迟800ms
            loadingMsg(false);
        }, 800);
        if(textStatus=='timeout'){
            alert( "请求超时"  );
            return false;
        }else if(textStatus !='success'){
            alert( "请求错误："+ textStatus );
            return false;
        }
    }).done(function(data){
        if(success)
            success(data);
    }).fail(function () {
        alert('请求接口失败');
        if(fail){
            fail();
        }
        return false;
    });
}

//获取地址栏后面的参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//解析组件数据
function parserComponentData(data, _ts){
    var ret='';//返回参数
    data = data || [];
    //console.log(JSON.stringify(data));
    if(data.length >0){
        $.each(data, function(i, v){
            if(v.component) {
                var _component_type = v['component'], _options = $.parseJSON(v['options']),
                    _type = v['type'], _component, _label = v['label'];//定义参数
                if(_component_type=='input'){//输入框
                    if(_type =='radio' || _type == 'checkbox'){
                        var  _c = '';//定义参数
                        if(_options && _options.length>0) {
                            $.each(_options, function(_i, _v){
                                _c += '<input type="'+((v['type']==undefined || v['type']==null||v['type']=='none')?'':v['type'])+'"'+
                                ' id="'+((v['id']==undefined||v['id']==null||v['id']=='none')?'':(v['id']+'_'+_i))+'"' +
                                ' class="'+((v['class']==undefined||v['class']==null||v['class']=='none')?'':v['class'])+'"' +
                                ' name="'+((v['name']==undefined||v['name']==null||v['name']=='none')?'':v['name'])+'"'+
                                ' value="'+((_v['value']==undefined||_v['value']==null||_v['value']=='none')?'':_v['value'])+'" />'
                                + ((_v['text']==undefined||_v['text']==null||_v['text']=='none')?'':_v['text']) + ' ';
                            });
                        }
                        _component = _c;//赋值给组件
                    } else {
                        _component = '<input type="'+((v['type']==undefined || v['type']==null||v['type']=='none')?'':v['type'])+'"'+
                        ' id="'+((v['id']==undefined||v['id']==null||v['id']=='none')?'':v['id'])+'"' +
                        ' class="'+((v['class']==undefined||v['class']==null||v['class']=='none')?'':v['class'])+'"' +
                        ' name="'+((v['name']==undefined||v['name']==null||v['name']=='none')?'':v['name'])+'" />';
                    }
                } else if(_component_type=='select'){//下拉框
                    _component = '<select class="'+((v['class']==undefined||v['class']==null||v['class']=='none')?'':v['class'])+'"'+
                        ' name="'+((v['name']==undefined||v['name']==null||v['name']=='none')?'':v['name'])+'"' +
                        ' id="'+((v['id']==undefined||v['id']==null||v['id']=='none')?'':v['id'])+'" >';
                    if(_options && _options.length>0){
                        var _c = '';//定义参数
                        $.each(_options, function(_i, _v){
                            _c+= '<option value="' +((_v['value']==undefined||_v['value']==null||_v['value']=='none')?'':_v['value'])+ '">'+
                            ((_v['text']==undefined||_v['text']==null||_v['text']=='none')?'':_v['text'])+'</option>';
                        });
                        _component += _c;
                    }
                    _component += '</select>';
                } else if(_component_type=='textarea'){//文本域
                    _component = '<textarea class="'+((v['class']==undefined||v['class']==null||v['class']=='none')?'':v['class'])+'"'+
                    ' name="'+((v['name']==undefined||v['name']==null||v['name']=='none')?'':v['name'])+'"' +
                    ' id="'+((v['id']==undefined||v['id']==null||v['id']=='none')?'':v['id'])+'" ></textarea>';
                }
                ret += _ts._tPreview + _label + _ts._tViewLabel + _label + _ts._tView + _component +_ts._tViewFoot;
            }
        });
    }
    return ret;
}

//初始化表单字段组件
function initComponent(pageCode){
    var _preview = 'Text Input 文本输入框',
        _view_label = 'Text Input',
        _view_component = '<input id="#" name="textinput-0" type="text" placeholder="placeholder" class="input-xlarge">',
        _tpl_header = '<div class="group"><h5>表单字段</h5><hr>', _tpl_footer = '</div>',
        _tpl_preview = '<div class="fp-row ui-draggable"><a href="#close" class="remove label label-important">' +
            '<i class="icon-remove icon-white"></i>删除</a>' +
            '<span class="drag label"><i class="icon-move"></i>拖动</span>' +
            '<div class="preview">',
        _tpl_view_label = '</div><div class="view"><div class="row-fluid clearfix mg-2 rs-1"><div class="component-group"><label class="group-label">',
        _tpl_view_component = '</label><div class="group-control">',
        _tpl_view_compelete = '</div></div></div></div></div>',
        _tpl,
        _succ = function (data){ //获取组件成功回调函数
            var _ts = {
                _tPreview: _tpl_preview,
                _tViewLabel: _tpl_view_label,
                _tView: _tpl_view_component,
                _tViewFoot: _tpl_view_compelete
            };
            _tpl = _tpl_header + parserComponentData(data, _ts) + _tpl_footer;
            $('#componentBody ').empty().html(_tpl);//写入组件模块
            $("#component .fp-row").draggable({//注册左侧组件拖拽
                connectToSortable: "#bodyContent .fp-column",
                helper: "clone",
                handle: ".drag",
                drag: function (e, t) {
                    t.helper.width(400);
                },
                stop: function () {
                }
            });
        };
    if(pageCode){ //调用远程服务
        var _url = 'page.shtml?action=queryElement',
            _type = 'post', _data = {pageCode: pageCode};
        getRequestByAjax(_url, _type, _data, _succ);//调用ajax请求
    } else {
        $.get('assets/data/component.json', _succ);//调用本地请求
    }
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
                $('.footer-content .fp-footer').find('.fp-column').attr('style', 'width:' +_percent + '%;');
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
    var  _isDebug = true, //调试模式为true
        id = GetQueryString('id'), pageCode = GetQueryString('pageCode');//获取地址栏参数

    //判断地址栏参数是否为空
    if(!_isDebug && (id==null||id==undefined||id==''||pageCode==null||pageCode==undefined||pageCode=='')) {
        alert('请确保表单页id和pageCode不能为空');
        window.close();//当前页面关闭
        return false;
    } else {
        $('body').removeClass('hideEle');//加载页面

        //组件加载
        var _pc = _isDebug?null: pageCode;//默认的是非调试模式
        //初始化页面组件
        setTimeout(function(){//延迟100ms
            initComponent(_pc);
        }, 80);

        //加载右侧拖拽区域
        initContainer();

        //左侧表单块拖拽组件
        $(".side-bar .fp-module").draggable({
            connectToSortable: "#bodyContent",
            helper: "clone",
            handle: ".drag",
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
            downLoadPage();//解析入口
            if(_isDebug){
                alert('暂未连接数据库');
            } else {
                var _url = 'page.shtml?action=doModi',
                    _type = 'post', _data = {pageCode: pageCode},
                    _succ = function (data) {
                        alert(JSON.stringify(data));
                    };
                getRequestByAjax(_url, _type, _data, _succ);//调用ajax请求
            }
        });
    }
});