"""Validation for patterns submitted by the browser-based simulator."""

import json

from django import forms

from .models import SavedPattern


class SavedPatternForm(forms.ModelForm):
    cells_payload = forms.CharField(widget=forms.HiddenInput)

    class Meta:
        model = SavedPattern
        fields = ["name", "rule_string", "rows", "columns", "notes"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Pattern name"}),
            "rule_string": forms.HiddenInput(),
            "rows": forms.HiddenInput(),
            "columns": forms.HiddenInput(),
            "notes": forms.Textarea(attrs={"rows": 3, "placeholder": "Optional notes"}),
        }

    def clean_cells_payload(self):
        # The canvas serializes live cells as [row, column] pairs. Validate the
        # shape and size before storing the client-provided JSON in SQLite.
        payload = self.cleaned_data["cells_payload"]
        try:
            cells = json.loads(payload)
        except json.JSONDecodeError as exc:
            raise forms.ValidationError("Pattern cells were not valid JSON.") from exc

        if not isinstance(cells, list):
            raise forms.ValidationError("Pattern cells must be a list.")

        clean_cells = []
        for cell in cells:
            if (
                not isinstance(cell, list)
                or len(cell) != 2
                or not all(isinstance(value, int) for value in cell)
            ):
                raise forms.ValidationError("Each live cell must be a row and column pair.")
            clean_cells.append(cell)

        if len(clean_cells) > 2500:
            raise forms.ValidationError("Patterns are limited to 2,500 live cells.")

        return clean_cells

    def save(self, commit=True):
        pattern = super().save(commit=False)
        pattern.cells = self.cleaned_data["cells_payload"]
        if commit:
            pattern.save()
        return pattern
