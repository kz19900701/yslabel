//使用方法
//var now = new Date();
//var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function removeByValue(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function indexOf(arr, obj) {
    for (var i in arr) {
        if (arr[i] === obj) {
            return i
        }
    }
    return -1
}
function renderHistory() {
    $("#history_list").empty();
    if (localStorage.getItem("history_list1"))
        history_list = JSON.parse(localStorage.getItem("history_list1"))
    else
        history_list = [];
    if (history_list) {
        for (i = (history_list.length - 1); i >= 0; i--) {
            $("#history_list").append('<p class="tm-text history_item"><a href="#" onclick="get_new_content(\''+history_list[i].content_id+'\')">' + history_list[i].content + '</a></p>')
        }
    }
}
function extractRender() {
    keywordPositionList.sort(positionSort);
    endTemp=0;
    contentTemp='';
    length=0;
    var i = 0;
    $("#keywords").empty();
    if (keywordPositionList.length == 0) {
        if(content == undefined) {
            content = "";
        }
        $("#content").html("<span id='span0' class='class0' prelength='0'>" + content + "</span>");
    }
    for(var positionIndex in keywordPositionList) {
        keywordPositionTemp=keywordPositionList[positionIndex];
        contentTemp+="<span id='span"+i+"' class='class' prelength='"+(length)+"'>"+content.substring(endTemp,keywordPositionTemp.start)+"</span>"+"<span id='span"+(i+1)+"' style='border-radius:4px;'  class='class"+keywordPositionTemp.class_id+"' prelength='"+(parseInt(keywordPositionTemp.start))+"'>"+content.substring(keywordPositionTemp.start,keywordPositionTemp.end)+"</span>";
        endTemp=keywordPositionTemp.end
        if(positionIndex == (keywordPositionList.length - 1)) {
            tmp_content = content.substring(endTemp,content.length)
            contentTemp+="<span id='span"+(i+2)+"' class='class0' prelength='"+(parseInt(keywordPositionTemp.end))+"'>"+tmp_content+"</span>";
        }
        $("#content").html(contentTemp);
        length=keywordPositionTemp.end;
        i+=2;
        $("#keywords").append('<span style="margin-right: 10px;border-style: solid;border-width: 2px;border-radius:4px;" class="tag'+keywordPositionTemp.class_id+'" onmouseout="ChangeNomalKeyword('+positionIndex+')" onmouseover="ChangeBiggerKeyword('+positionIndex+')"><span >'+content.substring(keywordPositionTemp.start,keywordPositionTemp.end)+'&nbsp;&nbsp;</span><a href="#" title="Removing tag" onclick="removeKeyword('+positionIndex+')">X</a></span>');
    }
    for(var positionIndex in keywordPositionList) {
        keywordPositionTemp= keywordPositionList[positionIndex];
        class_id = keywordPositionTemp.class_id
        extract_color_change(keywordPositionTemp.class_id)
    }
    $("#extract-buttons").empty();
    labelKeyCodes = []
    for(var setting_index in settings.settings) {
        if (parseInt(setting_index)+1 < 10) { //处理快捷键0
            numKeyboard = "(Alt+" + (parseInt(setting_index)+1) + ")"
            labelKeyCodes.push(parseInt(setting_index)+49)
        }else if (parseInt(setting_index)+1 == 10) {
            numKeyboard = "(Alt+0)"
            labelKeyCodes.push(48)
        } else {
            numKeyboard = ""
        }
        $("#extract-buttons").append('<button id="label'+(parseInt(setting_index)+1)+'" data-toggle="tooltip" data-placement="bottom"  title="'+numKeyboard+'" class="btn btn-circle-micro pull-xs-left label-submit-btn'+(parseInt(setting_index)+1)+'" style="letter-spacing:2px;border-radius:8px; width: 100px;height: 30px;margin-right: 10px;" onclick="extract('+(parseInt(setting_index)+1)+')">'+settings.settings[setting_index]+'</button>');
        btnColorChange('extract-buttons',parseInt(setting_index)+1)

    }
    document.onkeydown = function() {
        var oEvent = window.event;
        if (contains(labelKeyCodes,oEvent.keyCode) && oEvent.altKey) {
            extract(oEvent.keyCode-48 == 0?10:oEvent.keyCode-48); //处理快捷键0
        }
        if (oEvent.keyCode == 82 && oEvent.altKey) {
            resetExtract();
        } else if (oEvent.keyCode == 81 && oEvent.altKey) {
            nextExtract();
        } else if (oEvent.keyCode == 67 && oEvent.altKey) {
            collect();
        }else if (oEvent.keyCode == 68 && oEvent.altKey) {
            DirtyDataExtract();
        }
    }
}

function classfyRender() {
    $("#classfy_content").html("<span id='span0' class='class0' prelength='0'>" + content + "</span>");
    begin_time=Date.parse(new Date())
    localStorage.setItem('begin_time', JSON.stringify(begin_time));
    $("#classfy-buttons").empty();
    labelKeyCodes = []
    for(var setting_index in settings.settings) {
        if (parseInt(setting_index)+1 < 10) {
            numKeyboard = "(Alt+" + (parseInt(setting_index)+1) + ")"
            labelKeyCodes.push(parseInt(setting_index)+49)
        }else if (parseInt(setting_index)+1 == 10) {
            numKeyboard = "(Alt+0)"
            labelKeyCodes.push(48)
        } else {
            numKeyboard = ""
        }
        if (contains(classList, (parseInt(setting_index)+1))) {
            $("#classfy-buttons").append('<button type="button" data-toggle="tooltip" data-placement="bottom"  title="'+numKeyboard+'"  data-value="0"  id="classfy_label'+(parseInt(setting_index)+1)+'" class="btn btn-circle-micro pull-xs-left label-submit-btn'+(parseInt(setting_index)+1)+'" style="margin-bottom: 5px;letter-spacing:2px;border-radius:8px; width: 100px;height: 30px;margin-right: 10px;" onclick="classfy('+(parseInt(setting_index)+1)+')">'+settings.settings[setting_index]+'</button>');
        } else {
            $("#classfy-buttons").append('<button type="button" data-toggle="tooltip" data-placement="bottom"  title="'+numKeyboard+'"  data-value="1" id="classfy_label'+(parseInt(setting_index)+1)+'" class="btn btn-circle-micro pull-xs-left label-submit-btn" style="letter-spacing:2px;border-radius:8px; width: 100px;height: 30px;margin-right: 10px;margin-bottom: 5px;" onclick="classfy('+(parseInt(setting_index)+1)+')">'+settings.settings[setting_index]+'</button>');
        }
        btnColorChange("classfy_label",parseInt(setting_index)+1)
    }
    document.onkeydown = function() {
        var oEvent = window.event;
        if (contains(labelKeyCodes,oEvent.keyCode) && oEvent.altKey) {
            classfy(oEvent.keyCode-48 == 0?10:oEvent.keyCode-48);
        }
        if (oEvent.keyCode == 82 && oEvent.altKey) {
            resetClassfy();
        } else if (oEvent.keyCode == 81 && oEvent.altKey) {
            nextClassfy();
        } else if (oEvent.keyCode == 67 && oEvent.altKey) {
            collect();
        }else if (oEvent.keyCode == 68 && oEvent.altKey) {
            DirtyDataClassfy();
        }
    }
}
function relationRender() {
    $("#relation_content").html("<span id='span0' class='class0' prelength='0'>" + content + "</span>");

    // button渲染
    $("#relation_buttons").empty();
    labelKeyCodes = []
    for(var setting_index in settings.settings) {
        for (var settings_key in settings.settings[setting_index] ){
            $("#relation_buttons").append('<button onclick="add_relation('+(parseInt(setting_index)+1)+',\''+settings_key+'\''+')" style="letter-spacing:2px;border-radius:8px; width: 100px;height: 30px;margin-right: 10px;" class="btn btn-circle-micro pull-xs-left" name="relation'+(parseInt(setting_index)+1)+'" id="relation'+(parseInt(setting_index)+1)+'"'+'>'+settings_key+'</button>')
            var a = '{"'+settings_key+'":'+(parseInt(setting_index)+1)+'}';
            settings_color_list.push(JSON.parse(a));
            btnColorChange('relation_buttons',parseInt(setting_index)+1)
        }
    }
    // table 渲染
    $('#realtion_table').empty();
    if (!relation_keyposition_Temp_list_render){
        return
    }
    for(var i in relation_keyposition_Temp_list_render){
        var item = relation_keyposition_Temp_list_render[i];
        console.log(item)
        add_relation_Render(item)

    }

}
function add_relation_Render(keypositions_item){
    button_name = keypositions_item['event'];
    settings_index = 0;
    for (var i in settings_color_list){
        for (var key in settings_color_list[i]){
            if(key ==button_name){
                settings_index = settings_color_list[i][key]
            }
        }
    }
    var relationTableTemp_list_ = []
    for (var i in settings.settings){
        try{
            if (settings.settings[i][button_name]){
                relationTableTemp_list = settings.settings[i][button_name]
            }
        }catch (err){
            continue
        }
    }
    relationTableTemp = "";
    relationTable_Td_Num = 0;
    relationTable_Tr_Num += 1;
    // settings_index = parseInt(settings_index)+1;
    relationTableTemp_dict = {
        id:"relationTable_Tr_Num_"+relationTable_Tr_Num,
        event:button_name,
    }
    max_count = 0
    for (var i in relationTableTemp_list){
        max_count+=1
        try{
            start = keypositions_item[relationTableTemp_list[i]]['start']
            end = keypositions_item[relationTableTemp_list[i]]['end']
            relationTableTemp_dict[relationTableTemp_list[i]] = JSON.parse('{'+'"start":'+start+',"end":'+end+'}');
            var id_str = "relationTable_Tr_"+relationTable_Tr_Num+"_"+i;
            var id_btn = id_str+"_btn";
            var id_span = id_str+"_span";
            relationTableTemp += '<td id="relationTable_Tr_Num_'+relationTable_Tr_Num+'_'+relationTable_Tr_Num+'"><span id="'+id_span+'">'+relationTableTemp_list[i]+'</span>'+'<span>:</span>'
                +'<sapn  onmouseup="discontent_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');" onmousedown="content_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');"  id="'+id_str+'">'+content.substring(start,end)+'&nbsp&nbsp'+'<a onclick="remove_this_td(\''+id_str+'\',\''+id_btn+'\');" class="glyphicon glyphicon-remove-sign" style="text-decoration:none"></a>'+'</sapn><button style="display: none" id="'+id_btn+'" onclick="relation_extract(\''+relationTableTemp_list[i]+'\',\''+id_str+'\',\''+id_btn+'\');" class="btn btn-circle-micro btn-xs" style="letter-spacing:2px;border-radius:8px;" name="relation_table_btn'+settings_index+'" >'+relationTableTemp_list[i]+'</button></td>'
        }catch (err){
            var id_str = "relationTable_Tr_"+relationTable_Tr_Num+"_"+i;
            var id_btn = id_str+"_btn";
            var id_span = id_str+"_span";
            relationTableTemp += '<td id="relationTable_Tr_Num_'+relationTable_Tr_Num+'_'+relationTable_Tr_Num+'"><span id="'+id_span+'">'+relationTableTemp_list[i]+'</span>'+'<span>:</span>'
                +'<sapn style="display: none"  onmouseup="discontent_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');" onmousedown="content_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');"  id="'+id_str+'">'+'</sapn><button id="'+id_btn+'" onclick="relation_extract(\''+relationTableTemp_list[i]+'\',\''+id_str+'\',\''+id_btn+'\');" class="btn btn-circle-micro btn-xs" style="letter-spacing:2px;border-radius:8px;" name="relation_table_btn'+settings_index+'" >'+relationTableTemp_list[i]+'</button></td>'
        }
    }
    if (max_count<relation_max_td_length){
        tmp_count = parseInt(relation_max_td_length-max_count)
        relationTableTemp +='<td colspan="'+tmp_count+'"></td>'
    }

    $("#realtion_table").append(
            '<tr id="relationTable_Tr_Num_'+relationTable_Tr_Num+'">'+
            '<td ><button class="btn btn-circle-micro btn-xs" name="relation_table_btn'+settings_index+'" style="letter-spacing:2px;border-radius:8px;" id="relation_table_btn'+settings_index+'">'+button_name+'</button></td>' +
            relationTableTemp +
            '<td ><button onclick="removeTr(this);" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></td>'+
            '</tr>'
    );
    relation_keyposition_Temp_list.push(relationTableTemp_dict);
    btnColorChange('relation_buttons_table',settings_index);
}
function add_relation(settings_index,button_name) {
    var relationTableTemp_list = settings.settings[parseInt(settings_index)-1][button_name];
    relationTableTemp = ""
    relationTable_Td_Num = 0
    relationTable_Tr_Num +=1
    max_count = 0
    for (var i in relationTableTemp_list){
        max_count+=1
        var id_str = "relationTable_Tr_"+relationTable_Tr_Num+"_"+i;
        var id_btn = id_str+"_btn";
        var id_span = id_str+"_span";
        relationTableTemp += '<td id="relationTable_Tr_Num_'+relationTable_Tr_Num+'_'+relationTable_Tr_Num+'"><span id="'+id_span+'">'+relationTableTemp_list[i]+'</span>'+'<span>:</span>'
            +'<sapn onmouseup="discontent_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');" onmousedown="content_highlight(\''+id_str+'\',\''+relationTableTemp_list[i]+'\''+');" style="display: none" id="'+id_str+'"  ></sapn><button id="'+id_btn+'" onclick="relation_extract(\''+relationTableTemp_list[i]+'\',\''+id_str+'\',\''+id_btn+'\');" class="btn btn-circle-micro btn-xs" style="letter-spacing:2px;border-radius:8px;" name="relation_table_btn'+settings_index+'" >'+relationTableTemp_list[i]+'</button></td>'
    }
    if (max_count<relation_max_td_length){
        tmp_count = parseInt(relation_max_td_length-max_count)
        relationTableTemp +='<td colspan="'+tmp_count+'"></td>'
    }
    $("#realtion_table").append(
            '<tr id="relationTable_Tr_Num_'+relationTable_Tr_Num+'">'+
            '<td ><button class="btn btn-circle-micro btn-xs" name="relation_table_btn'+settings_index+'" style="letter-spacing:2px;border-radius:8px;" id="relation_table_btn'+settings_index+'">'+button_name+'</button></td>' +
            relationTableTemp +
            '<td ><button onclick="removeTr(this);" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button></td>'+
            '</tr>'
    );
    relationTableTemp_dict = {
        id:"relationTable_Tr_Num_"+relationTable_Tr_Num,
        event:button_name,
    }
    relation_keyposition_Temp_list.push(relationTableTemp_dict);
    btnColorChange('relation_buttons_table',settings_index);
}
function discontent_highlight(id_str,key) {
    $("#span0").empty();
    $("#span0").append(content)
    $('#'+id_str).css("border",'none')

}
function content_highlight(id_str,key) {

    var tr_id = $('#'+id_str).parent().parent().attr('id')
    contentTemp = "";
    //取出范围
    for (var i in relation_keyposition_Temp_list){
        if (relation_keyposition_Temp_list[i]['id']==tr_id){
            start = relation_keyposition_Temp_list[i][key]['start'];
            end = relation_keyposition_Temp_list[i][key]['end'];
            contentTemp = content.substring(start,end)
        }
    }
    $("#span0").empty();
    $("#span0").append(content.substring(0,start)+'<span id="highlight_span">'+contentTemp+'</span>'+content.substring(end,content.length))
    $('#'+id_str).css('border','1px solid black').css('border-radius','4px')
    $('#highlight_span').css('background','#444444')
    $('#highlight_span').css('color','#FFFFFF')

}
function relation_extract(button_name,id_str,id_btn) {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        try{
            l = content.length
            u = userSelection.getRangeAt(0).startContainer.length
            if (l==u){
                start=(userSelection.getRangeAt(0).startOffset );
                end=(userSelection.getRangeAt(0).endOffset );
            }else {
                alert("请正确选择标注范围")
                return;
            }

        }catch(err) {
            return;
        }
        if (start==end){
            return;
        }
        if (start > end) {
            temp = start;
            start = end;
            end = temp;
        }
        var tr_id = $('#'+id_btn).parent().parent().attr("id");

        keywordPosition_str = '{'+'"start":'+start+',"end":'+end+'}'
        keywordPosition_json = JSON.parse(keywordPosition_str);
        for (var i in relation_keyposition_Temp_list){
            if (tr_id == relation_keyposition_Temp_list[i]['id']){
                relation_keyposition_Temp_list[i][button_name] = keywordPosition_json
            }
        }
        console.log(relation_keyposition_Temp_list);
        $('#'+id_btn).hide();
        $('#'+id_str).text(content.substring(start,end));
        $('#'+id_str).append('&nbsp&nbsp'+'<a onclick="remove_this_td(\''+id_str+'\',\''+id_btn+'\');" class="glyphicon glyphicon-remove-sign" style="text-decoration:none"></a>')
        $('#'+id_str).show();


    } else {
        alert("当前浏览器不支持getRangeAt");
    }
}
function remove_this_td(id_str,id_btn) {
    $('#'+id_str).empty();
    $('#'+id_str).hide();
    $('#'+id_btn).show();
    var key = $('#'+id_str+'_span').text()
    var tr_id = $('#'+id_btn).parent().parent().attr("id");
    // 删除对应key
    try{
        $.each(relation_keyposition_Temp_list,function (index,item) {
            if (item['id']==tr_id ){
               delete item[key]
            }
        })
    } catch (err) {}
}
function removeTr(temp) {
    var tr_id = $(temp).parent().parent().attr("id");
    $(temp).parent().parent().remove();
    console.log(relation_keyposition_Temp_list)
    try{
        $.each(relation_keyposition_Temp_list,function (index,item) {

            if (item['id']==tr_id){
                relation_keyposition_Temp_list.splice(index,1)
            }

        })
    } catch (err) {}
}

function removeKeyword(i) {
    keywordPositionList.splice(i,1);
    extractRender();
}
// function highlightKeyword(i) {
//     $("#span"+(i*2+1)).css("background","yellow");
// }
function ChangeBiggerKeyword(i) {
    $("#span"+(i*2+1)).css("font-size","40px");
}
function ChangeNomalKeyword(i) {
    $("#span"+(i*2+1)).css("font-size","20px");
}
// function unhighlightKeyword(i) {
//     $("#span"+(i*2+1)).css("background","");
// }
function positionSort(a, b) {
    return a.start - b.start;
}
function classfy(class_id) {
    // 重复按 就删除
    if (contains(classList, class_id)){
        removeByValue(classList, class_id);
        $("#classfy_label"+class_id).attr('data-value',1);
        btnColorChange("classfy_label",class_id);
        return
    }

    // 如果是单选
    if (settings.is_single){
        if (classList.length!=0){
            for(var i in classList){
                $("#classfy_label"+classList[i]).attr('data-value',1);
                btnColorChange("classfy_label",classList[i]);
            }
        }
        classList=[];
        $("#classfy_label"+class_id).attr('data-value',0);
        btnColorChange("classfy_label",class_id);
        classList.push(class_id);
    }else {
        $("#classfy_label"+class_id).attr('data-value',0);
        btnColorChange("classfy_label",class_id);
        classList.push(class_id);
    }
    // if (contains(classList, class_id)) {
    //     removeByValue(classList, class_id);
    //     $("#classfy_label"+class_id).removeClass("label-submit-bt"+class_id);
    //     $("#classfy_label"+class_id).attr('data-value',0)
    //     btnColorChange("classfy_label",class_id)
    // } else {
    //     parentClass = $('#classfy-buttons').children();
    //     if (settings.is_single) {
    //         for(var i in parentClass){
    //             $("#classfy_label"+(parseInt(i)+1)).removeClass("label-submit-bt"+(parseInt(i)+1));
    //             // $("#classfy_label"+(parseInt(i)+1)).attr('data-value',1)
    //             // btnColorChange("classfy_label",(parseInt(i)+1))
    //         }
    //         if (classList){
    //             for(var i in classList){
    //                 $("#classfy_label"+(parseInt(i)+1)).attr('data-value',1)
    //                 btnColorChange("classfy_label",(parseInt(i)+1))
    //             }
    //         }
    //
    //         // classList=[];
    //     }
    //     $('#classfy_label'+class_id).addClass("label-submit-bt"+class_id);
    //     classList.push(class_id);
    //     $("#classfy_label"+class_id).attr('data-value',0);
    //     btnColorChange("classfy_label",class_id)
    // }
}
function extract(class_id) {
    var userSelection;
    if (window.getSelection) { //现代浏览器
        userSelection = window.getSelection();
    } else if (document.selection) { //IE浏览器 考虑到Opera，应该放在后面
        userSelection = document.selection.createRange();
    }
    if (userSelection.getRangeAt) {
        try {
            startContainerPrelength = parseInt($(userSelection.getRangeAt(0).startContainer.parentElement).attr("prelength"));
            endContainerPrelength = parseInt($(userSelection.getRangeAt(0).endContainer.parentElement).attr("prelength"));
        }
        catch(exception){
            alert("操作错误");
            return;
        }
        if (startContainerPrelength != endContainerPrelength || $(userSelection.getRangeAt(0).commonAncestorContainer.parentElement.parentElement).attr("id") != "content") {
            alert("操作错误");
            return;
        }

        prelength = startContainerPrelength;
        userSelection.get
        start=(userSelection.getRangeAt(0).startOffset + prelength)
        end=(userSelection.getRangeAt(0).endOffset + prelength)
        if (start == end){
            alert("操作错误");
            return;
        }
        if (start > end) {
            temp = start;
            start = end;
            end = temp;
        }
        keywordPosition={
            "start":start,
            "end":end,
            "class_id":class_id
        };
        for(var positionIndex in keywordPositionList) {
            keywordPositionTemp=keywordPositionList[positionIndex];
            if(keywordPositionTemp["start"] <= keywordPosition["start"] && keywordPositionTemp["end"] >= keywordPosition["end"]){
                // $.messager.alert('Error', "操作错误");
                alert("操作错误");
                return;
            }
        }
        keywordPositionList.push(keywordPosition);
        extractRender();
    } else {
        // $.messager.alert('Warning', "当前浏览器不支持getRangeAt");
        alert("当前浏览器不支持getRangeAt");
    }
}
function collect() {
    if(!content_id) {
        // $.messager.alert('Warning', "暂无任务");
        alert("暂无任务");
        return;
    }
    data = {
        "content_id":content_id
    }
    $.post("/collect/",data,function(result){
        // $.messager.alert('Info', result.result);
        alert(result.result);
        $('#discollectClassfy').show();
        $('#collectClassfy').hide();
        $('#discollectExtract').show();
        $('#collectExtract').hide();
        $('#discollectRelation').show();
        $('#collectRelation').hide();

    });
}

function discollect(){
    data = {
        "collection_id":content_id
    }
    $.post("/del_collection",data,function(result){
        alert(result.result);
        $('#discollectClassfy').hide();
        $('#collectClassfy').show();
        $('#discollectExtract').hide();
        $('#collectExtract').show();
    });
}

function resetExtract () {
    keywordPositionList = [];
    extractRender();
};

function resetClassfy () {
    classList = [];
    classfyRender();
};
function resetRelation() {
    relation_keyposition_Temp_list = [];
    relation_keyposition_Temp_list_render =[]
    relationRender();
}
function nextExtract() {
    if(!content_id) {
        alert("暂无任务");
        return;
    }
    if(keywordPositionList.length==0) {
        alert("请选择标注");
        return;
    }
    end_time = Date.parse(new Date());
    begin_time = JSON.parse(localStorage.getItem("begin_time"));
    cost_time = end_time-begin_time;
    data = {
        "content_id": content_id,
        "keypositions": JSON.stringify(keywordPositionList),
        "cost_time": JSON.stringify(cost_time)
    };
    $.post("/extract/",data,function(result){
        console.log(result.result)
        if(result.result == "success") {
            if (localStorage.getItem("history_list1"))
                history_list = JSON.parse(localStorage.getItem("history_list1"))
            else
                history_list = [];
            if (localStorage.getItem("history_all_list"))
                history_all_list = JSON.parse(localStorage.getItem("history_all_list"))
            else
                history_all_list = [];
            if (history_all_list) {
                if (history_all_list.length >= 50) {
                    history_all_list.splice(0, 1);
                }
            } else {
                history_all_list = []
            }
            if (history_list) {
                if (history_list.length >= 5) {
                    history_list.splice(0, 1);
                }
            } else {
                history_list = []
            }
            contentObjectTemp = {
                "content_id": content_id,
                "content": content
            }
            begin_time=Date.parse(new Date());
            history_list.push(contentObjectTemp);
            history_all_list.push(content_id);
            localStorage.setItem('history_list1', JSON.stringify(history_list));
            localStorage.setItem('begin_time', JSON.stringify(begin_time));
            localStorage.setItem('history_all_list', JSON.stringify(history_all_list));
            if(collection_id2content_idList.length == 1) {
                    extractRender();
                    alert("没有更多的收藏了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    collection_id2content_idList.splice(0, 1);
                }
                if(history_id_List.length == 1) {
                    extractRender();
                    alert("没有更多的历史了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    history_id_List.splice(0, 1);
                }
            get_new_content();
        } else {
            $.messager.alert('Warning', result.result);
        }
    });
};

function nextRelation() {
    if(!content_id) {
        // $.messager.alert('Warning', "暂无任务");
        alert("暂无任务");
        return;
    }
    end_time = Date.parse(new Date());
    begin_time = JSON.parse(localStorage.getItem("begin_time"));
    cost_time = end_time-begin_time;

    //去掉空值
    for (var i in relation_keyposition_Temp_list ){
        var key_count = 0
        for (var key in relation_keyposition_Temp_list[i]){
            key_count+=1
        }
        if (key_count<3){
            relation_keyposition_Temp_list.splice(i,1)
        }
    }
    if(relation_keyposition_Temp_list.length==0) {
        alert("请选择关系标注");
        return;
    }
    data = {
        "content_id": content_id,
        "keypositions": JSON.stringify(relation_keyposition_Temp_list),
        "cost_time": JSON.stringify(cost_time)
    };
    $.post("/relation/",data,function(result){

        console.log(result.result);
        console.log(relation_keyposition_Temp_list)
        if(result.result == "success") {
            if (localStorage.getItem("history_list1"))
                history_list = JSON.parse(localStorage.getItem("history_list1"));
            else
                history_list = [];
            if (localStorage.getItem("history_all_list"))
                history_all_list = JSON.parse(localStorage.getItem("history_all_list"));
            else
                history_all_list = [];
            if (history_all_list) {
                if (history_all_list.length >= 50) {
                    history_all_list.splice(0, 1);
                }
            } else {
                history_all_list = []
            }
            if (history_list) {
                if (history_list.length >= 5) {
                    history_list.splice(0, 1);
                }
            } else {
                history_list = []
            }
            contentObjectTemp = {
                "content_id": content_id,
                "content": content
            }
            begin_time=Date.parse(new Date());
            history_list.push(contentObjectTemp);
            history_all_list.push(content_id);
            localStorage.setItem('history_list1', JSON.stringify(history_list));
            localStorage.setItem('begin_time', JSON.stringify(begin_time));
            localStorage.setItem('history_all_list', JSON.stringify(history_all_list));
            if(collection_id2content_idList.length == 1) {
                    extractRender();
                    alert("没有更多的收藏了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    collection_id2content_idList.splice(0, 1);
                }
                if(history_id_List.length == 1) {
                    extractRender();
                    alert("没有更多的历史了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    history_id_List.splice(0, 1);
                }
            get_new_content();
        } else {
            alert(result.result);
        }
    });
}

function nextClassfy() {
    if(!content_id) {
        // $.messager.alert('Warning', "暂无任务");
        alert("暂无任务");
        return;
    }
    if (classList.length == 0) {
        // $.messager.alert('Warning', "请选择分类");
        alert("请选择分类");
        return;
    }
    class_list_temp = [];
    for (var i in classList) {
        class_list_temp.push(settings.settings[classList[i]-1])
    }
    eval("var class_list_str = '"+JSON.stringify(class_list_temp)+"';");
    end_time = Date.parse(new Date());
    begin_time = JSON.parse(localStorage.getItem("begin_time"));
    cost_time = end_time-begin_time;
    data = {
        "content_id": content_id,
        "class_list": class_list_str,
        "cost_time": cost_time
    }
    $.post(
        "/classfy/",
        data,
        function(result){
            console.log(result.result);
            if(result.result == "success") {
                if (localStorage.getItem("history_list1"))
                    history_list = JSON.parse(localStorage.getItem("history_list1"))
                else
                    history_list = []
                if (localStorage.getItem("history_all_list"))
                    history_all_list = JSON.parse(localStorage.getItem("history_all_list"))
                else
                    history_all_list = []
                if (history_list) {
                    if (history_list.length >= 5) {
                        history_list.splice(0, 1);
                    }
                } else {
                    history_list = []
                }
                if (history_all_list) {
                    if (history_all_list.length >= 50) {
                        history_all_list.splice(0, 1);
                    }
                } else {
                    history_all_list = []
                }
                contentObjectTemp = {
                    "content_id": content_id,
                    "content": content
                }
                begin_time=Date.parse(new Date());
                history_list.push(contentObjectTemp);
                history_all_list.push(content_id)
                localStorage.setItem('history_list1', JSON.stringify(history_list))
                localStorage.setItem('begin_time', JSON.stringify(begin_time))
                localStorage.setItem('history_all_list', JSON.stringify(history_all_list))
                // renderHistory();
                if(collection_id2content_idList.length == 1) {
                    classfyRender();
                    alert("没有更多的收藏了");
                    window.location.href='/index';
                    return;
                }else {
                    resetClassfy();
                    collection_id2content_idList.splice(0, 1);
                }
                if(history_id_List.length == 1) {
                    classfyRender();
                    alert("没有更多的历史了");
                    window.location.href='/index';
                    return;
                }else {
                    resetClassfy();
                    history_id_List.splice(0, 1);
                }

                get_new_content();
            } else {
                // $.messager.alert('Warning', result.result);
                alert(result.result);
            }
    });

};

function adjustHeightOfPage(pageNo) {

    var offset = 80;
    var pageContentHeight = $(".cd-hero-slider li:nth-of-type(" + pageNo + ") .js-tm-page-content").height();

    if($(window).width() >= 992) { offset = 120; }
    else if($(window).width() < 480) { offset = 40; }

    // Get the page height
    var totalPageHeight = 15 + $('.cd-slider-nav').height()
                            + pageContentHeight + offset
                            + $('.tm-footer').height();

    // Adjust layout based on page height and window height
    if(totalPageHeight > $(window).height())
    {
        $('.cd-hero-slider').addClass('small-screen');
        $('.cd-hero-slider li:nth-of-type(' + pageNo + ')').css("min-height", totalPageHeight + "px");
    }
    else
    {
        $('.cd-hero-slider').removeClass('small-screen');
        $('.cd-hero-slider li:nth-of-type(' + pageNo + ')').css("min-height", "100%");
    }
}


/*
    Everything is loaded including images.
*/

function checkContent() {
    var row = $('#myhistory_all').datagrid('getSelected');
    if (row){
        get_new_content(row.content_id);
        $("#nav-link1").click();
    } else {
          $.messager.alert('Warning', '请选择');
    }
}

function get_history_list() {
    url = "/get_history_list";
    history_all_list = JSON.parse(localStorage.getItem("history_all_list"));
    $('#myhistory_all').datagrid({
        height: 200,
        url: url,
        method: 'POST',
        queryParams: {'history_all_list': history_all_list},
        striped: true,
        fitColumns: true,
        singleSelect: true,
        rownumbers: true,
        pagination: true,
        nowrap: true,
        pageSize: 30,
        pageList: [30, 60, 90, 120, 150, 200],
        showFooter: true,
        columns: [[
            {field: 'content_id', title: '编号', width: 80, align: 'left'},
            {field: 'content', title: '内容', width: 80, align: 'left'},
        ]]

    });
}

function getSelected(){
    var row = $('#unchoicetask').datagrid('getSelected');
    if (row){
        data = {
            "group_id": row.id
        }
        $.post("/choice_group/",data,function(result){
            $.messager.alert('Info', result['result']);
            $('#unchoicetask').datagrid('reload');
            $('#mytask').datagrid('reload');
        });
    } else {
        $.messager.alert('Warning', '请选择');
    }
}
// function btnColorChange_render(btnType,btn_name) {
//     if
//
// }
function btnColorChange(btnType,id) {
    color_style = color_list["label"+id];
    if (btnType=='classfy_label'){
        data_value = $('#classfy_label'+id).attr("data-value");
        console.log(data_value);
        if (data_value=="0"){
            $('#classfy_label'+id).css("background",color_style);
            $('#classfy_label'+id).css("color","#FFFFFF");
            $('#classfy_label'+id).attr("data-value","1")
        }else {
            $('#classfy_label'+id).css("background","");
            $('#classfy_label'+id).css("color","#333333");
            $('#classfy_label'+id).attr("data-value","0")
        }
    }else if (btnType =='extract-buttons'){
        $('#label'+id).css("background",color_style)
        $('#label'+id).css("color","#FFFFFF");
    }else if (btnType =='relation_buttons'){
        $('#relation'+id).css("background",color_style)
        $('#relation'+id).css("color","#FFFFFF");
    }else if (btnType =='relation_buttons_table'){
        tmp_str = "relation_table_btn"+id
        $('button[name='+tmp_str+']').css("background",color_style);
        $('button[name='+tmp_str+']').css("color","#FFFFFF");
    }
}

function extract_color_change(id) {
    color_style = color_list["label"+id];
    $('.class'+id).css("background",color_style);
    $('.class'+id).css("color","#FFFFFF");
    $('.class'+id).css("margin-right",'5px');
    $('.tag'+id).css('border-color',color_style);

}
function DirtyDataExtract() {
    if (!confirm("您确定要执行操作吗？")){
        return
    }
    if(!content_id) {
        alert("暂无任务");
        return;
    }
    end_time = Date.parse(new Date());
    begin_time = JSON.parse(localStorage.getItem("begin_time"));
    cost_time = end_time-begin_time;
    data = {
        "content_id": content_id,
        "cost_time": cost_time
    };
    $.post("/dirty_data_extract",data,function(result){
        console.log(result.result)
        if(result.result == "success") {
            if (localStorage.getItem("history_list1"))
                history_list = JSON.parse(localStorage.getItem("history_list1"))
            else
                history_list = [];
            if (localStorage.getItem("history_all_list"))
                history_all_list = JSON.parse(localStorage.getItem("history_all_list"))
            else
                history_all_list = [];
            if (history_all_list) {
                if (history_all_list.length >= 50) {
                    history_all_list.splice(0, 1);
                }
            } else {
                history_all_list = []
            }
            if (history_list) {
                if (history_list.length >= 5) {
                    history_list.splice(0, 1);
                }
            } else {
                history_list = []
            }
            contentObjectTemp = {
                "content_id": content_id,
                "content": content
            }
            begin_time=Date.parse(new Date());
            history_list.push(contentObjectTemp);
            history_all_list.push(content_id);
            localStorage.setItem('history_list1', JSON.stringify(history_list));
            localStorage.setItem('begin_time', JSON.stringify(begin_time));
            localStorage.setItem('history_all_list', JSON.stringify(history_all_list));
            if(collection_id2content_idList.length == 1) {
                    extractRender();
                    alert("没有更多的收藏了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    collection_id2content_idList.splice(0, 1);
                }
                if(history_id_List.length == 1) {
                    extractRender();
                    alert("没有更多的历史了");
                    window.location.href='/index';
                    return;
                }else {
                    resetExtract();
                    history_id_List.splice(0, 1);
                }
            get_new_content();
        } else {
            $.messager.alert('Warning', result.result);
        }
    });
}

function DirtyDataClassfy() {
    if (!confirm("您确定要执行操作吗？")){
        return
    }
    if(!content_id) {
    // $.messager.alert('Warning', "暂无任务");
    alert("暂无任务");
    return;
    }

    class_list_temp = []
    for (var i in classList) {
        class_list_temp.push(settings.settings[classList[i]-1])
    }
    eval("var class_list_str = '"+JSON.stringify(class_list_temp)+"';");
    end_time = Date.parse(new Date());
    begin_time = JSON.parse(localStorage.getItem("begin_time"));
    cost_time = end_time-begin_time;
    data = {
        "content_id": content_id,
        "cost_time": cost_time
    }
    $.post(
        "/dirty_data_classfy",
        data,
        function(result){
            console.log(result.result);
            if(result.result == "success") {
                if (localStorage.getItem("history_list1"))
                    history_list = JSON.parse(localStorage.getItem("history_list1"))
                else
                    history_list = []
                if (localStorage.getItem("history_all_list"))
                    history_all_list = JSON.parse(localStorage.getItem("history_all_list"))
                else
                    history_all_list = []
                if (history_list) {
                    if (history_list.length >= 5) {
                        history_list.splice(0, 1);
                    }
                } else {
                    history_list = []
                }
                if (history_all_list) {
                    if (history_all_list.length >= 50) {
                        history_all_list.splice(0, 1);
                    }
                } else {
                    history_all_list = []
                }
                contentObjectTemp = {
                    "content_id": content_id,
                    "content": content
                }
                begin_time=Date.parse(new Date());
                history_list.push(contentObjectTemp);
                history_all_list.push(content_id)
                localStorage.setItem('history_list1', JSON.stringify(history_list))
                localStorage.setItem('begin_time', JSON.stringify(begin_time))
                localStorage.setItem('history_all_list', JSON.stringify(history_all_list))
                // renderHistory();
                if(collection_id2content_idList.length == 1) {
                    classfyRender();
                    alert("没有更多的收藏了");
                    window.location.href='/index';
                    return;
                }else {
                    resetClassfy();
                    collection_id2content_idList.splice(0, 1);
                }
                if(history_id_List.length == 1) {
                    classfyRender();
                    alert("没有更多的历史了");
                    window.location.href='/index';
                    return;
                }else {
                    resetClassfy();
                    history_id_List.splice(0, 1);
                }

                get_new_content();
            } else {
                // $.messager.alert('Warning', result.result);
                alert(result.result);
            }
    });

}


function submit_feedback() {
    if(!content_id) {
    // $.messager.alert('Warning', "暂无任务");
    alert("暂无任务");
    return;
    };
    var feedback_question = $('#feedback_question').val();
    if (!feedback_question){
        alert("详细描述不得为空");
        return;
    }
    var fileObj = document.getElementById("feedback_file").files[0];
    var formData  = new FormData();
    settings_name = $("#settings_name").text();
    formData.append("settings_name",settings_name);
    formData.append("feedback_file",fileObj);
    formData.append("feedback_question",feedback_question);
    formData.append("content_id",content_id);

    $.ajax({
        type:"POST",
        url:'/StartLabel/feedback_api',
        data:formData ,
        contentType: false,
        processData: false,
        success: function (result) {
            if(result.result == "success") {
                $('#FeedBack').modal('toggle');
                alert("提交反馈成功");
                $('#feedback_question').val("");
            } else {
                alert(result.result);
            }
        }
    });
    // $.post(
    //     "feedback_api",
    //     formFile,
    //     function(result){
    //         console.log(result.result);
    //         if(result.result == "success") {
    //             $('#FeedBack').modal('toggle');
    //             alert("提交反馈成功");
    //             $('#feedback_question').val("");
    //         } else {
    //             alert(result.result);
    //         }
    // });
}