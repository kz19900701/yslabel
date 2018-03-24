from __future__ import unicode_literals
from django.contrib import auth
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.http import HttpResponse
import json

def get_user_list(start, limit):
    from django.db import connection, transaction
    cursor = connection.cursor()
    # 数据检索操作,不需要提交
    cursor.execute("SELECT a.id, a.username, COUNT(b.user_id) AS X FROM auth_user a LEFT JOIN (SELECT * FROM fpm_content_group WHERE is_complete=1) b ON a.`id`=b.user_id where a.is_superuser=0 GROUP BY a.id ORDER BY X DESC limit "+str(int(start)*int(limit))+", " + limit)
    rows=[]
    for obj in cursor.fetchall():
        rows.append({
            "id":obj[0],
            "name":obj[1],
            "count":obj[2]
        })
    return rows

def get_total_count_user():
    from django.db import connection, transaction
    cursor = connection.cursor()
    # 数据检索操作,不需要提交
    cursor.execute("SELECT count(0) FROM auth_user where is_superuser=0")
    row = cursor.fetchone()
    return row

# Create your views here.
def login(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    nextstep = request.POST.get('next', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        if nextstep != '':
            return HttpResponseRedirect(nextstep)
        else:
            return HttpResponseRedirect("/index")
    else:
        nextstep = request.GET.get('next', '')
        params = {'nextstep':nextstep}
        # return render(request, 'user/login.html', params)
        return render(request, 'login/login.html', params)

def logout(request):
    auth.logout(request)
    return render(request,'login/login.html')

def userlist(request):
    params={}
    return render(request, 'user/user_list.html', params)

def getuserlist(request):
    page = int(request.POST.get("page")) if request.POST.get("page") else 1
    per_rows = int(request.POST.get("rows")) if request.POST.get("rows") else 10
    result = {
        'total':get_total_count_user(),
        'rows':get_user_list(str(page-1), str(per_rows))
    }
    return HttpResponse(json.dumps(result), content_type='application/json')