from rest_framework import serializers
from .models import *


class ContentSerializer(serializers.ModelSerializer):
   class Meta:
       model = content
       fields = "__all__"


class ContentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = content_group
        fields = "__all__"


# 用户收藏的样本
class CollectedContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = collected_content
        fields = "__all__"


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = settings
        fields = "__all__"


class FeedBackContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = feedback_content
        fields = "__all__"