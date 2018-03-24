#!/usr/bin/env python
# -*- coding:utf-8 -*-

from django.views.generic.base import View
from .models import content_group
from django.http import JsonResponse
#drf
from fpm.serializers import ContentGroupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
# better
from rest_framework import mixins
from rest_framework import generics
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
# 很重要
from rest_framework import viewsets
# filter
from django_filters.rest_framework import DjangoFilterBackend
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    page_query_param = "p"
    max_page_size = 100

# filter
class GroupListViewSet(mixins.ListModelMixin,
                       viewsets.GenericViewSet):


    queryset = content_group.objects.all()
    serializer_class = ContentGroupSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('id', 'name')  # 这里是精确搜索
    # filter_class =







# 不用filter的过滤
# class GroupListViewSet(mixins.ListModelMixin,
#                        viewsets.GenericViewSet):
#     """
#     商品列表页
#
#     """
#     serializer_class = ContentGroupSerializer
#     pagination_class = StandardResultsSetPagination
#
#     def get_queryset(self):
#         return content_group.objects.filter(id__gt=300)



class GroupListView(ListAPIView):
    # GenericAPIView 集成APIView
    #2 class ListAPIView(mixins.ListModelMixin,
    #               GenericAPIView):
    # """
    # Concrete view for listing a queryset.
    # """
    # def get(self, request, *args, **kwargs):
    #     return self.list(request, *args, **kwargs)
    # 所以直接阶乘 ListAPIView
    queryset = content_group.objects.all()
    serializer_class = ContentGroupSerializer
    pagination_class = StandardResultsSetPagination

    # 通过settings 文件来配置分页



#
# class GroupListView(APIView):
#     """
#     备注就是接口的描述
#     """
#     def get(self, request, format=None):
#         content_groups  = content_group.objects.all()
#         # dfr的序列化 会根据settings的media配置，给imageField自动加地址
#         serializer = ContentGroupSerializer(content_groups, many=True) # many表示list
#         return Response(serializer.data)
#
#
#     def post(self, request, format=None):
#         serializer = ContentGroupSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class GroupListView(View):
    # 1.view
    # def get(self,request):
    #     """
    #     通过django的view实现任务组列表页
    #     :param request:
    #     :return:
    #     """
    #     groups = content_group.objects.all()[:10]
    #     json_list = []
    #     for group in groups:
    #         tmp_dict = {}
    #         tmp_dict['id'] = group.id
    #         tmp_dict['name'] = group.name
    #         json_list.append(tmp_dict)
    #     content = {
    #         "groups":json_list
    #     }
    #
    #     return JsonResponse(content)
    # 2. model_to_dict
    # def get(self,request):
    #
    #     groups = content_group.objects.all()[:10]
    #     from django.forms.models import model_to_dict
    #     json_list = []
    #     for item in groups:
    #         json_list.append(model_to_dict(item))
    #     content = {
    #         'groups':json_list
    #     }
    #     return JsonResponse(content)

    # 3. serializers

    # def get(self,request):
    #     import json
    #     groups = content_group.objects.all()[:10]
    #     from django.core import serializers
    #     json_data = serializers.serialize("json",groups)
    #     a = json.loads(json_data)
    #     return JsonResponse(a,safe=False)
