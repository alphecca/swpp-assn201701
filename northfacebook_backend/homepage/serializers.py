from rest_framework import serializers
from django.contrib.auth.models import User
from homepage.models import *
from django.db.models import Sum, Q
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        #article
        fields = ('id','username')

class LikeSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    parent=serializers.ReadOnlyField(source='article.id')
    class Meta:
        model = Like
        fields = ('id','parent','owner')

class ArticleSerializer(serializers.ModelSerializer):
    owner=serializers.ReadOnlyField(source='owner.username')
    parent=serializers.ReadOnlyField(source='article.id')
    children_num = serializers.SerializerMethodField()
    like_num = serializers.SerializerMethodField()
    def get_children_num(self,obj):
        article=Article.objects.filter(parent=obj.id)
        s=article.count()
        for o in article:
            s+=Article.objects.filter(parent=o.id).count()
        return s
    def get_like_num(self,obj):
        return Like.objects.filter(parent=obj.id).count()
    class Meta:
        model = Article
        fields = ('id','owner','parent',
                'created_time','updated_time','text',
                'children_num','like_num')

