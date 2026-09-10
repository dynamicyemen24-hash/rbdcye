#!/usr/bin/env python3
"""fix_all_accessibility.py — إصلاح جميع ملفات إمكانية الوصول"""
import os

BASE = r"d:/Projects26/rbdcye/src/accessibility"

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"حسنت: {os.path.basename(path)}")