from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Grupo, Participante, Exclusao, Resultado

class ResultadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resultado
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class GrupoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grupo
        fields = ['id', 'nome', 'criado_em', 'participantes']

class ParticipanteSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='usuario.get_full_name', read_only=True)
    username = serializers.CharField(source='usuario.username', read_only=True)
    gender = serializers.CharField(source='genero', read_only=True)
    user_id = serializers.IntegerField(source='usuario.id', read_only=True)
    class Meta:
        model = Participante
        fields = [
            'id',
            'user_id',
            'name', 
            'username',
            'gender',
            'photo_url',
            'gostos_pessoais'
        ]