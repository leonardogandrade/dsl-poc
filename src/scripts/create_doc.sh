#!/bin/sh
# EXTENSION=mmd
# search_dir=docs
# for entry in "$search_dir"/*
# do
#     # node_modules/.bin/mmdc -i $entry -o $entry.svg
#     ext="${entry##*.}"
#     if ("$ext" == 'mmd')
#     then
#         echo "ola"
#     fi
#     # echo "${filename##*.}"
# done

# node_modules/.bin/mmdc -i docs/sequence-diagram.mmd -o docs/sequence-diagram.svg


img="svg"
search_dir=docs

# Delete SVG old files 
for entry in "$search_dir"/*
do
    ext="${entry##*.}"
    if [ "$img" = "$ext" ]; then
        rm $entry
    fi
done


# Create new diagrams
for entry in "$search_dir"/*
do
    node_modules/.bin/mmdc -i $entry -o $entry.svg
done