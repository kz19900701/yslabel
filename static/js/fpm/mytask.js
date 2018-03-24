function MyTaskList() {
    var url = "/mytasklist";
    $('#MyTaskList').bootstrapTable({
        method:'POST',
        dataType:'json',
        contentType: "application/x-www-form-urlencoded",
        cache: false,
        striped: true,                              //是否显示行间隔色
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        url: url,
        height: $(window).height()/7*4,
        width:$(window).width(),
        pagination:true,
        queryParams: queryParams,
        queryParamsType: "limit",
        clickToSelect: true, //是否启用点击选中行
        singleSelect: true,
        minimumCountColumns:2,
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 11,                       //每页的记录行数（*）
        pageList: [11, 25, 50, 100, 'All'],        //可供选择的每页的行数（*）
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        exportDataType: 'all',
        responseHandler: responseHandler,
        columns: [
            {
                field: 'id',
                title: '序号',
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'name',
                title: '任务组',
                align: 'center',
                valign: 'middle'

            }, {
                field: 'is_complete',
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter: function (value,row,index) {
                    if (value) {
                        return '<button class="btn btn-success btn-xs " style="margin-right:5px;font-size: 12px">已完成</button>'
                    }else {
                        return '<button class="btn btn-danger btn-xs btn-info" style="margin-right:5px;font-size: 12px">未完成</button>'
                    }

                }
            }
        ]
    });
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
function refreshTable_mytask() {

    // params = {
    //     query: {
    //         limit: 10,
    //         offset: 0,
    //     }
    // };
    var params = {
        limit : 11, // 页面大小
        offset : 0 // 页码
    }
    $('#MyTaskList').bootstrapTable('refresh', params);    //刷新表格
}
function refreshTable_taskManger() {
    params = {
        query: {
            limit: 11,
            offset: 0,
        }
    };
    $('#TaskManagerTable').bootstrapTable('refresh', params);    //刷新表格
}

function TaskManagerTable() {
    var url = "/TaskManagerTable_Api";
    $('#TaskManagerTable').bootstrapTable({
        method:'POST',
        dataType:'json',
        contentType: "application/x-www-form-urlencoded",
        cache: false,
        striped: true,                              //是否显示行间隔色
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        url: url,
        height: $(window).height()/7*4,
        width:$(window).width(),
        pagination:true,
        queryParams: queryParams,
        queryParamsType: "limit",
        clickToSelect: true, //是否启用点击选中行
        singleSelect: true,
        minimumCountColumns:2,
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 11,                       //每页的记录行数（*）
        pageList: [11, 25, 50, 100, 'All'],        //可供选择的每页的行数（*）
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        exportDataType: 'all',
        responseHandler: responseHandler,
        columns: [
            {
                field: 'id',
                title: '序号',
                align: 'center',
                valign: 'middle',
            },
            {
                field: 'name',
                title: '任务组',
                align: 'center',
                valign: 'middle',

            }, {
                field: 'is_complete',
                title: '状态',
                align: 'center',
                valign: 'middle',
                formatter:"GetTaskFormatter"
            }
        ]
    });
}

function GetTaskFormatter(value, row, index) {
    if (value)
        return '<button id="task_status'+'_'+row["id"]+'"'+' type="button" class="btn btn-success btn-xs btn-info" style="margin-right:5px;font-size: 12px">已领取</button>'
    else
        return '<button id="task_status'+'_'+row["id"]+'"'+' type="button" class="btn btn-danger btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'onclick="getTask(\'' + row['id'] + '\', \''
        + row['name'] + '\')">领取任务</button>'
}

function getTask(id) {

    data = {
        group_id:id
    }


    $.post("/choice_group",data,function(result){
            if (result.result=="success"){
                $('#task_status_'+id).text('已领取');
                $('#task_status_'+id).removeClass("btn-danger");
                $('#task_status_'+id).addClass("btn-success");
                refreshTable_mytask();
            }else{
                alert(result.result);
            }
    });

}