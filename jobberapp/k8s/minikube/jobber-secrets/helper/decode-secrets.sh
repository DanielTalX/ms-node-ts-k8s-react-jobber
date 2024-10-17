#!/bin/bash

# Input and output files
input_file="output.txt"
output_file="output-decode.txt"

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Input file not found!"
    exit 1
fi

# Empty or create output file
> "$output_file"

# Process each line in the input file
while IFS=':' read -r key encoded_value; do
    # Decode the base64 encoded value
    decoded_value=$(echo "$encoded_value" | base64 --decode)
    
    # Write the key and decoded value to the output file
    if [ $? -ne 0 ]; then
        echo "Error decoding value for key: $key" >> "$output_file"
    else
        echo "$key:$decoded_value" >> "$output_file"
    fi
done < "$input_file"

echo "Decoded key-value pairs have been written to $output_file"
