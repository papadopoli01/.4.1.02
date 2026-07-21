import os
import re

directories = ['portfolio', 'services', 'testimonials', 'settings']
for d in directories:
    file_path = f"app/admin/{d}/page.tsx"
    if not os.path.exists(file_path): continue

    with open(file_path, 'r') as f:
        content = f.read()

    # ref(storage, `portfolio/...`) -> ref(storage, `${userData?.companyId || 'default'}/portfolio/...`)
    content = re.sub(
        r"ref\(storage, `([^`]+)`\)",
        r"ref(storage, `${userData?.companyId || 'default'}/\1`)",
        content
    )

    with open(file_path, 'w') as f:
        f.write(content)

print("Done storage patch")
