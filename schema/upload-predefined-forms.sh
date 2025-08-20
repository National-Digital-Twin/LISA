#!/bin/bash

# SPDX-License-Identifier: Apache-2.0
# © Crown Copyright 2025. This work has been developed by the National Digital Twin Programme
# and is legally attributed to the Department for Business and Trade (UK) as the governing entity.

# Check required arguments
if [ $# -ne 3 ]; then
    echo "Usage: $0 <ttl_file> <schema_json> <ui_schema_json>"
    exit 1
fi

TTL_FILE=$1
SCHEMA_JSON=$2
UI_SCHEMA_JSON=$3

# Verify files exist
for file in "$TTL_FILE" "$SCHEMA_JSON" "$UI_SCHEMA_JSON"; do
    if [ ! -f "$file" ]; then
        echo "Error: File '$file' not found"
        exit 1
    fi
done

# Extract unique entity types from TTL file
ENTITIES=$(cat "$TTL_FILE" | grep -Eo "^lisa:[^ ]+ rdf:type" | cut -d ' ' -f 1| cut -d ':' -f 2 | sort -u)

echo "Found ${ENTITIES[@]/%/ } entities to process"

# duplicate ttl file
cp "$TTL_FILE" "temp.ttl"

# Process each entity
for ENTITY_TYPE in $ENTITIES; do
    echo "Processing entity: $ENTITY_TYPE"

    # Get schema and uiSchema for current entity
    SCHEMA_DATA=$(jq ".forms[] | select(.type == \"$ENTITY_TYPE\") | .dataSchema" "$SCHEMA_JSON")
    UI_SCHEMA_DATA=$(jq ".forms[] | select(.type == \"$ENTITY_TYPE\") | .uiSchema" "$UI_SCHEMA_JSON")

    # Validate schemas exist
    if [ "$(jq 'type' <<< "$SCHEMA_DATA" 2>/dev/null)" != "\"object\"" ]; then
        echo "Error: Schema not found for entity '$ENTITY_TYPE'"
        exit 1
    fi

    if [ "$(jq 'type' <<< "$UI_SCHEMA_DATA" 2>/dev/null)" != "\"object\"" ]; then
        echo "Error: UI Schema not found for entity '$ENTITY_TYPE'"
        exit 1
    fi

    # Create combined JSON structure
    COMBINED_JSON=$(jq -n --argjson schema "$SCHEMA_DATA" --argjson uiSchema "$UI_SCHEMA_DATA" '{"schema": $schema, "uiSchema": $uiSchema}' | jq '@json')

    # Process TTL content for current entity
    sed -i "s|lisa:"$ENTITY_TYPE"\ lisa:hasData\ \$FORM_DATA|lisa:"$ENTITY_TYPE"\ lisa:hasData\ '$COMBINED_JSON'|g" "temp.ttl"
done

# escape all "
sed -i 's|"|\\"|g' "temp.ttl"
# replace starting '\" with "
sed -i 's|\x27\\"|"|g' "temp.ttl"
# replace ending \"' with "
sed -i 's|\\"\x27|"|g' "temp.ttl"
# replace \" that starts with hasName \" with hasName "
sed -i 's|hasName \\"|hasName "|g' "temp.ttl"
# replace \" that starts with createdAt \" with createdAt "
sed -i 's|createdAt \\"|createdAt "|g' "temp.ttl"
# replace \" that is next to ^ with "^
sed -i 's|\\"^|"^|g' "temp.ttl"
# replace #lbrack# with (
sed -i 's|#lbrack#|(|g' "temp.ttl"
# replace #rbrack# with )
sed -i 's|#rbrack#|)|g' "temp.ttl"
# replace #amp# with &
sed -i 's|#amp#|\&|g' "temp.ttl"
# replace #newline# with &
sed -i 's|#newline#|\\\\n|g' "temp.ttl"

# Send POST request with proper Turtle MIME type
RESPONSE=$(curl -X POST \
    -H "Content-Type: text/turtle" \
    -T "temp.ttl" \
    http://localhost:3030/knowledge/upload)

# Handle response
STATUS_CODE=$?
if [ $STATUS_CODE -eq 0 ]; then
    echo "Successfully uploaded processed TTL data to server"
    echo "Cleaning up..."

    # delete temp file
    rm "temp.ttl"
else
    echo "Upload failed with status code $STATUS_CODE"
    echo "Response: $RESPONSE"
    exit 1
fi
