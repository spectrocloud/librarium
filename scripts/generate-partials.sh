#!/bin/bash

# Enable error handling
set -e

echo "Starting generation of _partials/index.ts."

# # Remove the index.ts file if it exists already.
rm -f _partials/index.ts

# Make the _partials folder an index.ts file
mkdir -p _partials
touch _partials/index.ts

# Create the file and add the generated warning.
echo "// This file is generated. DO NOT EDIT!" >> _partials/index.ts

# Find all the MDX files recursively in the _partials folder.
# Loop through each file.
find _partials -name "*.mdx" -print0 | while read -d $'\0' path
do
    module_name=$(basename ${path} .mdx | tr -d '_' | tr -d '-')
    echo "export * as ${module_name}${RANDOM} from '@site/${path}';" >> _partials/index.ts
done

echo "Completed generation of _partials/index.ts."
