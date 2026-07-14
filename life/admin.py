from django.contrib import admin

from .models import SavedPattern


@admin.register(SavedPattern)
class SavedPatternAdmin(admin.ModelAdmin):
    list_display = ("name", "rule_string", "rows", "columns", "created_at")
    search_fields = ("name", "notes", "rule_string")
