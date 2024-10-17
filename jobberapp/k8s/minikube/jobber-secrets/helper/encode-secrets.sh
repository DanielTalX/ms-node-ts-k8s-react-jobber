#!/bin/bash

# Input and output files
input_file="input.txt"
output_file="output.txt"

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Input file not found!"
    exit 1
fi

# Empty or create output file
> "$output_file"

# Process each line in the input file
while IFS=':' read -r key value; do
    # Encode the value with base64
    encoded_value=$(echo "$value" | base64)
    
    # Write the key and encoded value to the output file
    echo "$key:$encoded_value" >> "$output_file"
done < "$input_file"

echo "Encoded key-value pairs have been written to $output_file"
