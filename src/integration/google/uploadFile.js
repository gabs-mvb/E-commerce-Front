const fs = require('fs')
const { google } = require('googleapis')

const STORAGE = '1nZNnN6CLWGqPKUYm4nuYKZWacTyIJBoa';

async function uploadFile(file) {
    if (!fs.existsSync(filePath)) {
        console.log(`O arquivo '${filePath}' não foi encontrado.`);
        return; 
    }
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './src/integration/google/googledrive.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            'name': file.name,
            'parents': [STORAGE]
        };

        const media = {
            mimeType: 'image/jpg',
            body: fs.createReadStream(file.path)
        };

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        return response.data.id;
    } catch (err) {
        console.log('Upload file error', err);
    }
}

export default uploadFile;