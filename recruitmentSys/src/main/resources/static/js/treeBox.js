function treeBox(Config) {
// 开始定义参数
    var el = eval(Config.el);
    var w = Config.width;
    var h = Config.height;
    var data = Config.data;
    var topData = Config.topData;
    var sl = Config.selectedNum;
    //判断参数是否存在
    if(w == null) {
        var wLv1 = 160;
        var wLv2 = 160;
        var wLv3 = 160;
        var wSelectde = 200;
    } else {
        var wLv1 = w.lv1;
        var wLv2 = w.lv2;
        var wLv3 = w.lv3;
        var wSelectde = w.selected;
    }
    if(h == null) {
        h = 280
    }
    if(sl == null) {
        sl = 3
    }
    var wBox = wLv1 + wLv2 + wLv3 + wSelectde;
// 根据数据结构构建DOM
    var lv_1 = '';
    var lv_2_parent = '';
    var lv_3_parent = '';
    var lv_0 = '';
    for (var k in data) {
        lv_1 += '<a class="lv1" data-id="'+ data[k].id +'">'+ data[k].name +'</a>';
        lv_2_parent += '<div class="lv2-parent" data-parent="'+ data[k].id +'"></div>'
        for (var i in data[k].children) {
            lv_3_parent += '<div class="lv3-parent" data-parent="' + data[k].children[i].id +'"></div>'
        }
    }

    var html = '';
    html += '<div class="treeBox" style="width:'+ wBox +'px;">';//判断是否构建常用DOM
    if(topData == null) {

    } else {
        for (var k in topData) {
            lv_0 += '<a class="tree-top-item" data-id="'+ topData[k].id +'" data-uid="'+ topData[k].uid +'" tree-top-selected=false>' + topData[k].name +'</a>'
        }
        html += '<div class="tree-top"><p>常用工种类型</p><div>' + lv_0 + '</div></div>';
    }
    html += '<table cellspacing="0"><tr>';
    html += '<td width="' + wLv1 + '" style="border-left:none;"><div class="tree tree-lv1" style="height:'+ h + 'px;">' + lv_1 + '</div></td>';
    html += '<td width="' + wLv2 + '"><div class="tree tree-lv2" style="height:'+ h + 'px;">'+ lv_2_parent +'</div></td>';
    html += '<td width="' + wLv3 + '"><div class="tree tree-lv3" style="height:'+ h + 'px;">'+ lv_3_parent +'</div></td>';
    html += '<td width="' + wSelectde + '"style="border-right:none;><div class="tree">';
    html += '<div class="tree-status"><span style="font-size:14px;color:#777;">已选择 ( <span class="selectedNum">0</span> )</span><a class="tree-del-all">清空</a></div>';
    html += '<div class="tree-selected"></div></div></td>';
    html += '</tr></table>';
    html += '<div class="tree-send-val"><a class="tree-btn tree-close">关闭</a><a class="tree-btn tree-confirm">确定</a></div>';
    html += '</div>';
    $("#treeBox").append(html);
    var n = 0;
    for (var k in data) {
        var lv_2_son = '';
        for (var i in data[k].children) {
            n++;//给第三等级的列表做索引
            lv_2_son += '<a class="lv2" data-id="'+ data[k].children[i].id +'">' + data[k].children[i].name +'</a>';
            var lv_3_son = '';
            for (var j in data[k].children[i].children) {
                var v = data[k].children[i].children[j].id;
                var name = data[k].children[i].children[j].name;
                var uid = data[k].children[i].children[j].uid;
                lv_3_son += '<label><input type="checkbox" class="lv3" value="' + v +' " data-uid="'+ uid +'" data-name="' + name + '"><span>'+ name +'</span></label>'
            }
            $(".lv3-parent").eq(n-1).append(lv_3_son);//这里不能eq(i) 所以在前方记录了循环的次数
        }
        $(".lv2-parent").eq(k).append(lv_2_son)
    }
    //默认每列第一个显示以及选中
    $(".lv2-parent").eq(0).addClass("tree-show");
    $(".lv3-parent").eq(0).addClass("tree-show");
    $(".lv1").eq(0).addClass("tree-active");
    $(".lv2").eq(0).addClass("tree-active");
// 焦点事件
    el.focus(function () {
        $(".treeBox").css({'display':'block'})
    });
//  关闭事件
    $(".tree-close").on('click',function () {
    		$(".treeBox").css({'display':'none'})
    });
// 点击事件 根据绑定的自定义属性做为参数 显示对应的列表
    $(".lv1").on('click',function () {
        var v = $(this).data('id');
        $(".lv2-parent").each(function (index) {
            if($(this).data('parent') == v) {
                $(".lv2-parent").removeClass("tree-show");
                $(".lv2-parent").eq(index).addClass("tree-show");
                $(".lv2-parent").eq(index).children().eq(0).click();
            }
        });
        $(".lv1").removeClass("tree-active");
        $(this).addClass("tree-active");
        $(".tree").scrollTop(0);
    })
    $(".lv2").on('click',function () {
        var v = $(this).data('id');
        $(".lv3-parent").each(function (index) {
            if($(this).data('parent') == v) {
                $(".lv3-parent").removeClass("tree-show");
                $(".lv3-parent").eq(index).addClass("tree-show")
            }
        });
        $(".lv2").removeClass("tree-active");
        $(this).addClass("tree-active");
        $(".tree").scrollTop(0);
    });
    //当复选框状态改变 添加删除元素并且将值绑定
    var max = sl - 1;
    $(".lv3").on('change',function () {
        var v = $(this).val();
        var name = $(this).data('name');
        var uid = $(this).data('uid');
        var l = $(".tree-selected-item").length;
        if($(this).prop('checked')) {
            if(l < max) {
                var item = '<p class="tree-selected-item" data-id="'+ v +'" data-uid="'+ uid +'" data-name="' + name + '"><span>'+name+'</span><a class="tree-del-this"></a></p>'
                $(".tree-selected").append(item);
            } else if(l == max) {
                var item = '<p class="tree-selected-item" data-id="'+ v +'" data-uid="'+ uid +'" data-name="' + name + '"><span>'+name+'</span><a class="tree-del-this"></a></p>'
                $(".tree-selected").append(item);
                $(".lv3:not(:checked)").prop("disabled", true);
            }
            $(".selectedNum").text(l+1);
        } else {
            $(".tree-selected-item").each(function (index) {
                if($(this).data('id') == v) {
                    $(".tree-selected-item").eq(index).remove()
                }
            });
            $(".tree-top-item").each(function (index) {
                if($(this).data('id') == v) {
                    $(this).attr("tree-top-selected",false);
                    $(this).removeClass('tree-active');
                }
            });
            $(".lv3:not(:checked)").prop("disabled", false);
            $(".selectedNum").text(l-1);
        }
    });
    //常用选择 添加并且关联复选框
    $(".tree-top-item").on('click',function () {
        var v = $(this).data('id');
        var uid = $(this).data('uid');
        var name = $(this).text();
        var l = $(".tree-selected-item").length;
        var top_s = $(this).attr('tree-top-selected');
        console.log(top_s);
        if(top_s == 'true') {
            return false
        } else {
            if(l < max) {
                $(this).attr('tree-top-selected',true);
                $(this).addClass('tree-active');
                var item = '<p class="tree-selected-item" data-id="'+ v +'" data-uid="'+ uid +'" data-name="' + name + '"><span>'+name+'</span><a class="tree-del-this"></a></p>'
                $(".tree-selected").append(item);
                $(".lv3").each(function (index) {
                    if($(this).val() == v) {
                        $(this).prop("checked",true)
                    }
                });
                $(".selectedNum").text(l+1);
            } else if(l == max) {
                $(this).attr('tree-top-selected',true);
                $(this).addClass('tree-active');
                var item = '<p class="tree-selected-item" data-id="'+ v +'" data-uid="'+ uid +'" data-name="' + name + '"><span>'+name+'</span><a class="tree-del-this"></a></p>'
                $(".tree-selected").append(item);
                $(".lv3").each(function (index) {
                    if($(this).val() == v) {
                        $(this).prop("checked",true)
                    }
                });
                $(".lv3:not(:checked)").prop("disabled", true);
                $(".selectedNum").text(l+1);
            }
        }
        // console.log(v,uid,name);
    })
    //删除所有勾选的选项 并且将勾选的复选框恢复
    $(".tree-del-all").on('click',function () {
        $(".lv3").prop("checked",false);
        $(".tree-selected").empty();
        $(".tree-top-item").attr('tree-top-selected',false);
        $(".tree-top-item").removeClass('tree-active');

    });
    //删除指定的选项 并且将指定的复选框恢复
    $("body").on('click','.tree-del-this',function () {
        var v = $(this).parent().data('id');
        var l = $(".tree-selected-item").length;
        $(".lv3").each(function (index) {
            if($(this).val() == v) {
                $(this).prop("checked",false)
            }
        });
        $(".tree-top-item").each(function (index) {
            if($(this).data('id') == v) {
                $(this).attr("tree-top-selected",false);
                $(this).removeClass('tree-active');
            }
        });
        $(this).parent().remove();
        $(".lv3:not(:checked)").prop("disabled", false);
        $(".selectedNum").text(l-1);
    });
    // 以数组的形式返回选中的值
    var selected = [];
    var strSelected = '';
    $(".tree-confirm").on('click',function () {
        selected = [];//每次清空数组
        strSelected = '';//每次清空字符窜
        $(".tree-selected-item").each(function () {
            var name = $(this).data('name');
            var v = $(this).data('id');
            var uid = $(this).data('uid');
            selected.push({
                name:name,
                value:v,
                uid:uid
            });
            strSelected += name + '&';
        });
        strSelected = strSelected.substring(0, strSelected.length - 1);
        el.val(strSelected);
        Config.confirm(selected);
        $(".treeBox").css({'display':'none'})
    })
}