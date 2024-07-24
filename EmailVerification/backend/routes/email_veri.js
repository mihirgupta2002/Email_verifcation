const express = require('express');
const multer = require('multer');
const router= express.Router();

const {storeResult,getFile,currentfileupload} = require('../controllers/email_controller');
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        const id= file.originalname
        console.log(id,"123id123")
        console.log(file);
        
        cb(null,`files/`); // Directory to store files
    },
    filename: function (req, file, cb) {
        
        
        function convertTimestampToFullDate(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // Milliseconds are three digits
      
            return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}-${milliseconds}`;
        
          
        }
        
        // Example usage:
       const timestamp = Date.now();
        const fullDate = convertTimestampToFullDate(timestamp);
        
        // Example usage:
        
        // const timeHMS = convertTimestampToHMS(timestamp);
        
        const fileName = `${fullDate}-${file.originalname}`;
        console.log("fileNmae",fileName)
        cb(null, fileName);
    }
});
const upload2 = multer({ storage: storage2 });
router.route('/currentfileupload')
  .post(upload2.single('file'), currentfileupload);

router.route("/storeResult").post(storeResult);
router.route("/getFile").post(getFile);

module.exports = router;