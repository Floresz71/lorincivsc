#!/usr/bin/env python3
"""Élő állás beírása az elo.js fájlba.

Használat (a lorincivsc_hu.html mappájában):
    python elo.py 1 0            -> hazai 1, vendég 0 (a mai napra)
    python elo.py 2 1 2026.10.24 -> adott meccsnapra
A hazai az a csapat, amelyik a bal oldalon áll (a "Csapat A - Csapat B" meccsnévben az első).
"""
import sys, datetime, pathlib
if len(sys.argv) < 3:
    print(__doc__); sys.exit(1)
h, v = int(sys.argv[1]), int(sys.argv[2])
d = sys.argv[3] if len(sys.argv) > 3 else datetime.date.today().strftime("%Y.%m.%d")
now = datetime.datetime.now().strftime("%H:%M:%S")
p = pathlib.Path(__file__).with_name("elo.js")
p.write_text('window.ELO = { datum: "%s", hazai: %d, vendeg: %d, frissitve: "%s" };\n' % (d, h, v, now), encoding="utf-8")
print("elo.js frissítve:", d, "%d-%d" % (h, v), now)
