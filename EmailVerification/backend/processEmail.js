const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const papa = require('papaparse');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processEmail = async (emailObj, filenameMainDate) => {
  try {
    
    const response = await axios.post('https://new.smart24x7.com/email-validator/v0/check_email', {
      to_email: emailObj.email
    });

    const data3 = response.data;
    console.log("data3", data3);

    await axios.post('http://localhost:3000/storeResult', {
      email: data3.input,
      status: data3.is_reachable,
      filenameMain: filenameMainDate
    });

    return { email: data3.input, status: data3.is_reachable };
  } catch (error) {
    console.error("Error processing email:", emailObj.email, error);
    return { email: emailObj.email, status: "error" };
  }
};

// const processEmails = async (filePath, filenameMainDate) => {
//   const data = await fs.readFile(filePath, 'utf8');
//   const parsedData = papa.parse(data, { header: true }).data;
//   console.log("parseddat",parsedData);

//   for (const emailObj of parsedData) {
//     console.log("email",emailObj.email);
//         await processEmail(emailObj, filenameMainDate);
//     await delay(2000); // Delay for 2 seconds before processing the next email
//   }

//   console.log("All email verifications completed for file:", filenameMainDate);
// };

const processEmails = async (filePath, filenameMainDate) => {
  const data = await fs.readFile(filePath, 'utf8');
  const parsedData = papa.parse(data, { header: true }).data;
  console.log("parsedData", parsedData);

  const concurrencyLimit = 5;
  let index = 0;

  const processBatch = async () => {
    const batch = parsedData.slice(index, index + concurrencyLimit);
    const promises = batch.map(emailObj => processEmail(emailObj, filenameMainDate));
    await Promise.all(promises);
    index += concurrencyLimit;
  };

  while (index < parsedData.length) {
    await processBatch();
    if (index < parsedData.length) {
      await delay(2000); // Delay for 2 seconds before processing the next batch
    }
  }
};
// Read command line arguments
const filePath = process.argv[2];
const filenameMainDate = process.argv[3];

processEmails(filePath, filenameMainDate);
