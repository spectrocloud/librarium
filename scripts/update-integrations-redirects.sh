
# This is the one off script that was used to update the integrations redirects.
# This script is not meant to be run again, but is kept here for reference.

# Directory containing the .md files
directory="docs/docs-content/integrations"

# Find all .md files and rename them to .mdx
find "$directory" -type f -name "*.md" | while read -r file; do
    mv "$file" "${file%.md}.mdx"
done

# Insert the file name after the line that contains ---
find "$directory" -type f -name "*.mdx" | while read -r file; do
    sed -i '' -e '/---/a\
\
import {Redirect} from "@docusaurus/router";\
\
<Redirect to="/integrations/packs/?pack='"${file%.mdx}"'" />
    ' "$file"
done