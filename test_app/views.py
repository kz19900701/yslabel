from django.shortcuts import render
# Create your views here.
from django.contrib.auth.decorators import login_required
from django.http.response import JsonResponse
import requests,json



# 进入排行榜-命名实体识别界面
@login_required(login_url='/login')
def test_app_paihangbang_entity(request):
    return render(request,"test_app/index_entity.html")

# 进入排行榜-舆情信息分类界面
@login_required(login_url='/login')
def test_app_paihangbang_yuqing(request):
    return render(request,"test_app/index_yuqing.html")
def test_app_paihangbang_susong(request):

    return render(request,'test_app/index_susong.html')
#　命名实体接口
@login_required(login_url='/login')
def test_app_entity(request):
    if request.method=='POST':
        print(request.POST)
        url="http://localhost:7777/predict"
        data = request.POST['input_content']
        formatted_data ={
            "content":data
        }
        res = requests.post(url,formatted_data)
        res = json.loads(res.text)
        entities = res['entities']
        tmp_list=[]
        for item in entities:
            tmp_list.append(item['word'])
        data = {
            "result": tmp_list
        }
        return JsonResponse(data)



#　舆情分类接口
@login_required(login_url='/login')
def test_app_yuqing(request):
    if request.method=='POST':
        print(request.POST)
        url="http://localhost:7778/predict"
        data = request.POST['input_content']
        formatted_data ={
            "content":data
        }
        res = requests.post(url,formatted_data).text
        tmp_list=[]
        tmp_list.append(res)
        data={
            "result": tmp_list
        }
        return JsonResponse(data)

def test_app_susong(request):
    if request.method=='POST':
        print(request.POST)
        url="http://localhost:7779/predict"
        data = request.POST['input_content']
        formatted_data ={
            "content":data
        }
        res = requests.post(url,formatted_data).text
        tmp_list=[]
        tmp_list.append(res)
        data={
            "result": tmp_list
        }
        return JsonResponse(data)

