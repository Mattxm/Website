import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

const urlToPromise = (url) => {
    return new Promise(function(resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const DownloadManager = (DownloadLinks, Title) => {
    var zip = new JSZip();
    const album = zip.folder(Title);

    for (const [key, value] of Object.entries(DownloadLinks)) {
        const ext = value.link.split(/[#?]/)[0].split('.').pop().trim();
        album.file(`${key}.${ext}`, urlToPromise(value.link), {binary: true})
    }

    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, Title);
    }, (e) => {console.log(e)});
}

export default DownloadManager;