function MyFeedBackTable() {
    var url = "/MyFeedBackTable_Api";
    $('#MyFeedBackTable').bootstrapTable({
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
                title: '状态',
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
        'name="content_id" value="'+row['id']+'"  onclick="selectFeedBack(\'' + row['id'] + '\');" >查看</button>' +
        '<button type="button" class="btn btn-danger btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'onclick="delele_feedback(\'' + row['id'] + '\', \''
        + row['name'] + '\')">删除</button>'
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
    var feedback_Detail = $('#MyFeedBackTable').bootstrapTable('getRowByUniqueId',feedback_id);
    populateCrawlerDetailForm(feedback_Detail);
    $('#FeedBackTableModal').modal('toggle');
}
function populateCrawlerDetailForm(feedback_Detail) {

    $('#fb_id').val(feedback_Detail.id);
    $('#content').val(feedback_Detail.content);
    $('#create_datetime').val(feedback_Detail.create_datetime);
    $('#last_update_datetime').val(feedback_Detail.last_update_datetime);
    $('#feedback_question').val(feedback_Detail.feedback_question);
    $('#feedback_answer').val(feedback_Detail.feedback_answer);
    var feedback_file_submit = feedback_Detail.feedback_file_submit
    if (feedback_file_submit != null && feedback_file_submit.length > 0) {
        var feedback_file_submit = feedback_file_submit.replace(/.*(\/|\\)/, "");
        $('#feedback_file_submit_btn').show()
        //反序列化
        data = decodeURIComponent(feedback_file_submit, true);
        $('#feedback_file_submit_str').val(data);
    } else {
        $('#feedback_file_submit_btn').hide()
        $('#feedback_file_submit_str').hide()
        $('#feedback_file_submit_file').show()
    }

    // reply

    var feedback_file_reply = feedback_Detail.feedback_file_reply;
    if (feedback_file_reply != null && feedback_file_reply.length > 0) {
        var feedback_file_reply = feedback_file_reply.replace(/.*(\/|\\)/, "");
        $('#feedback_file_reply_btn').show()
        data_reply = decodeURIComponent(feedback_file_reply, true);
        $('#feedback_file_reply_str').val(data_reply)
    } else {
        $('#feedback_file_reply_btn').hide()
        $('#feedback_file_reply_str').val("")
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
function getSelection_feedback() {
    var fb_id = $('#fb_id').val();
    id_list_line =[];
    id_list_line.push(fb_id);

    window.location.href = 'Get_Selection_FeedBack_Api/fb_id='+fb_id+'&fb_ids_list='+id_list_line
}

function download_file() {
    var fb_id = $("#fb_id").val();
    data = {
        fb_id:fb_id
    };
    $.ajax({
        type:"POST",
        data:data,
        url:"/download",
        success:function (data, status, xhr) {
            console.log("Download file DONE!");
            console.log(data); // ajax方式请求的数据只能存放在javascipt内存空间，可以通过javascript访问，但是无法保存到硬盘
            console.log(status);
            console.log(xhr);
            console.log("=====================");
        }
    });
}
function feedback_file_submit() {
    $("#task_form").attr("action","/download_submit");
    $("#task_form").submit();
}
function feedback_file_reply() {
    $("#task_form").attr("action","/download_reply");
    $("#task_form").submit();

}