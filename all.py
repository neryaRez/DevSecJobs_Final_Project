# all.py
# Writes each file name and its full source code into a single output file

import os

OUTPUT_FILE = "files_with_code.txt"
BASE_DIR = "."  # FIX: unified and correct variable name

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    for root, _, files in os.walk(BASE_DIR):
        for name in files:
            path = os.path.join(root, name)

            # skip output file itself
            if os.path.abspath(path) == os.path.abspath(OUTPUT_FILE):
                continue

            out.write(f"\n{'=' * 80}\n")
            out.write(f"FILE: {path}\n")
            out.write(f"{'=' * 80}\n")

            try:
                with open(path, "r", encoding="utf-8", errors="replace") as f:
                    out.write(f.read())
            except Exception as e:
                out.write(f"\n[ERROR READING FILE] {e}\n")

print(f"All files and their code were written to {OUTPUT_FILE}")
