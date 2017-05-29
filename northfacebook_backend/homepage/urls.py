from django.conf.urls import url, include
from homepage.serializers import ArticleSerializer
from rest_framework.urlpatterns import format_suffix_patterns
from homepage import views

urlpatterns = [
    url(r'^auth/$', views.AuthList.as_view()),
    url(r'^users/$', views.user_list),
    url(r'^users/(?P<username>\w+)/$', views.user_detail),
    url(r'^users/(?P<username>\w+)/nowchat/$', views.user_nowchat),
    url(r'^users/(?P<username>\w+)/nonchat/$', views.user_nonchat),
    url(r'^users/(?P<username>\w+)/wall/$', views.wall),
    url(r'^profile/$',views.profile_list),
#    url(r'^profile/(?P<pk>[0-9]+)/$',views.profile_detail),
    url(r'^users/(?P<username>\w+)/profile/$',views.profile),
    url(r'^article/$',views.article_list),
    url(r'^article/(?P<pk>[0-9]+)/$',views.article_detail),
    url(r'^article/(?P<pk>[0-9]+)/article/$',views.article_article),
    url(r'^article/(?P<pk>[0-9]+)/total/$',views.total_article),
    url(r'^like/$',views.like_list),
#    url(r'^like/(?P<pk>[0-9]+)/$',views.like_detail),
    url(r'^article/(?P<pk>[0-9]+)/like/$',views.like),
    url(r'^mainpage/$',views.main_list),
    url(r'^chatroom/$',views.chatroom_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/$',views.chatroom_detail),
    url(r'^chatuser/$',views.chatuser_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/user/$',views.chatuser),
    url(r'^text/$', views.text_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/text/$',views.text),
    ]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls', namespace = 'rest_framework')),
]

