# PlaySound

A calm, simple music PWA for everyday moments: play, chores, sleep, car rides, quiet time, creative time, outside, mealtime, parties, and calming down.

## Add music

You do not edit the app to add songs. Put an audio file into the matching category/theme folder under `music/` and optionally add artwork with the same filename.

```text
music/
└── play/
    └── pirates/
        ├── treasure-hunt.mp3
        └── treasure-hunt.jpg
```

The GitHub Actions deployment scans the folders and generates `tracks.json` automatically.

## Run locally

Serve the repository over HTTP rather than opening `index.html` directly so the PWA service worker can work:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**. After that, pushes to `main` automatically deploy the app.
