"""LesSeptRois URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from applsr import views as applsr_views

urlpatterns = [
    path('viking/<str:nom>', applsr_views.viking, name='viking'),
    path('mj/updateviking/<str:nom>/<str:agriculture>/<str:charisme>/<str:combat>/<str:magie>/<str:savoir>/<str:navigation>/<str:nature>/<str:point_de_vie_max>', applsr_views.updateviking),
    path('mj/newviking/<str:joueur>/<str:nom>/<str:role>/<str:agriculture>/<str:charisme>/<str:combat>/<str:magie>/<str:savoir>/<str:navigation>/<str:nature>/<str:point_de_vie_max>', applsr_views.newviking),
    path('vik/getcar/<str:nom>', applsr_views.getvik, name='getcar'),
    path('vik/getcar2/<str:joueur>', applsr_views.getvik2, name='getcar'),
    path('mj_interdit_aux_joueurs/modifs_valeurs_viking/<str:nom>/<str:stat>/<int:valeur>/<str:add>',
         applsr_views.modifs_valeurs_viking, name='modifs_valeurs'),
    path('mj_interdit_aux_joueurs/modifs_valeurs_viking2/<str:nom>/<str:stat>/<int:valeur>/<str:add>',
         applsr_views.modifs_valeurs_viking2, name='modifs_valeurs'),
    path('lancer_viking/<str:nom>/<str:action>/<int:malus>/<int:bonus>', applsr_views.lancer_viking),
    path('lancer_viking_duel/<str:nom>', applsr_views.lancer_viking_duel),
    path('mj_viking/', applsr_views.mj_viking),

    path('masterwords_init', applsr_views.initmw),
    path('masterwords/<str:role>', applsr_views.masterwords),
    path('masterwords_affichermw/', applsr_views.afficher_mw),
    path('masterwords_enregistrer/<str:_name>/<str:_info>/', applsr_views.enregistrer),

    path('admin/', admin.site.urls),
    path('mj_interdit_aux_joueurs/', applsr_views.mj),
    path('lsr/', applsr_views.list_characters),
    path('lsr/<str:nom>', applsr_views.lsr, name='lsr'),
    path('privacy', applsr_views.privacy),
    path('afficher/<str:nom>/<str:secret>', applsr_views.afficher),
    path('mj_interdit_aux_joueurs/effacerLancersDes', applsr_views.effacer_lancers_des),
    path('lsr/getcar/<str:nom>', applsr_views.getcar, name='getcar'),
    path('mj_interdit_aux_joueurs/modifs_valeurs/<str:nom>/<str:stat>/<str:valeur>/<str:add>', applsr_views.modifs_valeurs, name='modifs_valeurs'),
    path('lancer/<str:nom>/<str:action>/<str:pf>/<str:pp>/<str:ra>/<int:mal>/<int:ben>/<str:secret>/<str:des_caches>', applsr_views.lancer),
    path('lancer_empirique/<str:nom>/<str:valeur>/<str:secret>/', applsr_views.lancer_empirique),
    path('mj/lancer_pnj/<str:nom>/<str:action>/<int:stat>/<str:pf>/<str:pp>/<str:ra>/<int:mal>/<int:ben>/<str:secret>/<str:des_caches>/<int:opposition>', applsr_views.lancer_pnj),
    path('mj/lancer_pnj2/<str:nom>/<str:action>/<int:stat>/<str:pf>/<str:pp>/<str:ra>/<int:mal>/<int:ben>/<str:secret>/<str:des_caches>/<int:val_cin>/<str:max>', applsr_views.lancer_pnj_cine),
    path('mj/updatepj/<str:nom>/<str:chair>/<str:esprit>/<str:essence>/<str:point_de_vie_max>/<str:point_de_focus_max>/<str:point_de_pouvoir_max>/<str:niveau>', applsr_views.updatepj),
    path('mj/updatepj/<str:nom>/<str:chair>/<str:esprit>/<str:essence>/<str:point_de_vie_max>/<str:point_de_focus_max>/<str:point_de_pouvoir_max>/<str:niveau>', applsr_views.updatepj),
    path('mj_interdit_aux_joueurs/createcharacter/<str:name>/<int:flesh>/<int:spirit>/<int:essence>/<int:hp>/<int:hp_max>/<int:focus>/<int:focus_max>/<int:power>/<int:power_max>/<int:level>/<int:arcana>/<int:arcana_max>/<int:debt>/<str:title>/<str:lux>/<str:secunda>/<str:umbra>/<str:proficiency1>/<str:proficiency2>/<str:hidden>/<str:category>', applsr_views.create_character),
    path('mj_interdit_aux_joueurs/deletecharacter/', applsr_views.delete_character),
]
