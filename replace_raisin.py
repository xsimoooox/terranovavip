import os

target_dir = r"c:\Users\simosimana\Downloads\simu1.3\simu1"
replacements = [
    ("plan_raisin_data.js", "plan_arganier_data.js"),
    ("plan_parfait_raisin.html", "plan_parfait_arganier.html"),
    ("PLAN_RAISIN_DATA", "PLAN_ARGANIER_DATA"),
    ("PLAN_RAISIN_VARIANTS", "PLAN_ARGANIER_VARIANTS"),
    ("Raisin (Vigne)", "Fruits de l'arganier"),
    ("RAISIN", "FRUITS DE L'ARGANIER"),
    ("Raisin", "Fruits de l'arganier"),
    ("raisin", "arganier"),
    ("🍇", "🌳")
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
