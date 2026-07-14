from django.db import models


class SavedPattern(models.Model):
    name = models.CharField(max_length=120)
    rule_string = models.CharField(max_length=24, default="B3/S23")
    rows = models.PositiveIntegerField(default=36)
    columns = models.PositiveIntegerField(default=48)
    cells = models.JSONField(default=list)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at", "name"]

    def __str__(self):
        return self.name
