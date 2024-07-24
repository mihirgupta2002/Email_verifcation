import React, {  useState } from 'react'
import papa from 'papaparse';


const Table = () => {
  const[uploaded,setUploaded]=useState(false);
  const[showUpload,setShowUpload]=useState(false);
  const[fileUploaded,setFileUploaded]=useState(false);
  const[selectedFile,setSelectedFile]=useState([]);
  const[tempfile,setTempFile]=useState("");
  const[searchFile,setSearchFile]=useState("");
  const handleFileChange= async (event)=>{
      if(!fileUploaded){
        setFileUploaded(true);
        setShowUpload(true);

      
      event.preventDefault();

      const file= event.target.files[0];
      setSelectedFile(file);
      console.log(file,"file exists")
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
      const timestamp = Date.now();
      const fullDate = convertTimestampToFullDate(timestamp);
      const filenameMain= `${fullDate}-${file.name}`;
     
      console.log("file name used to store in files directory",filenameMain);
    }
     }

      const provideFile=async(event)=>{
      event.preventDefault();
      console.log("searchFilefirst",searchFile)
      const response=await fetch('http://localhost:3000/getFile', {
        method: 'POST',
        body: JSON.stringify({
          fileName:searchFile
        }),
        headers:{
          'Content-Type':'application/json'
        }
      });

      const data=await response.json();
      console.log("data",data)
      console.log("csv",data.data)
      const CsvData=data.data;


      const blob = new Blob([CsvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "output.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      }

      const handleSubmit = async (event) => {
      event.preventDefault();
      if(!uploaded){
        setUploaded(true);

      if (!selectedFile) {
        alert('No file selected');
        return;
      }
      papa.parse(selectedFile,{
        header:true,
        skipEmptyLines:true,
        complete:async function (result){
            const columnArray=[];
            const valuesArray=[];
            result.data.map((val)=>{
                columnArray.push(Object.keys(val))
                valuesArray.push(Object.values(val))
                return null;
        });
        const emails = result.data.map(emailObj => ({
            email: String(emailObj.email)
          }));
        console.log(emails)
        console.log("data",result.data);
        
      const initialFileName= selectedFile.name;
      console.log("initailfilename",initialFileName)
      const csvData = papa.unparse(result.data);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const formData = new FormData();
      console.log(csvData+"",blob,formData);
      formData.append('file', blob, initialFileName);

      await fetch('http://localhost:3000/currentfileupload', {
          method: 'POST',
          body: formData
          }).then( async(response) =>{const data=await response.json();
            console.log(data);
            console.log(data.filenname);
            setTempFile(data.filenname);
          })
          .then(result => {
          console.log(result);
          alert('uploaded');
          }).catch(error => {
          console.error('Error:', error);
          });
        }
      })
      }}
  return (
    <div>
    <form onSubmit={handleSubmit}>
    <input style={{display:'block',margin:"10px"}} type='file' name='file' accept='.csv' onChange={handleFileChange} />
    {showUpload ? <button type='submit'>upload</button>:null}
    
    </form>
    {tempfile ?
    <>
    <h5>copy file path to request Data </h5>
    <h4>{tempfile}</h4>
    <form onSubmit={provideFile}>
     <input accept='.csv' type='text' name={searchFile}  onChange={event =>setSearchFile(event.target.value)} required />
    <button type='submit'>Request file data</button>
      </form>
    </>
    :
    <>
    <h5>Paste file path to request Data </h5>
    <form onSubmit={provideFile}>
     <input accept='.csv' type='text' name={searchFile}  onChange={event =>setSearchFile(event.target.value)} required />
    <button type='submit'>Request file data</button>
      </form>
    </>
    
    }
    </div>
  )
}

export default Table