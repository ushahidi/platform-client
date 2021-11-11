const fs = require('fs');
const file = './build/importmap.json';
const buildFolder = './build';
let importmap;

const matchNames = function () {
    fs.readdir(buildFolder, 'utf8', (err, files) => {
        files = files.filter(file => file.includes('ushahidi') && file.split('.').pop() === 'js');
        // loop through hashed files in the build directory
        files.forEach(file => {
            // match with entries in the importmap
            Object.keys(importmap.imports).forEach(value => {
                let filename = importmap.imports[value].substring(1);
                    filename = filename.slice(0, -3);
                    if(file.includes(filename)) {
                        importmap.imports[value] = "/" + file;
                    }
                });
        });
        fs.writeFileSync(file, JSON.stringify(importmap));
    });
}

try {
    importmap = fs.readFileSync(file, 'utf8')        
       importmap = JSON.parse(importmap)
       matchNames()
     } catch (err) {
       console.error(err)
   }