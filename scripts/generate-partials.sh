#!/bin/bash

# Enable error handling
set -e

echo "Starting generation of _partials/index.ts."

# # Remove the index.ts file if it exists already.
rm -f _partials/index.ts

# Make the _partials folder an index.ts file
mkdir -p _partials
touch _partials/index.ts

# Make the versioned partials folder to satisfy compiler.
mkdir -p versioned_partials

# Make _partials the current working directory. All paths will be relative to it now.
cd _partials

# Create the file and add the generated warning.
echo "// This file is generated. DO NOT EDIT!" >> index.ts

# Find all the MDX files recursively in the _partials folder.
# Loop through each file.
find . -name "*.mdx" -print0 | while read -d $'\0' path
do
    module_name=$(basename ${path} .mdx | tr -d '_' | tr -d '-')
    hash=$(echo -n "$path" | md5sum | cut -c1-8)
    echo "export * as ${module_name}_${hash} from '$path';" >> index.ts
done

echo "Completed generation of _partials/index.ts."
