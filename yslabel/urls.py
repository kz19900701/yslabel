"""yslabel URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from fpm import views as fpmviews
from user import views as userviews
from test_app import views as testviews
from fpm import monitor_views
from fpm.views_test import *
from fpm.views import *
# view_router
from rest_framework.routers import DefaultRouter
# router = DefaultRouter()
# router.register(r'feedback_api',feedback_api)
from . import views

urlpatterns = [
    # url(r'^', include(router.urls)),
    # url(r'^myCollection$', fpmviews.go2MyCollection, name="myCosllection"),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'main', fpmviews.main,name='main'),
    url(r'^get_history_list',fpmviews.get_history_list),
    url(r'^monitor_list$', monitor_views.monitor_list),
    url(r'^monitor_list_api$',monitor_views.monitor_list_api),
    url(r'^test_app_paihangbang_susong$',testviews.test_app_paihangbang_susong),
    url(r'^test_app_paihangbang_entity$', testviews.test_app_paihangbang_entity),
    url(r'^test_app_paihangbang_yuqing$', testviews.test_app_paihangbang_yuqing),
    url(r'^test_app_susong', testviews.test_app_susong),
    url(r'^test_app_yuqing', testviews.test_app_yuqing),
    url(r'^test_app_entity', testviews.test_app_entity),
    url(r'^admin/', admin.site.urls),
    url(r'^index_query_api',fpmviews.index_query_api),
    url(r'index', fpmviews.index,name='index'),
    url(r'^sample_content', fpmviews.sample_content),
    url(r'^sample_group', fpmviews.sample_group),
    url(r'^get_new_content', fpmviews.get_new_content),
    url(r'^get_group_list', fpmviews.get_group_list),
    url(r'^get_my_group_list', fpmviews.get_my_group_list),
    url(r'^del_collection$', fpmviews.del_collection),
    url(r'^group_list', fpmviews.group_list),
    url(r'^choice_group$', fpmviews.choice_group),
    url(r'^my_group_list', fpmviews.my_group_list),
    url(r'^get_my_collection_list', fpmviews.get_my_collection_list),
    url(r'^relation',fpmviews.relation,name="relation"),
    url(r'^extract', fpmviews.extract),
    url(r'^classfy', fpmviews.classfy),
    url(r'^collect', fpmviews.collect),
    url(r'^getuserlist', userviews.getuserlist),
    url(r'^userlist', userviews.userlist),
    url(r'^login', userviews.login,name='login'),
    url(r'^logout', userviews.logout,name='logout'),
    url(r'^$', fpmviews.loginhtml,name='loginhtml'),
    # 导航栏s
    url(r'^StartLabel/settings_id=(\d+)&settings_name=(.+)$',fpmviews.main,name="StartLabel"),
    url(r'^mytask$',fpmviews.go2mytask,name="mytask"),
    url(r'^mytasklist$',fpmviews.mytasklist,name="mytasklist"),
    url(r'^myCollection$',fpmviews.go2MyCollection,name="myCollection"),
    url(r'^myHistory$',fpmviews.go2History,name="myHistory"),
    # api
    url(r'^TaskManagerTable_Api$',fpmviews.TaskManagerTable_Api,name="TaskManagerTable_Api"),
    url(r'^MyCollectionTable_Api$',fpmviews.MyCollectionTable_Api,name="MyCollectionTable_Api"),
    url(r'^MyHistoryTable_Api$',fpmviews.MyHistoryTable_Api,name="MyHistoryTable_Api"),
    url(r'^Get_Selection_Collection_Api/(?P<content_id>[0-9]+)$',fpmviews.Get_Selection_Collection_Api,name="Get_Selection_Collection_Api"),
    url(r'^getAllSelections_Collection_Api/content_ids_list=([\d+\,]+)$',fpmviews.getAllSelections_Collection_Api,name="getAllSelections_Collection_Api"),
    url(r'^del_collection_selections_List_Api$',fpmviews.del_collection_selections_List_Api,name="del_collection_selections_List_Api"),
    # history
    url(r'^Get_Selection_Histroy_Api/content_id=([\d]+)&history_ids_list=([\d+\,]+)$',fpmviews.Get_Selection_Histroy_Api,name="Get_Selection_Histroy_Api"),
    url(r'^dirty_data_extract$',fpmviews.dirty_data_extract,name="dirty_data_extract"),
    url(r'^dirty_data_classfy$',fpmviews.dirty_data_classfy,name="dirty_data_classfy"),

    # monitor
    url(r'^monitor$',fpmviews.go2Monitor_html,name='monitor'),
    # url(r'^monitor/MonitorTable_Api$',fpmviews.MonitorTable_Api,name='MonitorTable_Api'),
    # test
    url(r'groups/$',GroupListView.as_view(),name="groupsList"),

    # feedback
    url(r'myFeedBack',fpmviews.go2myfeedback,name="myFeedBack"),
    url(r'^StartLabel/feedback_api$',fpmviews.feedback_api,name="feedback_api"),
    url(r'^MyFeedBackTable_Api$',fpmviews.MyFeedBackTable_Api,name="MyFeedBackTable_Api"),
    url(r'^del_feedback',fpmviews.del_feedback,name="del_feedback"),
    url(r'^go2check_feedback_html',fpmviews.go2check_feedback_html,name="go2check_feedback_html"),
    url(r'^CheckFeedBackTable_Api$',fpmviews.CheckFeedBackTable_Api,name="CheckFeedBackTable_Api"),
    url(r'^answer_feedback$',fpmviews.answer_feedback,name="answer_feedback"),
    url(r'^Get_Selection_FeedBack_Api/fb_id=([\d]+)&fb_ids_list=([\d+\,]+)$',fpmviews.Get_Selection_FeedBack_Api,name="Get_Selection_Histroy_Api"),
    # download
    url(r'^download_submit$', views.DonwloadView_Submit, name='download_submit'),
    url(r'^download_reply$', views.DonwloadView_Replay, name='download_reply'),
    url(r'^doc_download/(?P<settings_id>[0-9]+)$',views.DonwloadView_Doc_Download,name="doc_download"),

]