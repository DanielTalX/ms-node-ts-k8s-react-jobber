if diff input.txt output-decode.txt > /dev/null; then
    echo "The files are the same."
else
    echo "The files are different."
fi
