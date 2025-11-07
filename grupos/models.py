from django.db import models
from django.contrib.auth.models import User

TIPO_SORTEIO_CHOICES = [
    ('amigo', 'Amigo Secreto'),
    ('inimigo', 'Inimigo Secreto'),
]

class Grupo(models.Model):
    nome = models.CharField(max_length=100)
    participantes = models.ManyToManyField(User, through='Participante', related_name='grupos_participando')
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Participante(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    gostos_pessoais = models.TextField(blank=True, null=True, help_text="Escreva aqui seus gostos e sugestões de presente.")
    
    GENDER_CHOICES = [
        ('Masculino', 'Masculino'),
        ('Feminino', 'Feminino'),
    ]
    
    genero = models.CharField(
        max_length=10, 
        choices=GENDER_CHOICES, 
        blank=True, 
        null=True,
        verbose_name="Gênero"
    )
    
    photo_url = models.URLField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name="URL da Foto"
    )

    participa_amigo = models.BooleanField(
        default=True,
        verbose_name="Participa do Amigo Secreto?"
    )
    participa_inimigo = models.BooleanField(
        default=True,
        verbose_name="Participa do Inimigo Secreto?"
    )

    class Meta:
        unique_together = ('usuario', 'grupo')

    def __str__(self):
        return f"{self.usuario.username} no grupo {self.grupo.nome}"
    
class Exclusao(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    doador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exclusoes_feitas')
    excluido = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exclusoes_recebidas')
    tipo_sorteio = models.CharField(max_length=10, choices=TIPO_SORTEIO_CHOICES)

    class Meta:
        verbose_name = "Exclusão"
        verbose_name_plural = "Exclusões"
        unique_together = ('grupo', 'doador', 'excluido', 'tipo_sorteio')

    def __str__(self):
        return f"{self.doador.username} NÃO PODE tirar {self.excluido.username} no {self.get_tipo_sorteio_display()}"

class Resultado(models.Model):
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    doador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='presentes_dados')
    receptor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='presentes_recebidos')
    tipo_sorteio = models.CharField(max_length=10, choices=TIPO_SORTEIO_CHOICES)

    class Meta:
        unique_together = ('grupo', 'doador', 'tipo_sorteio')

    def __str__(self):
        return f"[{self.get_tipo_sorteio_display()}] {self.doador.username} -> {self.receptor.username}"