const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { google } = require('googleapis');
const PATH = path.join(__dirname, '../', 'docs');
const DIAGRAM_EXT = "mmd"


// Delete old diagrams and create new ones;
const delete_files = async () => {
    await fs.readdir(PATH, async (err, files) => {
        if (err)
            console.log(err);

        for (file of files) {
            if (!file.includes(DIAGRAM_EXT))
                fs.rm(`${PATH}/${file}`, (err) => {
                    if (err)
                        console.log(err);
                });
            else {
                exec(`node_modules/.bin/mmdc -i ${path.join(__dirname, '..', 'docs')}/${file} -o ${path.join(__dirname, '..', 'docs')}/${file.split('.')[0]}.png`, (err, stdout, stderr) => {
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
}

delete_files();
