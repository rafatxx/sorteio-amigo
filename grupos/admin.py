from django.contrib import admin
from .models import Grupo, Participante, Exclusao, Resultado

admin.site.register(Grupo)
admin.site.register(Participante)
admin.site.register(Exclusao)
admin.site.register(Resultado)