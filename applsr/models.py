from django.db import models


class Masterword(models.Model):
    name = models.CharField(max_length=255)
    info = models.CharField(max_length=255)

    def __str__(self):
        return '{}={}'.format(self.name, self.info)


class Character(models.Model):
    name = models.CharField(max_length=255)
    element = models.CharField(max_length=255, default="aucun")
    chair = models.IntegerField(default=2)
    esprit = models.IntegerField(default=2)
    essence = models.IntegerField(default=2)
    point_de_vie = models.IntegerField(default=4)
    point_de_vie_max = models.IntegerField(default=4)
    point_de_focus = models.IntegerField(default=4)
    point_de_focus_max = models.IntegerField(default=4)
    point_de_pouvoir = models.IntegerField(default=4)
    point_de_pouvoir_max = models.IntegerField(default=4)
    dettes = models.IntegerField(default=0)
    arcanes = models.IntegerField(default=3)
    arcanes_max = models.IntegerField(default=3)
    niveau = models.IntegerField(default=1)
    fl = models.CharField(max_length=255, default="")
    fu = models.CharField(max_length=255, default="")
    fs = models.CharField(max_length=255, default="")

    def __str__(self):
        return '{}-{} niv. {} ({}-{}-{}) - pv= {}/{} - pf= {}/{} - pp= {}/{} - dettes = {} - arcanes = {}/{}'.format(self.name,
                                                                                                             self.element,
                                                                                                             self.niveau,
                                                                                                             self.chair,
                                                                                                             self.esprit,
                                                                                                             self.essence,
                                                                                                             self.point_de_vie,
                                                                                                             self.point_de_vie_max,
                                                                                                             self.point_de_focus,
                                                                                                             self.point_de_focus_max,
                                                                                                             self.point_de_pouvoir,
                                                                                                             self.point_de_pouvoir_max,
                                                                                                             self.dettes,
                                                                                                             self.arcanes,
                                                                                                             self.arcanes_max)


class DiceRoll(models.Model):
    date = models.DateTimeField(auto_now=True)
    dices = models.CharField(max_length=255)
    secret = models.BooleanField(default=False)
    lancer = models.CharField(max_length=255, default="no one")

    malediction_count = models.IntegerField(default=0)
    benediction_count = models.IntegerField(default=0)
    dice_results = models.CharField(default="", max_length=255)
    pp = models.BooleanField(default=False)
    pf = models.BooleanField(default=False)
    roll_type = models.CharField(default="", max_length=32)
    parent_roll = models.ForeignKey('self', on_delete=models.CASCADE, null=True)


class Viking(models.Model):
    joueur = models.CharField(max_length=255, default="personne")
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    agriculture = models.IntegerField(default=2)
    charisme = models.IntegerField(default=2)
    combat = models.IntegerField(default=2)
    magie = models.IntegerField(default=2)
    savoir = models.IntegerField(default=2)
    navigation = models.IntegerField(default=2)
    nature = models.IntegerField(default=2)
    point_de_vie = models.IntegerField(default=4)
    point_de_vie_max = models.IntegerField(default=4)
    point_de_pouvoir = models.IntegerField(default=4)
