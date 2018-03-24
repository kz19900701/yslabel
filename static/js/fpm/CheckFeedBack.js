function CheckFeedBackTable() {
    var url = "/CheckFeedBackTable_Api";
    $('#CheckFeedBackTable').bootstrapTable({
        method:'POST',
        dataType:'json',
        contentType: "application/x-www-form-urlencoded",
        cache: false,
        striped: true,                              //是否显示行间隔色
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        url: url,
        toolbar: '#toolbar',
        height: $(window).height()-458,
        width:$(window).width(),
        pagination:true,
        queryParams: queryParams,
        queryParamsType: "limit",
        clickToSelect: true, //是否启用点击选中行
        singleSelect: false,
        minimumCountColumns:2,
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100, 'All'],        //可供选择的每页的行数（*）
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        exportDataType: 'all',
        responseHandler: responseHandler,
        sortName:"id",
        sortOrder:"asc",
        columns: [
            {
                checkbox:true
            },
            {
                field: 'id',
                title: '序号',
                align: 'center',
                valign: 'middle',
                formatter: StatusFormatter,
            },
            {
                field: 'content',
                title: '正文',
                align: 'center',
                valign: 'middle',
                formatter: function (value, row, index) {
                    return value.substring(0, 40) + "..."
                },
            },
            {
                field: 'content_id',
                title: '操作',
                align: 'center',
                valign: 'middle',
                formatter: OperatorFormatter,
            }
        ]
    });
}
function OperatorFormatter(value, row, index) {
    return '<button type="button" class="btn btn-default btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'name="content_id" value="'+row['id']+'"  onclick="selectFeedBack(\'' + row['id'] + '\');" >查看</button>'

}

function StatusFormatter(value, row, index) {
    if(row['create_datetime'].substring(0,19)==row['last_update_datetime'].substring(0,19)){
        return '<button class="btn btn-danger btn-xs btn-info">未回复</button>'
    }else {
        return '<button class="btn btn-success btn-xs btn-info">已回复</button>'
    }

}
function selectFeedBack(feedback_id) {
    // var feedback_Detail = JSON.stringify($('#MyFeedBackTable').bootstrapTable('getSelections'));
    var feedback_Detail = $('#CheckFeedBackTable').bootstrapTable('getRowByUniqueId',feedback_id);
    populateCrawlerDetailForm(feedback_Detail);
    $('#CheckFeedBackTableModal').modal('toggle');
}
function populateCrawlerDetailForm(feedback_Detail) {

    $('#fb_id').val(feedback_Detail.id);
    $('#content').val(feedback_Detail.content);
    $('#create_datetime').val(feedback_Detail.create_datetime);
    $('#last_update_datetime').val(feedback_Detail.last_update_datetime);
    $('#feedback_question').val(feedback_Detail.feedback_question);
    $('#feedback_answer').val(feedback_Detail.feedback_answer);

    var feedback_file_submit = feedback_Detail.feedback_file_submit;
    if(feedback_file_submit != null && feedback_file_submit.length > 0) {
        feedback_file_submit = feedback_file_submit.replace(/.*(\/|\\)/, "");
        $('#feedback_file_submit_btn').show();
            //反序列化
        // data = decodeURIComponent(feedback_file_submit,true);
        // $('#feedback_file_submit_str').val(data);
    }else
    {
        $('#feedback_file_submit_btn').hide();
    }

    // reply
    var feedback_file_reply = feedback_Detail.feedback_file_reply
    if(feedback_file_reply != null && feedback_file_reply.length > 0) {
        feedback_file_reply = feedback_file_reply.replace(/.*(\/|\\)/, "");
        $('#feedback_file_reply_btn').show();
        data_reply = decodeURIComponent(feedback_file_reply,true);
        // $('#feedback_file_reply_str').show()
        // $('#feedback_reply_file').hide()
        // $('#feedback_file_reply_str').val(data_reply)

    }else
    {
        $('#feedback_file_reply_btn').hide();
    }



}
// 删除按钮
function delele_feedback(id) {
    data ={
        fb_id:id
    }
    $.post('/del_feedback',data,function () {
        refreshTable_myfeedback();
    })
}

function refreshTable_myfeedback() {
    var params = {
        limit : 11, // 页面大小
        offset : 0 // 页码
    }
    $('#MyFeedBackTable').bootstrapTable('refresh', params);    //刷新表格
}
function queryParams(params) {
    var param = {
        limit : params.limit, // 页面大小
        offset : params.offset // 页码

    }
    return param;
}

// 用于server 分页，表格数据量太大的话 不想一次查询所有数据，可以使用server分页查询，数据量小的话可以直接把sidePagination: "server"  改为 sidePagination: "client" ，同时去掉responseHandler: responseHandler就可以了，
function responseHandler(res) {
    if (res) {
        return {
            "rows" : res.data,
            "total" : res.size
        };
    } else {
        return {
            "rows" : [],
            "total" : 0
        };
    }
}

function getAllSelections_Collection() {
    var delAllSelections_collection_List = $('#MyCollectionTable').bootstrapTable('getAllSelections');
    id_list_line ="" ;
    for (var i in delAllSelections_collection_List) {
        if (i==0){
            id_list_line = delAllSelections_collection_List[i].id
        }else {
            id_list_line = id_list_line+","+(delAllSelections_collection_List[i].id)
        }
    }
    if (id_list_line){
        window.location.href = 'getAllSelections_Collection_Api/content_ids_list='+id_list_line
    }else {
        alert("请选择需要查看的序号~")
        return
    }

}

function delAllSelections_Collection() {
    var delAllSelections_collection_List = $('#MyCollectionTable').bootstrapTable('getAllSelections');
    id_list = [];
    for (var i in delAllSelections_collection_List) {
        id_list.push(delAllSelections_collection_List[i].id)
    }
    if (delAllSelections_collection_List) {

        var url = "del_collection_selections_List_Api";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                id_list: JSON.stringify(id_list)
            },
            success: function () {
                refreshTable_mycollection()
            }
        })
    }else {
        alert("请选择需要删除的序号~")
        return
    }
}

function feedback_file_submit() {
    $("#task_form").attr("action","/download_submit");
    $("#task_form").submit();
}
function feedback_file_reply() {
    $("#task_form").attr("action","/download_reply");
    $("#task_form").submit();

}
function reply_submit_fnc() {
    $("#task_form").attr("action","/answer_feedback");
    $("#task_form").submit();
}