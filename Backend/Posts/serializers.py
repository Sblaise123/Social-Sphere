from rest_framework import serializers
from .models import Post, Comment
from accounts.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
	author = UserSerializer(read_only=True)

	class Meta:
		model = Comment
		fields = ['id', 'author', 'text', 'created_at']


class PostSerializer(serializers.ModelSerializer):
	author = UserSerializer(read_only=True)
	comments = CommentSerializer(many=True, read_only=True)
	like_count = serializers.IntegerField(source='like_count', read_only=True)

	class Meta:
		model = Post
		fields = ['id', 'author', 'text', 'image', 'created_at', 'comments', 'like_count']