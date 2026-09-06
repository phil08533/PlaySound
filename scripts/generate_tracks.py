#!/usr/bin/env python3
"""Build tracks.json from the music/ folder.

Drop an audio file and optional same-named artwork into music/category/theme/.
No code or manifest editing is required.
"""
from pathlib import Path
import json,re

ROOT=Path(__file__).resolve().parents[1]
MUSIC=ROOT/'music'
OUT=ROOT/'tracks.json'
AUDIO={'.mp3','.m4a','.ogg','.wav','.aac','.flac'}
ART={'.jpg','.jpeg','.png','.webp'}

def title_from_filename(path):
    name=re.sub(r'\s*\([^)]*\)$','',path.stem)
    name=name.replace('_',' ').replace('-',' ')
    return re.sub(r'\s+',' ',name).strip().title()

def main():
    tracks=[]
    if MUSIC.exists():
        for audio in sorted(MUSIC.rglob('*')):
            if not audio.is_file() or audio.suffix.lower() not in AUDIO: continue
            rel=audio.relative_to(MUSIC)
            parts=rel.parts
            category=parts[0] if len(parts)>1 else 'uncategorized'
            theme=parts[1] if len(parts)>2 else 'general'
            artwork=None
            for ext in ART:
                candidate=audio.with_suffix(ext)
                if candidate.exists():
                    artwork=candidate.relative_to(ROOT).as_posix()
                    break
            audio_path=audio.relative_to(ROOT).as_posix()
            tracks.append({
                'id':audio_path,
                'title':title_from_filename(audio),
                'category':category,
                'theme':theme,
                'audio':audio_path,
                'artwork':artwork,
            })
    OUT.write_text(json.dumps(tracks,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'Generated {OUT} with {len(tracks)} track(s).')

if __name__=='__main__': main()
