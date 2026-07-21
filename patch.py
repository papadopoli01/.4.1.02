import os
import re

directories = [
    'services', 'leads', 'portfolio', 'testimonials', 'plans'
]

for d in directories:
    file_path = f"app/admin/{d}/page.tsx"
    if not os.path.exists(file_path):
        continue

    with open(file_path, 'r') as f:
        content = f.read()

    # Skip if already patched
    if "useAuth" in content and "userData" in content:
        print(f"Skipping {file_path}, already patched")
        continue

    print(f"Patching {file_path}...")

    # Insert import
    content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useAuth } from '@/hooks/useAuth';")
    content = content.replace("import { collection, getDocs", "import { collection, getDocs, where")

    # Inject useAuth into component
    comp_match = re.search(r'export default function (\w+)\(\) \{', content)
    if comp_match:
        comp_name = comp_match.group(1)
        content = content.replace(f"export default function {comp_name}() {{", f"export default function {comp_name}() {{\n  const {{ userData }} = useAuth();")
    
    # Update useEffect dependency array to include userData
    content = content.replace("}, []);", "}, [userData]);")
    
    # Update query(collection(db, ...), orderBy(...)) to include where()
    # It looks like: const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    content = re.sub(
        r"const q = query\(collection\(db, '([^']+)'\)(.*?)\);",
        r"if (!userData) return;\n      const q = query(collection(db, '\1'), where('companyId', '==', userData.companyId)\2);",
        content
    )

    # When creating a new document or updating, we need to inject companyId.
    # Look for setDoc or addDoc or spreading formData.
    # It usually looks like:
    # const dataToSave = {
    #     ...formData,
    #     order: newOrder
    # };
    # Or something similar. Let's just find the `await setDoc(docRef, ` and inject companyId.
    content = re.sub(
        r"await setDoc\(([^,]+),\s*\{",
        r"await setDoc(\1, {\n        companyId: userData?.companyId,",
        content
    )
    content = re.sub(
        r"await updateDoc\(([^,]+),\s*\{",
        r"await updateDoc(\1, {\n        companyId: userData?.companyId,",
        content
    )

    with open(file_path, 'w') as f:
        f.write(content)

print("Done")
