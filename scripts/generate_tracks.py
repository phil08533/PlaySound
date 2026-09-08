#!/usr/bin/env python3
"""Build track manifests from music/category/theme audio files.

Artwork may be a same-named image or embedded in an MP3 as ID3 APIC cover art.
Embedded covers are extracted into artwork/ during the GitHub Pages build.
"""
from pathlib import Path
import json,re

ROOT=Path(__file__).resolve().parents[1]
MUSIC=ROOT/'music'
OUT=ROOT/'tracks.json'
FEATURED_OUT=ROOT/'featured.json'
ALBUM_ART_OUT=ROOT/'album-art.json'
ARTWORK_ROOT=ROOT/'artwork'
SHARED_ALBUM_ART=ROOT/'assets'/'album-art'
AUDIO={'.mp3','.m4a','.ogg','.wav','.aac','.flac'}
ART={'.jpg','.jpeg','.png','.webp'}

def title_from_filename(path):
    name=re.sub(r'\s*\([^)]*\)$','',path.stem)
    name=name.replace('_',' ').replace('-',' ')
    return re.sub(r'\s+',' ',name).strip().title()

def extract_id3_cover(audio):
    """Extract the first ID3v2 APIC picture without requiring third-party packages."""
    try:
        with audio.open('rb') as f:
            header=f.read(10)
            if len(header)<10 or header[:3]!=b'ID3': return None
            version=header[3]
            flags=header[5]
            size=sum((b&0x7f)<<(7*i) for i,b in enumerate(header[6:10]))
            if flags & 0x40:
                ext=f.read(4)
                if len(ext)<4:return None
                ext_size=int.from_bytes(ext,'big') if version==3 else sum((b&0x7f)<<(7*i) for i,b in enumerate(ext))
                f.seek(max(0,ext_size-4),1)
            data=f.read(size)
        pos=0
        while pos+10<=len(data):
            fid=data[pos:pos+4]
            if fid==b'\x00\x00\x00\x00': break
            raw_size=data[pos+4:pos+8]
            frame_size=sum((b&0x7f)<<(7*i) for i,b in enumerate(raw_size)) if version==4 else int.from_bytes(raw_size,'big')
            if frame_size<=0 or pos+10+frame_size>len(data): break
            frame=data[pos+10:pos+10+frame_size]
            if fid==b'APIC' and len(frame)>=4:
                enc=frame[0]; p=1; end=frame.find(b'\x00',p)
                if end<0: break
                mime=frame[p:end].decode('latin1','ignore') or 'image/jpeg'; p=end+1
                if p>=len(frame): break
                p+=1
                if enc in (1,2):
                    d=frame.find(b'\x00\x00',p); p=d+2 if d>=0 else p
                else:
                    d=frame.find(b'\x00',p); p=d+1 if d>=0 else p
                ext='.png' if 'png' in mime else '.webp' if 'webp' in mime else '.jpg'
                return frame[p:],ext
            pos+=10+frame_size
    except Exception as exc:
        print(f'Could not extract embedded artwork from {audio}: {exc}')
    return None

def artwork_for(audio):
    for ext in ART:
        candidate=audio.with_suffix(ext)
        if candidate.exists(): return candidate.relative_to(ROOT).as_posix()
    return None

def track_for(audio, category=None, theme=None):
    rel=audio.relative_to(ROOT); parts=rel.parts
    category=category or (parts[1] if len(parts)>3 else 'uncategorized')
    theme=theme or (parts[2] if len(parts)>3 else 'general')
    return {'id':rel.as_posix(),'title':title_from_filename(audio),'category':category,'theme':theme,'audio':rel.as_posix(),'artwork':artwork_for(audio)}

def main():
    tracks=[]; featured=[]
    if MUSIC.exists():
        for audio in sorted(MUSIC.rglob('*')):
            if not audio.is_file() or audio.suffix.lower() not in AUDIO: continue
            rel=audio.relative_to(MUSIC)
            if rel.parts and rel.parts[0]=='featured': featured.append(track_for(audio,'featured','featured'))
            else: tracks.append(track_for(audio))
    OUT.write_text(json.dumps(tracks,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    FEATURED_OUT.write_text(json.dumps(featured,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    shared_art=[]
    if SHARED_ALBUM_ART.exists():
        shared_art=sorted(image.relative_to(ROOT).as_posix() for image in SHARED_ALBUM_ART.rglob('*') if image.is_file() and image.suffix.lower() in ART)
    ALBUM_ART_OUT.write_text(json.dumps(shared_art,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(f'Generated {OUT} with {len(tracks)} track(s).')
    print(f'Generated {FEATURED_OUT} with {len(featured)} featured track(s).')
    print(f'Generated {ALBUM_ART_OUT} with {len(shared_art)} shared album-art image(s).')

if __name__=='__main__': main()
