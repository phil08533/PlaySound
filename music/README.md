# PlaySound music

Add your music here. The app discovers audio automatically when GitHub Actions deploys.

Use this pattern:

`music/<category>/<theme>/<song-name>.mp3`

Optional matching artwork:

`music/<category>/<theme>/<song-name>.jpg`

Supported audio: `.mp3`, `.m4a`, `.ogg`, `.wav`, `.aac`, `.flac`

Supported artwork: `.jpg`, `.jpeg`, `.png`, `.webp`

Example:

`music/play/pirates/treasure-hunt.mp3`
`music/play/pirates/treasure-hunt.jpg`

The filename becomes the song title. No code changes are needed. Push the files and the deployment workflow rebuilds the music manifest automatically.

## Categories and themes

- `play`: `pirates`, `medieval`, `space`, `cowboy`, `princess`, `dinosaurs`, `fantasy`, `adventure`, `underwater`, `safari`
- `chores`: `classical`, `upbeat`, `funky`, `sing-along`, `energetic`
- `sleep`: `lullabies`, `classical`, `rain`, `ocean`, `calm`, `ambient`
- `car-ride`: `kids`, `upbeat`, `sing-along`, `family`, `calm`
- `quiet-time`: `classical`, `ambient`, `piano`, `nature`, `gentle-kids`
- `creative-time`: `instrumental`, `piano`, `ambient`, `adventure`
- `outside`: `upbeat`, `adventure`, `nature`, `kids`
- `mealtime`: `family`, `kids`, `calm`, `sing-along`
- `party`: `upbeat`, `kids`, `sing-along`, `funky`
- `calm-down`: `calm`, `piano`, `rain`, `ocean`, `ambient`
