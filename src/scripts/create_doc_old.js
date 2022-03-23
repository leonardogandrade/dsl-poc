const fs = require('fs');
const { exec } = require('child_process');
const PATH = '../docs';
const DIAGRAM_EXT = "mmd"

// Delete old diagrams and create new ones;
fs.readdir(PATH, (err, files) => {
    if (err)
        console.log(err);

    for (file of files) {
        if (!file.includes(DIAGRAM_EXT))
            fs.rm(`${PATH}/${file}`, (err) => {
                if (err)
                    console.log(err);
            });
        else {
            exec(`../../node_modules/.bin/mmdc -i ../docs/${file} -o ../docs/${file.split('.')[0]}.svg`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                if (stderr) {
                    console.log(stderr);
                    return;
                }
            })
        }
    }
});
