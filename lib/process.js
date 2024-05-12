const fs = require('fs');
const filename = "../logtify.txt";

const processData = (data) => {
  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
        // File doesn't exist, create it
        fs.writeFile(filename, '', (err) => {
            if (err) {
                console.error('Error creating file:', err);
            } else {
                console.log('File created successfully');
            }
        });
    } else {
        console.log('File already exists');
    }
});

 if(Object.keys(data).length > 0) {

    fs.writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully wrote data to ${filename}`);
        }
      });
 }

};


module.exports = { processData }
