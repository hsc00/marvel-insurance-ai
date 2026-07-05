# Backend Tooling and Config

## Dependency Management

Poetry is the primary backend dependency manager. `server/requirements.txt` is kept in sync with `pyproject.toml` for reviewers who prefer `pip`.

## Linting and Formatting

Ruff configured in `server/pyproject.toml`. Pre-commit hook runs `ruff check .` then `ruff format .` then `pytest` whenever `server/` files are staged.

## Sort Control

Replaced the Priority filter with a Sort control. Backend now sorts deterministically by `updated_at`, `confidence`, `claimant_name`, or `status`. Frontend types and `FilterBar` were updated accordingly. Priority query parameter is still accepted for backward compatibility.

## Config

Moved `.env` loading and CORS route constants into `server/src/config.py`. `find_dotenv(filename='.env', usecwd=False)` loads the repo-root `.env` regardless of CWD.
