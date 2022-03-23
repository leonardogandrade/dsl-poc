const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { google } = require('googleapis');
const DIAGRAM_EXT = "mmd"

//file path for out file
const PATH = path.join(__dirname, '../', 'docs');

//client id
const CLIENT_ID = '215358375990-cirqd5reg70co5ngkv0f3ap51l85n8bg.apps.googleusercontent.com'

//client secret
const CLIENT_SECRET = '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';

//redirect URL
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

//refresh token
const REFRESH_TOKEN = "1//04JZDs86SogI9CgYIARAAGAQSNwF-L9IrKzTlHlC5Oh30d3VquXka5fvBIDkU9NUEu3F-OYPUy0-QQyFLjrICaL_oZ1Okoo6_eMc"

//intialize auth client
const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

//setting our auth credentials
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//initialize google drive
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

//function to upload the file
async function upload_file(path, filename) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: `${filename}`, //file name
                parents: ["1aN1TTS05PjGc_xEcR5F_HDBj4uvAbDm5"],
                mimeType: 'image/svg',
            },
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(`${path}/${filename}`),
            },
        });
        // report the response from the request
        console.log(response.data);
    } catch (error) {
        //report the error message
        console.log(error.message);
    }
}

let folder_name_to_search = "Diagramas";
let get_foler_id = async () => {
    let result = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    }).catch(e => console.log("eeee", e));
    let folder = result.data.files.filter(x => x.name === folder_name_to_search);
    let folderId = folder.length ? folder[0].id : 0;
    console.log(folderId)
}

// Upload files to Google Drive
const upload_to_google_drive = async () => {
    await fs.readdir(PATH, (err, files) => {
        if (err)
            console.log(err);

        for (file of files) {
            if (!file.includes(DIAGRAM_EXT))
                upload_file(PATH, file);
        }
    });
}

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
}

upload_to_google_drive();

//Promise.all([delete_files(), upload_to_google_drive()])