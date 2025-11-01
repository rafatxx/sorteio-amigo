from django.contrib import admin
from django.db import transaction
from django.contrib import messages
import random
from .models import Grupo, Participante, Exclusao, Resultado
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

@admin.action(description="Realizar sorteio (Amigo e Inimigo) para os grupos selecionados")
def realizar_sorteio(modeladmin, request, queryset):
    for grupo in queryset:
        participantes_users = list(grupo.participantes.all())
        n = len(participantes_users)

        if n < 2:
            modeladmin.message_user(request, f"O grupo '{grupo.nome}' precisa de pelo menos 2 participantes para o sorteio.", messages.ERROR)
            continue

        try:
            with transaction.atomic():
                Resultado.objects.filter(grupo=grupo).delete()

                lista_amigo = list(participantes_users)
                sorteio_amigo_ok = False
                pares_amigo = {}

                for _ in range(10): 
                    random.shuffle(lista_amigo)
                    valido = True
                    for i in range(n):
                        doador = lista_amigo[i]
                        receptor = lista_amigo[(i + 1) % n]
                        if Exclusao.objects.filter(grupo=grupo, doador=doador, excluido=receptor, tipo_sorteio='amigo').exists():
                            valido = False
                            break
                    if valido:
                        for i in range(n):
                            pares_amigo[lista_amigo[i]] = lista_amigo[(i + 1) % n]
                        sorteio_amigo_ok = True
                        break
                if not sorteio_amigo_ok:
                    raise Exception(f"Não foi possível gerar o sorteio de AMIGOS para '{grupo.nome}'. Verifique suas 'Exclusões'.")

                lista_inimigo = list(participantes_users)
                sorteio_inimigo_ok = False
                pares_inimigo = {}

                for _ in range(10):
                    random.shuffle(lista_inimigo)
                    valido = True
                    for i in range(n):
                        doador = lista_inimigo[i]
                        receptor = lista_inimigo[(i + 1) % n]
                        if receptor == pares_amigo[doador] or \
                           Exclusao.objects.filter(grupo=grupo, doador=doador, excluido=receptor, tipo_sorteio='inimigo').exists():
                            valido = False
                            break
                    if valido:
                        for i in range(n):
                            pares_inimigo[lista_inimigo[i]] = lista_inimigo[(i + 1) % n]
                        sorteio_inimigo_ok = True
                        break
                if not sorteio_inimigo_ok:
                    raise Exception(f"Não foi possível gerar o sorteio de INIMIGOS para '{grupo.nome}'. Verifique suas regras.")

                for doador, receptor in pares_amigo.items():
                    Resultado.objects.create(grupo=grupo, doador=doador, receptor=receptor, tipo_sorteio='amigo')
                for doador, receptor in pares_inimigo.items():
                    Resultado.objects.create(grupo=grupo, doador=doador, receptor=receptor, tipo_sorteio='inimigo')

            modeladmin.message_user(request, f"Sorteio para o grupo '{grupo.nome}' foi realizado com sucesso!", messages.SUCCESS)
        except Exception as e:
            modeladmin.message_user(request, str(e), messages.ERROR)

class ParticipanteInline(admin.TabularInline):
    model = Participante 
    extra = 1
    fields = ('usuario', 'genero', 'photo_url', 'gostos_pessoais')
    autocomplete_fields = ('usuario',)
    verbose_name = "Participante"
    verbose_name_plural = "Participantes"

class GrupoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'criado_em')
    actions = [realizar_sorteio]
    inlines = [ParticipanteInline]
    exclude = ('participantes',)
    search_fields = ['nome']

class ParticipanteAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'grupo', 'genero')
    list_filter = ('grupo', 'genero')
    autocomplete_fields = ('usuario', 'grupo')

class UserAdmin(BaseUserAdmin):
    search_fields = ('username', 'first_name', 'last_name', 'email')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Grupo, GrupoAdmin)
admin.site.register(Participante, ParticipanteAdmin)
admin.site.register(Resultado)
admin.site.register(Exclusao)