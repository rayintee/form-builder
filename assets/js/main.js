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
    $(".right-content").delegate(".remove", "click", function(e) {
        e.preventDefault();
        $(this).parent().remove();
        if (!$(".right-content .module").length > 0) {
            clearDemo();
        }
    })
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
            //handleJsIds();
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
            tpl = '<div class="box-column" style="width: ' + percent + '">here for content</div>';
            _view += tpl;
        }
        console.log(_view);
        $('#manuInput').val('').val(col);//定义列百分比
        $('#manuColModel').html('').html(_view);//写入列模式
    });
});