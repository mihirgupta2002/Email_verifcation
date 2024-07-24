
const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const multer = require('multer');
const papa = require('papaparse');


const getFile = async (req, res) => {
  try {
    const { fileName } = req.body;
    const filePath = path.join(__dirname, "..", 'results', fileName);

    if (await fs.access(filePath).then(() => true).catch(() => false)) {
      const data = await fs.readFile(filePath, 'utf8');
      res.status(200).json({ filePath, data });
    } else {
      res.status(404).json({ message: 'File not found.' });
    }
  } catch (err) {
    console.error("Error in getFile:", err);
    res.status(500).json({ message: "An error occurred while retrieving the file." });
  }
};

const storeResult = async (req, res) => {
  try {
    const { email, status, filenameMain } = req.body;
    const data = `${email},${status}\n`;
    const fileName = `temp-${filenameMain}`;
    const resultDir = path.join(__dirname, "..", "results");
    const filePath = path.join(resultDir, fileName);
    await fs.mkdir(resultDir, { recursive: true })
  .then(() => {
    console.log(`Directory ${resultDir} created successfully.`);
  })
  .catch(err => {
    console.error(`Error creating directory ${resultDir}:`, err);
  });

    // await fs.mkdir(resultDir, { recursive: true });
    await fs.appendFile(filePath, data);

    console.log("file updated");
    res.status(200).json("updated");
  } catch (err) {
    console.error("Error in storeResult:", err);
    res.status(500).json({ message: "An error occurred while updating the file." });
  }
};
//
//

const currentfileupload = async (req, res) => {
  try {
    
      if (!req.file) {
        console.error("No file uploaded.");
        return res.status(400).send('No file uploaded.');
      }
      
      console.log("File uploaded to /currentfile: ", req.file);

      // Process the file in a separate process
      const child = spawn('node', ['processEmail.js', req.file.path, req.file.filename]);

      child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });
      console.log("returning filename")

      console.log(req.file.filename);
      res.status(200).json({ filenname:"temp-"+req.file.filename});

    
  } catch (err) {
    console.error("Error in currentfileupload:", err);
    res.status(500).json({ message: "An error occurred during file upload." });
  }
};

module.exports = { storeResult, currentfileupload, getFile };
