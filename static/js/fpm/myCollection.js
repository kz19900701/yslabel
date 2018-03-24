function MyCollectionTable() {
    var url = "/MyCollectionTable_Api";
    $('#MyCollectionTable').bootstrapTable({
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
                    return value.substring(0,40)+"..."
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
    return '<button type="submit" class="btn btn-default btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'name="content_id" value="'+row['id']+'" onclick="window.location.href=\'Get_Selection_Collection_Api/'+row['id']+'\''+'" >查看</button>' +
        '<button type="button" class="btn btn-danger btn-xs btn-info" style="margin-right:5px;font-size: 12px" ' +
        'onclick="delele_collecttion(\'' + row['id'] + '\', \''
        + row['name'] + '\')">删除</button>'

}

// 删除按钮
function delele_collecttion(id) {
    data ={
        collection_id:id
    }
    $.post('/del_collection',data,function () {
        refreshTable_mycollection();
    })
}

function refreshTable_mycollection() {
    var params = {
        limit : 11, // 页面大小
        offset : 0 // 页码
    }
    $('#MyCollectionTable').bootstrapTable('refresh', params);    //刷新表格
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