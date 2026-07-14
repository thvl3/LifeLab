# LifeLab

## Demo

[![Watch the LifeLab demo](https://img.youtube.com/vi/hUOMykWk9b8/maxresdefault.jpg)](https://youtu.be/hUOMykWk9b8)

## Overview

LifeLab is a Django web app for experimenting with Conway's Game of Life and related cellular automata rules. Users can draw patterns on a grid, switch rulesets, adjust birth and survival conditions, run the simulation, and save custom patterns to a SQLite database.

The app fulfills the Web Apps module requirements with:

- Django server-rendered pages.
- User input through grid editing, ruleset controls, pattern stamping, and saved pattern forms.
- Three dynamic pages: simulator, pattern library, and saved pattern detail.
- SQLite database integration for saved patterns as the stretch challenge.

## Development Environment

- Python 3.13
- Django 6
- SQLite
- HTML canvas, CSS, JavaScript, and Django templates

## How to Run

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py runserver
```

Open `http://127.0.0.1:8000/` in a browser.

## Useful Websites

- [Django Documentation](https://docs.djangoproject.com/)
- [Django Tutorial](https://docs.djangoproject.com/en/stable/intro/tutorial01/)
- [Conway's Game of Life](https://conwaylife.com/wiki/Conway%27s_Game_of_Life)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## Future Work

- Add import/export for Life 1.06 or RLE pattern files.
- Add pattern search by population, ruleset, or date.
- Add shareable URLs that encode an unsaved grid state.
- Add user accounts for private pattern libraries.
