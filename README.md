# LifeLab

## Overview

LifeLab is a Django web app for experimenting with Conway's Game of Life and related cellular automata rules. It combines server-rendered pages with a JavaScript canvas simulator so users can draw cells, run generations, change rules, and save patterns for later use.

This project was completed for CSE 310 Module 6: Web Apps. The public source code is available at [github.com/thvl3/LifeLab](https://github.com/thvl3/LifeLab).

## Software Demo Video

[![Watch the LifeLab demo](https://img.youtube.com/vi/hUOMykWk9b8/maxresdefault.jpg)](https://youtu.be/hUOMykWk9b8)

Direct video link: [https://youtu.be/hUOMykWk9b8](https://youtu.be/hUOMykWk9b8)

## Web App Features

- The simulator page is populated by Django with preset rulesets, starter patterns, and saved patterns from the database.
- The interactive canvas accepts pointer input for drawing and erasing live cells.
- Play, pause, step, clear, randomize, speed, and brush controls update the simulation in the browser.
- A ruleset builder lets users choose birth and survival neighbor counts and preview the resulting rule string.
- Users can save a named pattern with its rule, grid, live cells, and notes.
- The library page lists saved patterns, and the detail page shows database-backed pattern information and a canvas preview.

The project completes the Web Apps requirements with three dynamically generated HTML pages, user-driven interactions, and the SQLite stretch challenge.

## How to Run

1. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install the dependencies and prepare the database:

   ```bash
   python -m pip install -r requirements.txt
   python manage.py migrate
   ```

3. Start Django's local development server:

   ```bash
   python manage.py runserver
   ```

4. Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in a browser.

Run the automated checks with:

```bash
python manage.py test
```

## Configuration

The development defaults are safe for local use. For a deployed environment, set these environment variables instead of using the defaults:

- `DJANGO_SECRET_KEY`: a unique secret key used by Django.
- `DJANGO_DEBUG`: set to `False` outside local development.
- `DJANGO_ALLOWED_HOSTS`: a comma-separated list such as `example.com,www.example.com`.

The app uses SQLite by default and stores saved patterns in `db.sqlite3`. Django migrations create the database schema.

## Development Environment

- Python 3.13
- Django 6.0
- SQLite
- HTML canvas, CSS, JavaScript, and Django templates

## Project Structure

- `life/views.py` prepares page data and handles pattern-saving requests.
- `life/models.py` defines the database-backed saved pattern.
- `life/forms.py` validates the JSON payload sent by the simulator.
- `life/templates/life/` contains the three server-rendered pages and shared layout.
- `life/static/life/simulator.js` runs the interactive cellular automaton.
- `life/static/life/preview.js` renders a saved pattern on its detail page.
- `life/migrations/` contains the database schema migration.

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
