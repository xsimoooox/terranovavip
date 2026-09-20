import os

target_dir = r"c:\Users\simosimana\Downloads\simu1.3\simu1"
replacements = [
    ("#9c27b0", "#ff9800"),
    ("#9C27B0", "#FF9800"),
    ("#7b1fa2", "#f57c00"),
    ("#7B1FA2", "#F57C00"),
    ("#ce93d8", "#ffcc80"),
    ("#CE93D8", "#FFCC80"),
    ("#4a148c", "#e65100"),
    ("#4A148C", "#E65100"),
    ("#6b21a8", "#ef6c00"),
    ("#6B21A8", "#EF6C00"),
    ("156, 39, 176", "255, 152, 0"),
    ("156,39,176", "255,152,0"),
    ("123, 31, 162", "245, 124, 0"),
    ("123,31,162", "245,124,0"),
    ("206, 147, 216", "255, 204, 128"),
    ("206,147,216", "255,204,128"),
    ("74, 20, 140", "230, 81, 0"),
    ("74,20,140", "230,81,0"),
    ("107, 33, 168", "239, 108, 0"),
    ("107,33,168", "239,108,0")
]

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith((".html", ".js", ".md", ".css")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                new_content = content
                for old, new in replacements:
                    new_content = new_content.replace(old, new)
                
                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
            except Exception as e:
                print(f"Failed to process {filepath}: {e}")
