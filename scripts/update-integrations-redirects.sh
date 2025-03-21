
# This is the one off script that was used to update the integrations redirects.
# This script is not meant to be run again, but is kept here for reference.

# Directory containing the .md files
directory="docs/docs-content/integrations"

# Find all .md files and rename them to .mdx
# List of file names to exclude
exclude_files=(
    "maintenance-policy.md"
    "kubernetes-support.md"
    "verified_packs.md"
    "community_packs.md"
    "deprecated-packs.md"
) 

# Find all .md files and rename them to .mdx, excluding specified files
find "$directory" -type f -name "*.md" | while read -r file; do
    filename=$(basename "$file")
    if [[ ! " ${exclude_files[@]} " =~ " ${filename} " ]]; then
        mv "$file" "${file%.md}.mdx"
    fi
done

# Insert the file name after the second line that contains ---
find "$directory" -type f -name "*.mdx" | while read -r file; do
    awk -v redirect="\n<RedirectPackPage packName=\"$(basename "${file%.mdx}")\" />" '
    /---/ { count++; if (count == 2) { last = NR; lastline = $0 } }
    { lines[NR] = $0 }
    END {
        for (i = 1; i <= NR; i++) {
            print lines[i]
            if (i == last) {
                print redirect
            }
        }
    }' "$file" > temp && mv temp "$file"
done
