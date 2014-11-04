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
    $(".right-content, .footer-content").delegate(".remove", "click", function(e) {
        e.preventDefault();
        $(this).parent().remove();
        if (!$(".right-content .module").length > 0) {
            clearDemo();
        }
    });
}

//初始化设计容器
function initContainer(){
    //表单块拖拽排序
    $(".right-content").sortable({
        placeholder: "sort-state-highlight2",
        opacity: .45,
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function(e,t) {
            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });
    $('.footer-content .box-column').sortable({
        placeholder: "sort-state-highlight3",
        connectWith: ".box-column",
        opacity: .45,
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        stop: function(e,t) {
            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });

    removeElm();//移除元素
}

$(function(){//js程序入口函数
    //初始化右侧容器
    initContainer();

    //左侧表单块拖拽组件
    $(".left-content .module").draggable({
        connectToSortable: ".right-content",
        helper: "clone",
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function(e, t) {
            //行拖拽排序
            $(".right-content .module .fieldset-content").sortable({
                connectWith: ".fieldset-content",
                placeholder: "sort-state-highlight",
                opacity: .45,
                handle: ".drag",
                start: function(e,t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function(e,t) {
                    if(stopsave>0) stopsave--;
                    startdrag = 0;
                }
            });

            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });

    //左侧表单列拖拽组件
    $(".left-content .field").draggable({
        connectToSortable: ".right-content .fieldset-content",
        helper: "clone",
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function() {
            $('.right-content .field').css('display', 'block').removeClass('manuColModel');
            $(".right-content .box-column").sortable({
                placeholder: "sort-state-highlight3",
                connectWith: ".box-column",
                opacity: .45,
                handle: ".drag",
                start: function(e,t) {
                    if (!startdrag) stopsave++;
                    startdrag = 1;
                },
                stop: function(e,t) {
                    if(stopsave>0) stopsave--;
                    startdrag = 0;
                }
            });
            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });

    $(".left-content .box").draggable({
        connectToSortable: ".box-column",
        helper: "clone",
        handle: ".drag",
        start: function(e,t) {
            if (!startdrag) stopsave++;
            startdrag = 1;
        },
        drag: function(e, t) {
            t.helper.width(400)
        },
        stop: function() {
            if(stopsave>0) stopsave--;
            startdrag = 0;
        }
    });

    //手工输入模式
    $('#manuColModelBtn').on("click", function(e){
        e.preventDefault();
        var col = $('#colPer').val(), percent = '100%', tpl;
        if(col == null||col == ""){
            alert("手工输入的比例不能为空");
            return false;
        }
        var tmp = col.split(',');//临时数组
        var _view = '';
        for(var i=0;i<tmp.length;i++){
            percent = tmp[i];
            tpl = '<div class="box-column" style="width: ' + percent + '"></div>';
            _view += tpl;
        }
        console.log(_view);
        $('#manuColModel').html('').html(_view);//写入列模式
        $('#manuInput').val('').val(col);//定义列百分比
        $('.left-content .manuColModel').css('display', 'flex');
    });

    //添加底部按钮
    $('.addBtn').on('click', function(){
        var $btnName = $('#btnName').val(), $btnId = $('#btnId').val();
        if($btnName == null || $btnName == ''
            || $btnId == null || $btnId == ''){
            alert('请确保按钮ID和名称都正确输入');
            return false;
        }
        var tpl = ''
    });

    //修改页面标题
    $('#ephBtn').on('click', function(){
        var tt = $('#header-title').text();
        $('#pageHeaderVal').val(tt);
    });
    $('#savecontent').on('click', function(){
        var v = $('#pageHeaderVal').val();
        if(v==undefined || v==''){
            alert('页面标题不能为空');
            return false;
        }
        $('#header-title').html('').html(v);
        $('#editorPageHeader').modal('hide')
    });
    $('#showHeader').on('click',function(){
       /* var check = $(this).toggle('checked');
        alert(check);*/
        $('.builder-header').toggle();
    });


    //左边菜单折叠效果
    $('.groups-header .icon').on('click', function(){
        var $parent = $(this).parent().parent(),
            $groupBd = $('.groups-body', $parent);
        $groupBd.slideToggle('fast');//动态的隐藏和显示
        if($(this).hasClass('icon-plus')){
            $(this).removeClass('icon-plus').addClass('icon-minus');
        }else{
            $(this).removeClass('icon-minus').addClass('icon-plus');
        }
    });

    //清空设计器内容
    $('#clear').on('click', function(){
        $(".right-content, .footer-content").empty();
    });
});