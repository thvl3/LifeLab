"""Page views for the LifeLab simulator and saved-pattern library."""

from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .data import PATTERNS, RULESETS, parse_rule
from .forms import SavedPatternForm
from .models import SavedPattern


def simulator(request):
    # The page receives both starter data and database data so the browser can
    # offer one consistent pattern picker without making extra API requests.
    form = SavedPatternForm()
    if request.method == "POST":
        form = SavedPatternForm(request.POST)
        if form.is_valid():
            pattern = form.save()
            return redirect("pattern_detail", pk=pattern.pk)

    selected_pattern = None
    pattern_id = request.GET.get("pattern")
    if pattern_id:
        selected_pattern = get_object_or_404(SavedPattern, pk=pattern_id)

    context = {
        "form": form,
        "rulesets": RULESETS,
        "preset_patterns": PATTERNS,
        "saved_patterns": _saved_pattern_payloads(),
        "selected_pattern": _pattern_payload(selected_pattern) if selected_pattern else None,
    }
    return render(request, "life/simulator.html", context)


def library(request):
    patterns = SavedPattern.objects.all()
    context = {
        "patterns": patterns,
        "pattern_count": patterns.count(),
        "rulesets": RULESETS,
    }
    return render(request, "life/library.html", context)


def pattern_detail(request, pk):
    pattern = get_object_or_404(SavedPattern, pk=pk)
    context = {
        "pattern": pattern,
        "pattern_payload": _pattern_payload(pattern),
        "rule_parts": parse_rule(pattern.rule_string),
    }
    return render(request, "life/pattern_detail.html", context)


def _saved_pattern_payloads():
    # Keep the simulator responsive by limiting the initial database payload.
    return [_pattern_payload(pattern) for pattern in SavedPattern.objects.all()[:50]]


def _pattern_payload(pattern):
    return {
        "id": pattern.pk,
        "name": pattern.name,
        "rule": pattern.rule_string,
        "rows": pattern.rows,
        "columns": pattern.columns,
        "cells": pattern.cells,
        "notes": pattern.notes,
    }
