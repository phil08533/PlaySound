# Shared album art

Add your simple `.png`, `.jpg`, `.jpeg`, or `.webp` pictures to this folder. Then list each image in `album-art.json` from the project root, for example:

```json
[
  "assets/album-art/sunshine.png",
  "assets/album-art/blue-sky.jpg"
]
```

Any track without its own matching artwork will be given one of these images at random. Tracks with their own artwork keep it.
