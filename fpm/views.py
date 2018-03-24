from __future__ import unicode_literals
from django.http import HttpResponse
from django.template import loader
import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.
from .serializers import *
from fpm import models
from .models import content,content_group,settings,collected_content
from django.db.models import F,Q
from django.db.models import Max
from html.parser import HTMLParser
from .forms import *
class MyHTMLParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.newdata = ""

    def handle_starttag(self, tag, attrs):
        print('<%s>' % tag)

    def handle_endtag(self, tag):
        print('</%s>' % tag)

    def handle_startendtag(self, tag, attrs):
        print('<%s/>' % tag)

    def handle_data(self, data):
        self.newdata = data

    def handle_comment(self, data):
        print('<!--', data, '-->')

    def handle_entityref(self, name):
        print('&%s;' % name)

    def handle_charref(self, name):
        print('&#%s;' % name)
# nav
@login_required(login_url='/login')
def go2History(request):
    return render(request,'fpm/myhistory.html')
@login_required(login_url='/login')
def go2myfeedback(request):
    username = request.user
    user_id = request.user.id
    params = {
        "username": username,
        "user_id": user_id
    }
    return render(request, 'fpm/myFeedBack.html', params)
@login_required(login_url='/login')
def go2check_feedback_html(request):
    username = request.user
    user_id = request.user.id
    params = {
        "username": username,
        "user_id": user_id
    }
    return render(request, 'fpm/checkFeedBack.html', params)
@login_required(login_url='/login')
def go2mytask(request):
    username = request.user
    user_id = request.user.id
    params = {
        "username":username,
        "user_id" : user_id
    }
    return render(request,'fpm/mytask.html',params)

@login_required(login_url='/login')
def mytasklist(request):
    limit = request.POST.get('limit')
    offset = request.POST.get('offset')
    Content_Group_List = content_group.objects.filter(user_id=request.user.id).order_by('is_complete')
    size = Content_Group_List.count()
    if limit and limit == '-1':
        data = Content_Group_List[int(offset):]
    else:
        data = Content_Group_List[int(offset):int(offset) + int(limit)]
    ContentGroup_ser = ContentGroupSerializer(data,many=True)

    res = {
        "data": ContentGroup_ser.data,
        "size": size
    }
    return JsonResponse(res)

@login_required(login_url='/login')
def TaskManagerTable_Api(request):
    limit = request.POST.get('limit')
    offset = request.POST.get('offset')
    settings_id= models.settings.objects.only("id").aggregate(Max("id"))['id__max']
    Content_Group_List = content_group.objects.filter(user_id=None).filter(settings_id=settings_id)
    size = Content_Group_List.count()
    if limit and limit == '-1':
        data = Content_Group_List[int(offset):]
    else:
        data = Content_Group_List[int(offset):int(offset) + int(limit)]
    ContentGroup_ser = ContentGroupSerializer(data, many=True)
    res = {
        "data": ContentGroup_ser.data,
        "size": size
    }
    return JsonResponse(res)
@login_required(login_url='/login')
def go2MyCollection(request):
    username = request.user
    user_id = request.user.id
    params = {
        "username":username,
        "user_id" : user_id
    }
    return render(request,'fpm/myCollection.html',params)

@login_required(login_url='/login')
def MyCollectionTable_Api(request):
    limit = request.POST.get('limit')
    offset = request.POST.get('offset')
    Collected_Content_Id_List = list(collected_content.objects.filter(user_id=request.user.id).order_by("-id"))
    objs = list(item.content_id for item in Collected_Content_Id_List)
    # Collected_Content_List = content.objects.filter(id__in=objs).filter(settings_id=settings_id).order_by('-id')
    Collected_Content_List = content.objects.filter(id__in=objs).order_by('-id')
    size = Collected_Content_List.count()
    if limit and limit == '-1':
        data = Collected_Content_List[int(offset):]
    else:
        data = Collected_Content_List[int(offset):int(offset) + int(limit)]
    CollectedContent_ser = ContentSerializer(data, many=True)
    res = {
        "data": CollectedContent_ser.data,
        "size": size
    }
    return JsonResponse(res)
@login_required(login_url='/login')
def MyHistoryTable_Api(request):
    if request.POST.get('history_all_list'):
        search_content = request.POST.get('search')
        history_all_list_str = request.POST.get('history_all_list')
        history_all_list = json.loads(history_all_list_str)
        limit = request.POST.get('limit')
        offset = request.POST.get('offset')
        group_id_list = content_group.objects.filter(user_id=request.user.id)
        objs = list(item.id for item in group_id_list)
        if search_content:
            History_Content_List = content.objects.filter(group_id__in=objs).filter(id__in=history_all_list).filter(content__contains=search_content).order_by('-id')
        else:
            History_Content_List = content.objects.filter(group_id__in=objs).filter(id__in=history_all_list).order_by('-id')
        size = History_Content_List.count()
        if limit and limit == '-1':
            data = History_Content_List[int(offset):]
        else:
            data = History_Content_List[int(offset):int(offset) + int(limit)]
        HistoryContent_ser = ContentSerializer(data, many=True)
        res = {
            "data": HistoryContent_ser.data,
            "size": size
        }
        return JsonResponse(res)

@login_required(login_url='/login')
def MyFeedBackTable_Api(request):
    limit = request.POST.get('limit')
    offset = request.POST.get('offset')
    FeedBack_Content_Content_List = feedback_content.objects.filter(user_id=request.user.id).order_by('-last_update_datetime')
    size = FeedBack_Content_Content_List.count()
    if limit and limit == '-1':
        data = FeedBack_Content_Content_List[int(offset):]
    else:
        data = FeedBack_Content_Content_List[int(offset):int(offset) + int(limit)]
    FeedBackContent_ser = FeedBackContentSerializer(data, many=True)
    res = {
        "data": FeedBackContent_ser.data,
        "size": size
    }
    return JsonResponse(res)



def get_remain_count(user_id):
    from django.db import connection, transaction
    cursor = connection.cursor()
    # 数据检索操作,不需要提交s
    cursor.execute("SELECT COUNT(b.id) FROM fpm_content_group a LEFT JOIN fpm_content b ON a.id=b.`group_id` WHERE a.user_id="+str(user_id)+" AND b.`is_labeled`=0")
    row = cursor.fetchone()
    return row[0]
import os
@login_required(login_url='/login')
def index(request):
    username = request.user
    user_id = request.user.id
    # 获取用户未完成group的settings最大值,如果没有，则取settings最大
    settings_id = content_group.objects.filter(user_id=user_id).filter(is_complete=False).only('settings_id').aggregate(Max('settings_id'))['settings_id__max']
    if not settings_id:
        settings_id = settings.objects.only('id').aggregate(Max('id'))['id__max']
        if not settings_id:
            params = {
                'username': username,
                'settings_id': "无任务",
                'settings_name': "无任务",
            }
            return render(request,'fpm/index.html',params)
    settings_lastest = settings.objects.get(id=settings_id)
    download_doc_file_path = ""
    if settings_lastest.doc_file_path:
        download_doc_file_path = "http://59.110.124.36:8009/"+str(settings_lastest.doc_file_path).split("/")[-2]+"/"+str(settings_lastest.doc_file_path).split("/")[-1]
    settings_name = settings_lastest.name

    Count_complete_group = content_group.objects.filter(settings_id=settings_id).filter(user_id=user_id).filter(is_complete=True).values_list('id',flat=True).count()
    not_complete_group_list = content_group.objects.filter(settings_id=settings_id).filter(user_id=user_id).filter(is_complete=False).values_list('id', flat=True)
    Count_not_complete_content = content.objects.filter(group_id__in=not_complete_group_list).filter(is_labeled=False).count()

    params = {
        'username': username,
        'settings_id': settings_id,
        'settings_name': settings_name,
        'Count_complete_group':Count_complete_group,
        'Count_not_complete_content':Count_not_complete_content,
        'flag_label':1,
        "download_doc_file_path":download_doc_file_path
    }
    if request.user.is_superuser:
        badge_num = feedback_content.objects.filter(last_update_user=0).count()
        params['badge_num'] = badge_num
    if not Count_not_complete_content:
        params['flag_label'] = 0

    return render(request,'fpm/index.html',params)

@login_required(login_url='/login')
def index_query_api(request):
    if request.method =="POST":
        setting_id = request.POST['settings_id']
        username = request.user
        user_id = request.user.id

        Count_complete_group = content_group.objects.filter(
            Q(is_complete=True) & Q(settings_id=setting_id) & Q(user_id=user_id)).count()
        not_complete_groups = content_group.objects.filter(
            Q(is_complete=False) & Q(settings_id=setting_id) & Q(user_id=user_id)).only('id')
        objs = list(item.id for item in not_complete_groups)
        Count_not_complete_content = models.content.objects.filter(
            Q(is_labeled=False) & Q(settings_id=setting_id) & Q(group_id__in=objs)).count()
        params = {
            'Count_complete_group': Count_complete_group,
            'Count_not_complete_content': Count_not_complete_content
        }
        return JsonResponse(params)

def loginhtml(request):
    template = loader.get_template('login/login.html')
    return HttpResponse(template.render())
@login_required(login_url='/login')
def main(request,settings_id,settings_name):
    params = {
        'username' : request.user,
        'settings_id':settings_id,
        "settings_name":settings_name,
        "flag_collection":0,
        'flag_history':0,
        'history_id_List':[],
        "collection_id2content_id_List":[]
    }
    return render(request, 'fpm/main2.html', params)

@login_required(login_url='/login')
def get_new_content(request):
    if request.POST['settings_id']:
        settings_id = int(request.POST.get('settings_id'))
    else:
        settings_id_m = models.settings.objects.only("id")
        settings_id = settings_id_m.aggregate(Max("id"))['id__max']

    flag_collection = int(request.POST.get('flag_collection'))
    flag_history = int(request.POST.get('flag_history'))
    if not flag_collection:
        if not flag_history:
            if request.POST.get("id"):
                content = models.content.objects.filter(settings_id=settings_id).get(id=int( request.POST.get("id")))
                if not content:
                    params = {
                        'message' : '任务不存在'
                    }
                    return JsonResponse(params)
            else:
                group = models.content_group.objects.filter(user_id=request.user.id).filter(settings_id=settings_id).exclude(is_complete=True).first()
                if not group:
                    params = {
                        'message' : '暂无标注任务，请重新申请'
                    }
                    return JsonResponse(params)
                content = models.content.objects.filter(group_id=group.id).filter(settings_id=settings_id).exclude(is_labeled=True).first()
                if not content:
                    group.is_complete=True
                    group.save()
                    params = {
                        'message' : '已完成'
                    }
                    return JsonResponse(params)
            # settings_id = content.settings_id
            settings = models.settings.objects.get(id=settings_id)
            parser = MyHTMLParser()
            data = content.content
            parser.feed(data)
            parser.close()
            params = {
                'content' : parser.newdata,
                'content_id': content.id,
                "keypositions": content.key_positions,
                "class_list" : content.class_list,
                "remain_count": get_remain_count(request.user.id),
                'settings_id':settings_id,
                "settings":{
                    "settings":settings.settings,
                    "setting_type":settings.setting_type,
                    "is_single":settings.is_single
                },
                'is_collected':False
            }
            # 监测是否被收藏过
            c = models.collected_content.objects.filter(user_id=request.user.id).filter(content_id=int(params['content_id']))

            if c:
                params['is_collected']=True

            group_ids_list = models.content_group.objects.filter(user_id=request.user.id).filter(
                settings_id=settings_id).values_list('id', flat=True)
            is_labeled_content_count = models.content.objects.filter(group_id__in=list(group_ids_list)).filter(
                is_labeled=True).count()
            all_content_count = models.content.objects.filter(group_id__in=list(group_ids_list)).count()
            params['is_label_percentage'] = "%.2f%%" % (is_labeled_content_count/all_content_count*100)
            params['un_label_percentage'] = "%.2f%%" % ((all_content_count-is_labeled_content_count) / all_content_count * 100)
            params['is_labeled_content_count'] = int(is_labeled_content_count)
            params['un_labeled_content_count'] = int(all_content_count-is_labeled_content_count)
            params['all_content_count'] = int(all_content_count)
            print(params)

            return JsonResponse(params)
        else:
            history_id = request.POST['history_id']
            content = models.content.objects.get(id=history_id)
            if not content:
                params = {
                    'message': '任务不存在'
                }
                return JsonResponse(params)
            else:
                settings = models.settings.objects.get(id=content.settings_id)
                params = {
                    'content': content.content,
                    'content_id': content.id,
                    "keypositions": content.key_positions,
                    "class_list": content.class_list,
                    "remain_count": get_remain_count(request.user.id),
                    "settings": {
                        "settings": settings.settings,
                        "setting_type": settings.setting_type,
                        "is_single": settings.is_single
                    },
                    'is_collected': False,
                    'is_history':True
                }
                return JsonResponse(params)

    else:
        if request.POST['collect_content_id']:
            collect_content_id = request.POST['collect_content_id']
            content = models.content.objects.get(id=collect_content_id)
            if not content:
                params = {
                    'message': '任务不存在'
                }
                return JsonResponse(params)
        else:
            group = models.content_group.objects.filter(
                user_id=request.user.id).exclude(is_complete=True).first()
            if not group:
                params = {
                    'message': '暂无标注任务，请重新申请'
                }
                return JsonResponse(params)
            content = models.content.objects.filter(group_id=group.id).exclude(is_labeled=True).first()
            if not content:
                group.is_complete = True
                group.save()
                params = {
                    'message': '已完成'
                }
                return JsonResponse(params)
        settings = models.settings.objects.get(id=content.settings_id)

        params = {
            'content': content.content,
            'content_id': content.id,
            "keypositions": content.key_positions,
            "class_list": content.class_list,
            "remain_count": get_remain_count(request.user.id),
            "settings": {
                "settings": settings.settings,
                "setting_type": settings.setting_type,
                "is_single": settings.is_single
            },
            'is_collected': True
        }
        return JsonResponse(params)
@login_required(login_url='/login')
def relation(request):
    content_id = int(request.POST.get('content_id'))
    cost_time = request.POST['cost_time']
    keypositions = json.loads(request.POST.get('keypositions'))
    print(content_id,cost_time,keypositions)
    for item in keypositions:
        item.pop("id")
    k = models.content.objects.get(id=content_id)
    if not k:
        return_json = {'result':"任务不存在"}
    else:
        g = models.content_group.objects.get(id=k.group_id)
        if g:
            if g.user_id == request.user.id:
                k.class_list = None
                k.key_positions = json.dumps(keypositions,ensure_ascii=True)
                k.last_update_datetime=timezone.now
                k.last_update_user = request.user.id
                k.cost_time=cost_time
                k.is_labeled=True
                k.save()
                return_json = {'result':"success"}
            else:
                return_json = {'result':"权限不足"}
        else:
            return_json = {'result':"权限不足"}
    return JsonResponse(return_json)



@login_required(login_url='/login')
def extract(request):
    content_id = int(request.POST.get('content_id'))
    cost_time = request.POST['cost_time']
    keypositions = json.loads(request.POST.get('keypositions'))
    k = models.content.objects.get(id=content_id)
    if not k:
        return_json = {'result':"任务不存在"}
    else:
        g = models.content_group.objects.get(id=k.group_id)
        if g:
            if g.user_id == request.user.id:
                k.class_list = None
                k.key_positions = json.dumps(keypositions)
                k.last_update_datetime=timezone.now
                k.last_update_user = request.user.id
                k.cost_time=cost_time
                k.is_labeled=True
                k.save()
                return_json = {'result':"success"}
            else:
                return_json = {'result':"权限不足"}
        else:
            return_json = {'result':"权限不足"}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def dirty_data_extract(request):
    content_id = int(request.POST.get('content_id'))
    cost_time = request.POST['cost_time']
    k = models.content.objects.get(id=content_id)
    if not k:
        return_json = {'result':"任务不存在"}
    else:
        g = models.content_group.objects.get(id=k.group_id)
        if g:
            if g.user_id == request.user.id:
                k.class_list = None
                k.last_update_datetime=timezone.now
                k.last_update_user = request.user.id
                k.cost_time=cost_time
                k.is_labeled=True
                k.is_dirty_data = True
                k.save()
                return_json = {'result':"success"}
            else:
                return_json = {'result':"权限不足"}
        else:
            return_json = {'result':"权限不足"}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def classfy(request):
    content_id = int(request.POST.get('content_id'))
    class_list = json.loads(request.POST.get('class_list'))
    cost_time = request.POST['cost_time']

    k = models.content.objects.get(id=content_id)
    if not k:
        return_json = {'result':"任务不存在"}
    else:
        g = models.content_group.objects.get(id=k.group_id)
        if g:
            if g.user_id == request.user.id:
                k.key_positions = None
                k.class_list = class_list
                k.last_update_datetime=timezone.now
                k.last_update_user = request.user.id
                k.cost_time=cost_time
                k.is_labeled=True
                k.save()
                return_json = {'result':"success"}
            else:
                return_json = {'result':"权限不足"}
        else:
            return_json = {'result':"权限不足"}
    return JsonResponse(return_json)

@login_required(login_url='/login')
def dirty_data_classfy(request):
    content_id = int(request.POST.get('content_id'))
    cost_time = request.POST['cost_time']
    k = models.content.objects.get(id=content_id)
    if not k:
        return_json = {'result':"任务不存在"}
    else:
        g = models.content_group.objects.get(id=k.group_id)
        if g:
            if g.user_id == request.user.id:
                k.last_update_datetime=timezone.now
                k.cost_time=cost_time
                k.last_update_user = request.user.id
                k.is_labeled=True
                k.is_dirty_data=True
                k.save()
                return_json = {'result':"success"}
            else:
                return_json = {'result':"权限不足"}
        else:
            return_json = {'result':"权限不足"}
    return JsonResponse(return_json)

@login_required(login_url='/login')
def collect(request):
    content_id =int (request.POST.get('content_id'))
    k = models.collected_content.objects.filter(content_id=content_id, user_id=request.user.id).count()
    if k > 0:
        return_json = {'result':"已收藏，请勿重复操作"}
    else:
        k = models.content.objects.get(id=content_id)
        if not k:
            return_json = {'result':"任务不存在"}
        else:
            g = models.content_group.objects.get(id=k.group_id)
            if g:
                if g.user_id == request.user.id:
                    models.collected_content.objects.create(content_id=content_id, user_id=request.user.id, last_update_user=request.user.id)
                    return_json = {'result':"收藏成功"}
                else:
                    return_json = {'result':"权限不足"}
            else:
                return_json = {'result':"权限不足"}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def del_collection(request):
    collection_id = int(request.POST.get('collection_id'))
    k = models.collected_content.objects.get(content_id=collection_id)
    if k:
        k.delete()
        return_json = {'result':"已取消收藏"}
    else:
        return_json = {'result':"不存在"}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def sample_content(request):
    content = "森展国际展览有限公司作为展会唯一的主办方及销售方，将继续保持一贯的专业视角与卓越品质，同时充分依托行业协会背景，继续与中国电子信息产业协会携手合作"
    k = models.content.objects.create(content=content, group_id="1")
    return_json = {'result':k.id}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def sample_group(request):
    name = "test"
    k = models.content_group.objects.create(name=name)
    return_json = {'result':k.id}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def get_group_list(request):
    page = int(request.POST.get("page")) if request.POST.get("page") else 1
    per_rows = int(request.POST.get("rows")) if request.POST.get("rows") else 10
    total_count = models.content_group.objects.filter(user_id=None).exclude(is_complete=True).count()
    group_list = models.content_group.objects.filter(user_id=None).exclude(is_complete=True)[int((page-1)*per_rows):int(page*per_rows)]
    rows = []
    for group in group_list:
        content_count = models.content.objects.filter(group_id=group.id).count()
        row = {
            "id": group.id,
            "name": group.name,
            "count": content_count
        }
        rows.append(row)
    page_result = {
        "total": total_count,
        "rows": rows
    }
    return HttpResponse(json.dumps(page_result), content_type='application/json')

@login_required(login_url='/login')
def group_list(request):
    params = {}
    return render(request, 'fpm/group_list.html', params)

@login_required(login_url='/login')
def choice_group(request):
    contains_group_count = models.content_group.objects.filter(user_id=request.user.id).exclude(is_complete=True).count()
    if contains_group_count >= 3:
        return HttpResponse(json.dumps({'result':"已超过任务组未完成限制数量:3"}), content_type='application/json')
    group_id = request.POST.get("group_id")
    group = models.content_group.objects.get(id=group_id)
    if group.user_id:
        return HttpResponse(json.dumps({'result':"任务已有归属，请刷新后重新选择"}), content_type='application/json')
    else:
        group.user_id = request.user.id
        group.save()
        return HttpResponse(json.dumps({'result':"success"}), content_type='application/json')

@login_required(login_url='/login')
def get_my_group_list(request):
    page = int(request.POST.get("page")) if request.POST.get("page") else 1
    per_rows = int(request.POST.get("rows")) if request.POST.get("page") else 10
    total_count = models.content_group.objects.filter(user_id=request.user.id).count()
    group_list = models.content_group.objects.filter(user_id=request.user.id)[int((page-1)*per_rows):int(page*per_rows)]
    rows = []
    for group in group_list:
        content_count = models.content.objects.filter(group_id=group.id).count()
        row = {
            "id": group.id,
            "name": group.name,
            "count": content_count,
            "is_complete": group.is_complete
        }
        rows.append(row)
    page_result = {
        "total": total_count,
        "rows": rows
    }
    return HttpResponse(json.dumps(page_result), content_type='application/json')

@login_required(login_url='/login')
def get_my_collection_list(request):
    page = int(request.POST.get("page")) if request.POST.get("page") else 1
    per_rows = int(request.POST.get("rows")) if request.POST.get("page") else 10
    total_count = models.collected_content.objects.filter(user_id=request.user.id).count()
    collection_list = models.collected_content.objects.filter(user_id=request.user.id)[int((page-1)*per_rows):int(page*per_rows)]
    rows = []
    for collection in collection_list:
        collection_content = models.content.objects.get(id=collection.content_id)
        row = {
            "id": collection.id,
            "content_id": collection_content.id,
            "content": collection_content.content
        }
        rows.append(row)
    page_result = {
        "total": total_count,
        "rows": rows
    }
    return HttpResponse(json.dumps(page_result), content_type='application/json')

@login_required(login_url='/login')
def my_group_list(request):
    params = {}
    return render(request, 'fpm/my_group_list.html', params)

@login_required(login_url='/login')
def get_history_list(request):
    history_all_list = request.POST.getlist("history_all_list[]")
    result_list = models.content.objects.filter(id__in=history_all_list).only('id','content')
    rows=[]
    for item in result_list:
        row = {
            "id": item.id,
            "content_id": item.id,
            "content": item.content
        }
        rows.append(row)
    page_result={
        "total": len(rows),
        "rows": rows
    }
    return HttpResponse(json.dumps(page_result), content_type='application/json')


@login_required(login_url='/login')
def Get_Selection_Histroy_Api(request,content_id,content_ids_list):
    content_ids_list = content_ids_list.split(",")
    history_id2content_id_list_tmp = list(models.content.objects.filter(id__in=content_ids_list).order_by('-id').values_list('id',flat=True))
    history_id2content_id_List = []
    for id in history_id2content_id_list_tmp:
        tmp_dict = {}
        if int(content_id)<id:
            continue
        else:
            tmp_dict['id'] = id
            history_id2content_id_List.append(tmp_dict)
    content = {
        'history_id':int(content_id),
        'flag_history': 1,
        'flag_collection': 0,
        'collection_id2content_id_List': [],
        'history_id_List':json.dumps(history_id2content_id_List),
    }
    return render(request, 'fpm/main2.html', content)

@login_required(login_url='/login')
def Get_Selection_FeedBack_Api(request,fb_id,fb_ids_list):
    f = feedback_content.objects.get(id = fb_id)
    content_id = f.content_id
    history_id2content_id_List=[]
    history_id2content_id_List.append({'id':content_id})

    content = {
        'history_id': content_id,
        'flag_history': 1,
        'flag_collection': 0,
        'collection_id2content_id_List': [],
        'history_id_List': json.dumps(history_id2content_id_List),
    }
    return render(request, 'fpm/main2.html', content)


@login_required(login_url='/login')
def Get_Selection_Collection_Api(request,content_id):

    collection_id = collected_content.objects.get(content_id=content_id).id
    collection_id2content_id_list_tmp = list(collected_content.objects.filter(user_id=request.user.id).order_by('-id').values_list('id','content_id'))
    collection_id2content_id_List = []
    for item in collection_id2content_id_list_tmp:
        id,content_id = item
        tmp_dict = {}
        if id>collection_id:
            continue
        else:
            tmp_dict['id'] = id
            tmp_dict['content_id'] = content_id
        collection_id2content_id_List.append(tmp_dict)
    content = {
        'collection_id':collection_id,
        "collected_content_id":content_id,
        'flag_collection':1,
        'collection_id2content_id_List':json.dumps(collection_id2content_id_List),
        'flag_history':0,
        'history_id_List':[]
        # "collection_id2content_id_List":collection_id2content_id_List
    }
    return render(request,'fpm/main2.html',content)
@login_required(login_url='/login')
def getAllSelections_Collection_Api(request,content_ids_list):
    content_ids_list = content_ids_list.split(",")
    collection_id2content_id_list_tmp = list(collected_content.objects.filter(user_id=request.user.id).filter(content_id__in=content_ids_list).order_by('-id').values_list('id','content_id'))
    collection_id2content_id_List = []
    for item in collection_id2content_id_list_tmp:
        id,content_id = item
        tmp_dict = {}
        tmp_dict['id'] = id
        tmp_dict['content_id'] = content_id
        collection_id2content_id_List.append(tmp_dict)
    content = {
        'flag_collection':1,
        'flag_history':0,
        'collection_id2content_id_List':json.dumps(collection_id2content_id_List)
    }
    return render(request,'fpm/main2.html',content)

@login_required(login_url='/login')
def del_collection_selections_List_Api(request):
    if request.method == "POST":
        del_collection_content_id_List = request.POST["id_list"]
        del_collection_content_id_List = json.loads(del_collection_content_id_List)

        collected_content.objects.filter(content_id__in=del_collection_content_id_List).delete()
        content = {
            "result":True
        }
        return JsonResponse(content)

@login_required(login_url='/login')
def go2Monitor_html(request):
    return render(request,'monitor/monitor.html')
@login_required(login_url='/login')
def feedback_api(request):
    if request.method =='POST':
        f = upload_form(request.POST, request.FILES)
        if f.is_valid():
            feedback_question = f.cleaned_data['feedback_question']
            settings_name = f.cleaned_data['settings_name']
            feedback_file = f.cleaned_data['feedback_file']
            content_id = f.cleaned_data['content_id']
            c = content.objects.get(id=content_id)
            user_id = request.user.id
            f = feedback_content.objects.filter(content_id=content_id)
            if f:
                f.delete()
            feedback_content.objects.create(
                user_id=user_id,
                content_id = content_id,
                feedback_question = feedback_question,
                content = c.content,
                feedback_file_submit = feedback_file
            )

            return JsonResponse({
                "result":"success"
            })

@login_required(login_url='/login')
def del_feedback(request):
    fb_id = int(request.POST.get('fb_id'))
    k = models.feedback_content.objects.get(id=fb_id)
    if k:
        k.delete()
        return_json = {'result': "success"}
    else:
        return_json = {'result': "不存在"}
    return HttpResponse(json.dumps(return_json), content_type='application/json')

@login_required(login_url='/login')
def CheckFeedBackTable_Api(request):
    if request.method=="POST" and request.user.is_superuser:
        limit = request.POST.get('limit')
        offset = request.POST.get('offset')
        feedback_content_List = feedback_content.objects.all().order_by('last_update_datetime')
        size = feedback_content_List.count()
        if limit and limit == '-1':
            data = feedback_content_List[int(offset):]
        else:
            data = feedback_content_List[int(offset):int(offset) + int(limit)]
        FeedBackContent_ser = FeedBackContentSerializer(data, many=True)

        res = {
            "data": FeedBackContent_ser.data,
            "size": size
        }
        return JsonResponse(res)

@login_required(login_url='/login')
def answer_feedback(request):
    if request.method =='POST' and request.user.is_superuser:
        f = reply_form(request.POST,request.FILES)
        if f.is_valid():
            fb_id = f.cleaned_data['fb_id']
            feedback_answer = f.cleaned_data['feedback_answer']
            feedback_reply_file = f.cleaned_data['feedback_reply_file']
            f = feedback_content.objects.get(
                id=fb_id
            )
            f.last_update_datetime = timezone.now
            f.last_update_user = request.user.id
            f.feedback_answer = feedback_answer
            f.feedback_file_reply = feedback_reply_file
            f.save()

            return render(request,'fpm/checkFeedBack.html')