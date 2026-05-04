#!/usr/bin/env python3
"""
Remove emoji characters from files in the ux-mockup directory.

Usage: python tools/remove_emojis.py

This script will rewrite files in-place. It targets files with these
extensions: .html, .md, .css
"""
import re
import sys
from pathlib import Path


EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001F5FF"  # Misc Symbols and Pictographs
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F680-\U0001F6FF"  # Transport & Map
    "\U0001F700-\U0001F77F"  # Alchemical Symbols
    "\U0001F780-\U0001F7FF"  # Geometric Shapes Extended
    "\U0001F800-\U0001F8FF"  # Supplemental Arrows-C
    "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
    "\U0001FA00-\U0001FA6F"  # Chess etc
    "\U0001FA70-\U0001FAFF"  # Symbols and Pictographs Extended-A
    "\u2600-\u26FF"          # Misc symbols
    "\u2700-\u27BF"          # Dingbats
    "]+",
    flags=re.UNICODE,
)

VARIATION_SELECTOR = re.compile('\uFE0F')


def strip_emojis(text: str) -> str:
    # Remove variation selectors first
    text = VARIATION_SELECTOR.sub('', text)
    # Remove emoji ranges
    return EMOJI_RE.sub('', text)


def process_file(path: Path) -> bool:
    try:
        original = path.read_text(encoding='utf-8')
    except Exception:
        return False
    new = strip_emojis(original)
    if new != original:
        path.write_text(new, encoding='utf-8')
        print(f'Updated: {path}')
        return True
    return False


def main():
    base = Path('ux-mockup')
    if not base.exists():
        print('ux-mockup directory not found', file=sys.stderr)
        sys.exit(2)

    exts = ['.html', '.md', '.css']
    changed = 0
    for p in base.rglob('*'):
        if p.suffix.lower() in exts and p.is_file():
            if process_file(p):
                changed += 1

    print(f'Done. Files changed: {changed}')


if __name__ == '__main__':
    main()
