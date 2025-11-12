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
        try:
            participantes_amigo = list(Participante.objects.filter(grupo=grupo, participa_amigo=True))
            participantes_inimigo = list(Participante.objects.filter(grupo=grupo, participa_inimigo=True))
            
            users_amigo = [p.usuario for p in participantes_amigo]
            users_inimigo = [p.usuario for p in participantes_inimigo]

            n_amigo = len(users_amigo)
            n_inimigo = len(users_inimigo)

            if n_amigo < 2:
                raise Exception(f"O sorteio de AMIGO para '{grupo.nome}' precisa de pelo menos 2 participantes.")
            if n_inimigo == 1:
                raise Exception(f"O sorteio de INIMIGO para '{grupo.nome}' tem apenas 1 participante e não pode ser realizado.")

            with transaction.atomic():
                Resultado.objects.filter(grupo=grupo).delete()

                lista_doadores_amigo = list(users_amigo)
                lista_receptores_amigo = list(users_amigo)
                sorteio_amigo_ok = False
                pares_amigo = {}

                for _ in range(100):
                    random.shuffle(lista_receptores_amigo)
                    pares_tentativa = {}
                    valido = True
                    
                    for i in range(n_amigo):
                        doador = lista_doadores_amigo[i]
                        receptor = lista_receptores_amigo[i]

                        if doador == receptor:
                            valido = False
                            break
                        
                        if Exclusao.objects.filter(grupo=grupo, doador=doador, excluido=receptor, tipo_sorteio='amigo').exists():
                            valido = False
                            break
                        
                        pares_tentativa[doador] = receptor

                    if valido:
                        pares_amigo = pares_tentativa
                        sorteio_amigo_ok = True
                        break
                
                if not sorteio_amigo_ok:
                    raise Exception(f"Não foi possível gerar o sorteio de AMIGOS para '{grupo.nome}' após 10.000 tentativas. Suas regras de exclusão podem ser matematicamente impossíveis de resolver.")

                pares_inimigo = {}
                if n_inimigo >= 2:
                    lista_doadores_inimigo = list(users_inimigo)
                    lista_receptores_inimigo = list(users_inimigo)
                    sorteio_inimigo_ok = False

                    for _ in range(100):
                        random.shuffle(lista_receptores_inimigo)
                        pares_tentativa = {}
                        valido = True

                        for i in range(n_inimigo):
                            doador = lista_doadores_inimigo[i]
                            receptor = lista_receptores_inimigo[i]

                            if doador == receptor:
                                valido = False
                                break
                            
                            if Exclusao.objects.filter(grupo=grupo, doador=doador, excluido=receptor, tipo_sorteio='inimigo').exists():
                                valido = False
                                break
                            
                            pares_tentativa[doador] = receptor
                        
                        if valido:
                            pares_inimigo = pares_tentativa
                            sorteio_inimigo_ok = True
                            break

                    if not sorteio_inimigo_ok:
                         raise Exception(f"Não foi possível gerar o sorteio de INIMIGOS para '{grupo.nome}' após 10.000 tentativas. Suas regras de exclusão (que são muitas!) podem ser matematicamente impossíveis de resolver.")

                for doador, receptor in pares_amigo.items():
                    Resultado.objects.create(grupo=grupo, doador=doador, receptor=receptor, tipo_sorteio='amigo')
                
                for doador, receptor in pares_inimigo.items():
                    Resultado.objects.create(grupo=grupo, doador=doador, receptor=receptor, tipo_sorteio='inimigo')

            modeladmin.message_user(request, f"Sorteio de AMIGO para '{grupo.nome}' (com {n_amigo} participantes) foi realizado com sucesso!", messages.SUCCESS)
            if n_inimigo >= 2:
                modeladmin.message_user(request, f"Sorteio de INIMIGO para '{grupo.nome}' (com {n_inimigo} participantes) foi realizado com sucesso!", messages.SUCCESS)
            elif n_inimigo == 0:
                modeladmin.message_user(request, f"Sorteio de INIMIGO para '{grupo.nome}' foi pulado (0 participantes).", messages.INFO)

        except Exception as e:
            modeladmin.message_user(request, str(e), messages.ERROR)

class ParticipanteInline(admin.TabularInline):
    model = Participante 
    extra = 1
    fields = ('usuario', 'genero', 'photo_url', 'participa_amigo', 'participa_inimigo', 'gostos_pessoais')
    autocomplete_fields = ('usuario',)
    verbose_name = "Participante"
    verbose_name_plural = "Participantes"
    search_fields = ('usuario__username', 'usuario__first_name', 'usuario__last_name')

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

class ResultadoAdmin(admin.ModelAdmin):
    list_display = ('grupo', 'doador', 'receptor', 'tipo_sorteio')
    list_filter = ('grupo', 'tipo_sorteio')
    autocomplete_fields = ('grupo', 'doador', 'receptor')

class ExclusaoAdmin(admin.ModelAdmin):
    list_display = ('grupo', 'doador', 'excluido', 'tipo_sorteio')
    list_filter = ('grupo', 'tipo_sorteio')
    autocomplete_fields = ('grupo', 'doador', 'excluido')

admin.site.register(Grupo, GrupoAdmin)
admin.site.register(Participante, ParticipanteAdmin)
admin.site.register(Resultado, ResultadoAdmin)
admin.site.register(Exclusao, ExclusaoAdmin)