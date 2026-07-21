import re

file_path = "app/admin/settings/page.tsx"
with open(file_path, 'r') as f:
    content = f.read()

if "useAuth" not in content:
    content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { useAuth } from '@/hooks/useAuth';")
    
    comp_match = re.search(r'export default function (\w+)\(\) \{', content)
    if comp_match:
        comp_name = comp_match.group(1)
        content = content.replace(f"export default function {comp_name}() {{", f"export default function {comp_name}() {{\n  const {{ userData }} = useAuth();")
    
    content = content.replace("}, []);", "}, [userData]);")
    
    # Update getDoc(doc(db, 'settings', 'general'))
    content = re.sub(
        r"doc\(db, 'settings', 'general'\)",
        r"doc(db, 'settings', userData?.companyId || 'default')",
        content
    )
    
    with open(file_path, 'w') as f:
        f.write(content)

print("Done settings")
