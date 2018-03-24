#! /user/bin/env python
# ——×—— coding:utf-8 ——×——
from django.shortcuts import render
from django.db.models import Q
import json
from .models import content,content_group,settings,collected_content
from django.contrib.auth.decorators import login_required
from django.db import connection, transaction
from django.http import JsonResponse
from django.http import HttpResponse
def monitor_list(request):
    cursor = connection.cursor()
    cursor.execute(
        "SELECT a.settings_id,b.name FROM fpm_content_group a LEFT JOIN fpm_settings b ON a.settings_id = b.id AND a.user_id !='' GROUP BY a.settings_id ORDER BY a.settings_id DESC"
    )
    settings_id2name_tuple = cursor.fetchall()
    tmp_list=[]
    for item in settings_id2name_tuple:
        tmp_dict={}
        settings_id = item[0]
        name = item[1]
        tmp_dict['settings_id'] = settings_id
        tmp_dict['name'] = name
        tmp_list.append(tmp_dict)
    content={
        "result_list":tmp_list
    }
    return render(request, "fpm/monitor_list.html",content)

def monitor_list_api(request):
    if request.method =="POST":
        settings_id = int(request.POST['settings_id'])
        print(settings_id)
        cursor = connection.cursor()
        # 数据检索操作,不需要提交
        cursor.execute(
            "SELECT user_id, COUNT(1) AS gotten_tasks FROM fpm_content_group WHERE settings_id =%d GROUP BY user_id"%(settings_id))
        gotten_tasks = cursor.fetchall() # ((None, 194), (2, 1), (65, 2), (111, 1))
        cursor.execute(
            "SELECT user_id, COUNT(1) AS finiished_tasks FROM fpm_content_group WHERE is_complete=1 AND settings_id =%d GROUP BY user_id"%(settings_id))
        finished_tasks = cursor.fetchall()
        cursor.execute(
            "SELECT user_id,COUNT(1) as unfinished_tasks FROM fpm_content_group WHERE is_complete =0 AND settings_id =%d GROUP BY user_id"%(settings_id))
        unfinished_tasks = cursor.fetchall()
        cursor.execute(
            "SELECT user_id,COUNT(1) FROM fpm_collected_content GROUP BY user_id")
        collected_tasks = cursor.fetchall()
        cursor.execute(
            "SELECT id,username FROM auth_user")
        user_infos = cursor.fetchall()

        tmp_list = []
        for gotten_task in gotten_tasks:
            userid_got = gotten_task[0]
            gotten_task_num = gotten_task[1]
            tmp_dict={}
            tmp_dict['userid']=userid_got
            tmp_dict['gotten_task_num']=gotten_task_num
            for finished_task in finished_tasks:
                userid_finish = finished_task[0]
                finished_task_num = finished_task[1]
                if userid_got==userid_finish:
                    tmp_dict['finished_task_num'] = finished_task_num
                    continue
            for unfinished_task in unfinished_tasks:
                userid_unfinish = unfinished_task[0]
                unfinished_task_num = unfinished_task[1]
                if userid_got==userid_unfinish:
                    tmp_dict['unfinished_task_num'] = unfinished_task_num
                    continue
            for collected_task in collected_tasks:
                userid_collected = collected_task[0]
                collected_task_num = collected_task[1]
                if userid_got==userid_collected:
                    tmp_dict['collected_task_num'] = collected_task_num
                    continue
            for user_info in user_infos:
                userid_info = user_info[0]
                username = user_info[1]
                if userid_got==userid_info:
                    tmp_dict['username'] = username
                    continue
            tmp_list.append(tmp_dict)

        page_result={
            "total":len(tmp_list),
            "rows":tmp_list
        }
        return HttpResponse(json.dumps(page_result),content_type='application/json')