
function MyHistoryTable() {
    if (localStorage.getItem("history_all_list")) {
        var url = "/MyHistoryTable_Api";
        $('#MyHistoryTable').bootstrapTable({

            method: 'POST',
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            cache: false,
            striped: true,                              //是否显示行间隔色
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            url: url,
            toolbar: '#toolbar',
            height: $(window).height() - 458,
            width: $(window).width(),
            pagination: true,
            queryParams: queryParams,//参数
            queryParamsType: "limit",
            clickToSelect: true, //是否启用点击选中行
            singleSelect: false,
            minimumCountColumns: 2,
            pageNumber: 1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100, 'All'],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            exportDataType: 'all',
            responseHandler: responseHandler,
            sortName: "id",
            sortOrder: "asc",
            search: true,
            searchOnEnterKey: true,
            columns: [
                {
                    checkbox: true
                },
                {
                    field: 'id',
                    title: '序号',
                    align: 'center',
                    valign: 'middle',
                    formatter: function (value, row, index) {
                        return index + 1
                    },
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
    }else {
        $('#MyHistoryTable').text("目前没有历史数据...")
    }
}
function OperatorFormatter(value, row, index) {
    return '<button type="submit" class="btn btn-default btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'name="content_id" value="'+row['id']+'" onclick="getSelection_History('+row['id']+')" >查看</button>'
}
function getSelection_History(contnet_id) {
    HistoryAll_List = localStorage.getItem("history_all_list");
    HistoryAll_List = JSON.parse(HistoryAll_List);
    console.log(HistoryAll_List);
    id_list_line ="" ;
    for (var i in HistoryAll_List) {
        if (i==0){
            id_list_line = HistoryAll_List[i]
        }else {
            id_list_line = id_list_line+","+(HistoryAll_List[i])
        }
    }
    window.location.href = 'Get_Selection_Histroy_Api/content_id='+contnet_id+'&history_ids_list='+id_list_line
}



function refreshTable_mycollection() {

    var params = {
            limit :11, // 页面大小
            offset : 0, // 页码
    };
    if (localStorage.getItem("history_all_list")){
        params['history_all_list']=localStorage.getItem("history_all_list");
    }

    $('#MyCollectionTable').bootstrapTable('refresh', params);    //刷新表格
}
function queryParams(params) {
    if (localStorage.getItem("history_all_list")){
        history_all_list=localStorage.getItem("history_all_list");
        var param = {
            history_all_list:history_all_list,
            limit : params.limit, // 页面大小
            offset : params.offset, // 页码
            search:params.search
        }
        return param
    }
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

    window.location.href = 'getAllSelections_Collection_Api/content_ids_list='+id_list_line
}

function delAllSelections_Collection() {
    var delAllSelections_collection_List = $('#MyCollectionTable').bootstrapTable('getAllSelections');
    id_list = []
    for (var i in delAllSelections_collection_List) {
        id_list.push(delAllSelections_collection_List[i].id)
    }
    var url = "del_collection_selections_List_Api";
    $.ajax({
       type: "POST",
       url:  url,
       data: {
           id_list:JSON.stringify(id_list)
       },
       success: function() {
           refreshTable_mycollection()
       }})
    }
