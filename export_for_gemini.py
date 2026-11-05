#!/usr/bin/env python3
"""
Скрипт для сборки всего проекта в один файл для чата с Gemini.
Генерирует TEMKA_FULL_CODEBASE.md, который можно просто перетащить (drag-and-drop)
или скопировать в окно чата Gemini.
"""

import os
import sys
from pathlib import Path

# Обеспечиваем корректный вывод UTF-8 в консоли Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).parent.resolve()
OUTPUT_FILE = ROOT_DIR / "TEMKA_FULL_CODEBASE.md"

EXTENSIONS_TO_INCLUDE = {".html", ".js", ".css", ".json"}
FILES_TO_EXCLUDE = {"TEMKA_FULL_CODEBASE.md"}
DIRS_TO_EXCLUDE = {".git", "node_modules", ".gemini", "temp", "tmp", ".github", ".cursor"}

def get_gemini_prompt():
    prompt_file = ROOT_DIR / "GEMINI_PROMPT.md"
    if prompt_file.exists():
        return prompt_file.read_text(encoding="utf-8")
    return "Ты — Game Developer, работающий над пиксельным Roguelike 'Темщик' (Vanilla JS, Canvas, Деньги=ХП)."

def collect_files():
    collected = []
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in DIRS_TO_EXCLUDE and not d.startswith(".")]
        
        for file in sorted(files):
            if file in FILES_TO_EXCLUDE:
                continue
            path = Path(root) / file
            if path.suffix.lower() in EXTENSIONS_TO_INCLUDE:
                rel_path = path.relative_to(ROOT_DIR)
                collected.append((rel_path, path))
    return sorted(collected, key=lambda x: str(x[0]))

def main():
    files = collect_files()
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("# ПОЛНЫЙ КОНТЕКСТ ПРОЕКТА «ТЕМЩИК» ДЛЯ GEMINI\n\n")
        out.write(get_gemini_prompt())
        out.write("\n\n---\n\n## АКТУАЛЬНЫЙ ИСХОДНЫЙ КОД ВСЕХ ФАЙЛОВ\n\n")

        for rel_path, abs_path in files:
            lang = "javascript"
            if rel_path.suffix == ".html":
                lang = "html"
            elif rel_path.suffix == ".css":
                lang = "css"
            elif rel_path.suffix == ".json":
                lang = "json"

            content = abs_path.read_text(encoding="utf-8")
            out.write(f"### Файл: `{rel_path.as_posix()}`\n\n```{lang}\n{content}\n```\n\n")

    print(f"Готово! Сгенерирован файл: {OUTPUT_FILE}")
    print(f"Всего файлов упаковано: {len(files)}")
    print("Теперь просто прикрепи этот файл к сообщению в чате Gemini!")

if __name__ == "__main__":
    main()
