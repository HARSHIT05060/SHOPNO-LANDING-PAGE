import os
import re

# Paths
base_dir = r"e:\LANDING PAGE\campaign-marketing"
public_dir = os.path.join(base_dir, "public")
src_dir = os.path.join(base_dir, "src")

# Files to scan for references
files_to_scan = [
    os.path.join(src_dir, "App.tsx"),
    os.path.join(src_dir, "index.css"),
]

# Read content from source files
source_content = ""
for file_path in files_to_scan:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            source_content += f.read()

# Get all files in public/images
all_images = []
for root, dirs, files in os.walk(os.path.join(public_dir, "images")):
    for file in files:
        full_path = os.path.join(root, file)
        # Get path relative to public/
        rel_path = os.path.relpath(full_path, public_dir)
        # Normalize slashes to forward slashes for searching
        rel_path_fwd = rel_path.replace("\\", "/")
        all_images.append((full_path, rel_path_fwd))

# Find unused images
unused_images = []
used_images = []
for full_path, rel_path in all_images:
    # Check if the filename or the relative path is referenced in the source content
    filename = os.path.basename(full_path)
    # Search for filename in the source code
    # We escape regex characters in filename and rel_path
    if re.search(re.escape(filename), source_content) or re.search(re.escape(rel_path), source_content):
        used_images.append((full_path, rel_path))
    else:
        unused_images.append((full_path, rel_path))

print(f"Total images found: {len(all_images)}")
print(f"Used images count: {len(used_images)}")
print(f"Unused images count: {len(unused_images)}\n")

print("Unused Images List:")
for full, rel in sorted(unused_images):
    # Print relative path and size in KB
    size_kb = os.path.getsize(full) / 1024
    print(f"- {rel} ({size_kb:.1f} KB)")
