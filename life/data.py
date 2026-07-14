"""Preset rules and patterns displayed by the simulator."""

RULESETS = [
    {
        "name": "Conway Classic",
        "rule": "B3/S23",
        "birth": [3],
        "survival": [2, 3],
        "description": "Balanced gliders, blinkers, still lifes, and emergent movement.",
    },
    {
        "name": "HighLife",
        "rule": "B36/S23",
        "birth": [3, 6],
        "survival": [2, 3],
        "description": "Like Conway with extra replication behavior.",
    },
    {
        "name": "Seeds",
        "rule": "B2/S",
        "birth": [2],
        "survival": [],
        "description": "Every live cell dies each generation, creating explosive growth.",
    },
    {
        "name": "Day and Night",
        "rule": "B3678/S34678",
        "birth": [3, 6, 7, 8],
        "survival": [3, 4, 6, 7, 8],
        "description": "A high-density rule that treats life and emptiness symmetrically.",
    },
    {
        "name": "Maze",
        "rule": "B3/S12345",
        "birth": [3],
        "survival": [1, 2, 3, 4, 5],
        "description": "Produces long maze-like corridors and stable walls.",
    },
]


PATTERNS = [
    {
        "name": "Glider",
        "rule": "B3/S23",
        "cells": [[1, 2], [2, 3], [3, 1], [3, 2], [3, 3]],
    },
    {
        "name": "Lightweight Spaceship",
        "rule": "B3/S23",
        "cells": [[1, 2], [1, 5], [2, 1], [3, 1], [3, 5], [4, 1], [4, 2], [4, 3], [4, 4]],
    },
    {
        "name": "Pulsar",
        "rule": "B3/S23",
        "cells": [
            [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
            [4, 2], [4, 7], [4, 9], [4, 14],
            [5, 2], [5, 7], [5, 9], [5, 14],
            [6, 2], [6, 7], [6, 9], [6, 14],
            [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
            [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
            [10, 2], [10, 7], [10, 9], [10, 14],
            [11, 2], [11, 7], [11, 9], [11, 14],
            [12, 2], [12, 7], [12, 9], [12, 14],
            [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12],
        ],
    },
    {
        "name": "Replicator Seed",
        "rule": "B36/S23",
        "cells": [[1, 2], [1, 3], [1, 4], [2, 1], [2, 4], [3, 4]],
    },
    {
        "name": "Maze Starter",
        "rule": "B3/S12345",
        "cells": [[1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 4], [3, 5], [4, 5], [5, 5], [5, 6]],
    },
]


def parse_rule(rule_string):
    cleaned = rule_string.upper().replace(" ", "")
    birth_part = ""
    survival_part = ""
    for part in cleaned.split("/"):
        if part.startswith("B"):
            birth_part = part[1:]
        if part.startswith("S"):
            survival_part = part[1:]
    return {
        "birth": [int(value) for value in birth_part if value.isdigit()],
        "survival": [int(value) for value in survival_part if value.isdigit()],
    }
