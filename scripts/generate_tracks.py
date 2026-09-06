#!/usr/bin/env python3
"""Build track manifests from the music/ folder.

Drop an audio file and optional same-named artwork into music/category/theme/.
Featured music is managed separately in music/featured/.
"""
from pathlib import Path
import json,re

ROOT=Path(__file__).resolve().parents[1]
MUSIC=ROOT/'music'
OUT=ROOT/'tracks.json'
FEATURED_OUT=ROOT/'featured.json'
AUDIO={'.mp3','.m4a','.ogg','.wav','.aac','.flac'}
ART={'.jpg','.jpeg','.png','.webp'}

def title_from_filename(path):
    name=re.sub(r'\s*\([^)]*\)$','',path.stem)
    name=name.replace('_',' ').replace('-',' ')
    return re.sub(r'\s+',' ',name).strip().title()

def artwork_for(audio):
    for ext in ART:
        candidate=audio.with_suffix(ext)
        if candidate.exists():
            return candidate.relative_to(ROOT).as_posix()
    return None

def track_for(audio, category=None, theme=None):
    rel=audio.relative_to(ROOT)
    parts=rel.parts
    # Standard layout is music/<category>/<theme>/<audio>.
    category=category or (parts[1] if len(parts)>3 else 'uncategorized')
    theme=theme or (parts[2] if len(parts)>3 else 'general')
    return {'id':rel.as_posix(),'title':title_from_filename(audio),'category':category,'theme':theme,'audio':rel.as_posix(),'artwork':artwork_for(audio)}

def main():
    tracks=[]
    featured=[]
    if MUSIC.exists():
        for audio in sorted(MUSIC.rglob('*')):
            if not audio.is_file() or audio.suffix.lower() not in AUDIO: continue
            rel=audio.relative_to(MUSIC)
            if rel.parts and rel.parts[0]=='featured':
                featured.append(track_for(audio,'featured','featured'))
                continue
            tracks.append(track_for(audio))
    OUT.write_text(json.dumps(tracks,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    FEATURED_OUT.write_text(json.dumps(featured,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'Generated {OUT} with {len(tracks)} track(s).')
    print(f'Generated {FEATURED_OUT} with {len(featured)} featured track(s).')

if __name__=='__main__': main()
