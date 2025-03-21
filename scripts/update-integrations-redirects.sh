
# This is the one off script that was used to update the integrations redirects.
# This script is not meant to be run again, but is kept here for reference.

# Directory containing the .md files
directory="docs/docs-content/integrations"

# Find all .md files and rename them to .mdx
find "$directory" -type f -name "*.md" | while read -r file; do
    mv "$file" "${file%.md}.mdx"
done

# Insert the file name after the last line that contains ---
find "$directory" -type f -name "*.mdx" | while read -r file; do
    awk -v redirect="\nimport {Redirect} from \"@docusaurus/router\";\n<Redirect to=\"/integrations/packs/?pack=${file%.mdx}\" />" '
    /---/ { last = NR; lastline = $0 }
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
