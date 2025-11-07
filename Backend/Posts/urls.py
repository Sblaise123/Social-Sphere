from django.urls import path
from .views import (
    PostListCreateView, PostDetailView, PostLikeView,
    CommentListCreateView, CommentDetailView
)

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('/', PostDetailView.as_view(), name='post-detail'),
    path('/like/', PostLikeView.as_view(), name='post-like'),
    path('/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments//', CommentDetailView.as_view(), name='comment-detail'),
]