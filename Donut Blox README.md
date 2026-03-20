# Donut Blox

A Sisense Blox widget that displays vessel health scores as animated donut (ring) charts in a carousel.

## Overview

Each slide in the carousel shows a single vessel with:
- A circular progress ring colored by health score
- The vessel name
- A status label (Good / Fair / Critical)
- A color legend

## Score Thresholds

| Status   | Range  | Color     |
|----------|--------|-----------|
| Good     | 80–100 | `#1D9E75` |
| Fair     | 60–79  | `#EF9F27` |
| Critical | < 60   | `#E24B4A` |

## Panel Fields

| Field           | Description                           |
|-----------------|---------------------------------------|
| `{panel:Count}` | Health score (0–1 or 0–100)          |
| `{panel:Name}`  | Vessel name displayed below the ring  |

The widget accepts scores as either a decimal (e.g. `0.85`) or a percentage (e.g. `85`).

## How It Works

1. The widget renders a carousel (`showCarousel: true`) with one slide per data row.
2. On load, a `setTimeout` (600ms) runs JavaScript that:
   - Reads the hidden score value from `.score-hidden`
   - Normalizes it to a 0–100 percentage
   - Calculates the SVG `stroke-dashoffset` to fill the ring proportionally
   - Applies the appropriate color to the ring, percentage text, and status label

## Files

| File        | Description             |
|-------------|-------------------------|
| `Donut Blox` | Blox widget JSON config |

## Usage

1. In Sisense, create a new Blox widget.
2. Paste the contents of `Donut Blox` into the widget editor.
3. Bind your data source with `Count` (health score) and `Name` (vessel name) fields.
