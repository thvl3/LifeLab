import json

from django.test import TestCase
from django.urls import reverse

from .data import parse_rule
from .models import SavedPattern


class RuleTests(TestCase):
    def test_parse_rule_extracts_birth_and_survival_values(self):
        self.assertEqual(parse_rule("B36/S23"), {"birth": [3, 6], "survival": [2, 3]})


class LifeViewsTests(TestCase):
    def test_simulator_renders_server_provided_rulesets(self):
        response = self.client.get(reverse("simulator"))

        self.assertContains(response, "LifeLab")
        self.assertContains(response, "Conway Classic")
        self.assertContains(response, "Glider")

    def test_user_can_save_pattern_to_database(self):
        response = self.client.post(
            reverse("simulator"),
            {
                "name": "Tiny Oscillator",
                "rule_string": "B3/S23",
                "rows": 36,
                "columns": 48,
                "notes": "Three-cell blinker.",
                "cells_payload": json.dumps([[18, 22], [18, 23], [18, 24]]),
            },
        )

        pattern = SavedPattern.objects.get(name="Tiny Oscillator")
        self.assertRedirects(response, reverse("pattern_detail", args=[pattern.pk]))
        self.assertEqual(pattern.cells, [[18, 22], [18, 23], [18, 24]])

    def test_library_lists_saved_patterns(self):
        SavedPattern.objects.create(
            name="Block",
            rule_string="B3/S23",
            cells=[[1, 1], [1, 2], [2, 1], [2, 2]],
        )

        response = self.client.get(reverse("library"))

        self.assertContains(response, "Pattern database")
        self.assertContains(response, "Block")
