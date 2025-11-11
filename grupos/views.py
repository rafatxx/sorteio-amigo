from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Grupo, Participante, Resultado
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer, GrupoSerializer, ParticipanteSerializer, ResultadoSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class GrupoViewSet(viewsets.ModelViewSet):
    queryset = Grupo.objects.all()
    serializer_class = GrupoSerializer
    permission_classes = [AllowAny]   

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all().order_by('usuario__first_name')
    serializer_class = ParticipanteSerializer
    permission_classes = [IsOwnerOrReadOnly]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Resultado.objects.all()
    serializer_class = ResultadoSerializer
    permission_classes = [IsAuthenticated]

class MeuMenuView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request, format=None):
        usuario = request.user 
        try:
            participante = Participante.objects.get(usuario=usuario, grupo__nome="Amigo Secreto 2025") # ATENÇÃO: Hardcoded!
            gostos_pessoais = participante.gostos_pessoais
        except Participante.DoesNotExist:
            gostos_pessoais = "Você ainda não foi adicionado a um grupo."

        try:
            amigo_secreto = Resultado.objects.get(doador=usuario, tipo_sorteio='amigo')
            gostos_amigo = Participante.objects.get(usuario=amigo_secreto.receptor, grupo=amigo_secreto.grupo).gostos_pessoais

            info_amigo = {
                "nome": amigo_secreto.receptor.first_name,
                "gostos": gostos_amigo
            }
        except Resultado.DoesNotExist:
            info_amigo = None 

        try:
            inimigo_secreto = Resultado.objects.get(doador=usuario, tipo_sorteio='inimigo')
            info_inimigo = {
                "nome": inimigo_secreto.receptor.first_name
            }
        except Resultado.DoesNotExist:
            info_inimigo = None 

        data = {
            'meu_nome': usuario.username,
            'meus_gostos': gostos_pessoais,
            'meu_amigo_secreto': info_amigo,
            'meu_inimigo_secreto': info_inimigo
        }
        return Response(data)

    def patch(self, request, format=None):
        usuario = request.user
        novos_gostos = request.data.get('gostos_pessoais')

        try:
            participante = Participante.objects.get(usuario=usuario, grupo__nome="Amigo Secreto 2025")
            participante.gostos_pessoais = novos_gostos
            participante.save()
            return Response({'status': 'gostos atualizados com sucesso'})
        except Participante.DoesNotExist:
            return Response({'erro': 'Participante não encontrado'}, status=404)