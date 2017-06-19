from django.conf.urls import url, include
from homepage.serializers import ArticleSerializer
from rest_framework.urlpatterns import format_suffix_patterns
from homepage import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^auth/$', views.AuthList.as_view()),
    url(r'^users/$', views.user_list),
    url(r'^users/(?P<username>\w+)/$', views.user_detail),
    url(r'^users/(?P<username>\w+)/wall/$', views.wall),
    url(r'^profile/$',views.profile_list),
    url(r'^users/(?P<username>\w+)/profile/$',views.profile),
    url(r'^users/(?P<username>\w+)/sasang/$', views.sasang),
    url(r'^users/(?P<username>\w+)/friends/$', views.friend_list),
    url(r'^users/(?P<username>\w+)/addfriend/$', views.add_friend_list),
    url(r'^users/(?P<username>\w+)/addfriend/(?P<friendname>\w+)/$', views.add_friend),
    #url(r'^users/(?P<username>\w+)/profile/image/$', views.)
    url(r'^myaddfriend/$', views.my_add_friend_list),
    url(r'^article/$',views.article_list),
    url(r'^article/(?P<pk>[0-9]+)/$',views.article_detail),
    url(r'^article/(?P<pk>[0-9]+)/article/$',views.article_article),
    url(r'^article/(?P<pk>[0-9]+)/total/$',views.total_article),
    url(r'^like/$',views.like_list),
    url(r'^like/(?P<pk>[0-9]+)/$',views.like_detail),
    url(r'^article/(?P<pk>[0-9]+)/like/$',views.like),
    url(r'^mainpage/$',views.main_list),
    url(r'^chatroom/$',views.chatroom_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/$',views.chatroom_detail),
    url(r'^chatuser/$',views.chatuser_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/user/$',views.chatuser),
    url(r'^text/$', views.text_list),
    url(r'^chatroom/(?P<pk>[0-9]+)/text/$',views.text),
    url(r'^nowchat/$', views.user_nowchat),
    url(r'^nonchat/$', views.user_nonchat),
    ]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns += [
    url(r'^api-auth/', include('rest_framework.urls', namespace = 'rest_framework')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
