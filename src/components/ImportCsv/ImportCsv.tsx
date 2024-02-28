import { FC, useState } from 'react';

interface ImportCsvProps {}

const ImportCsv: FC<ImportCsvProps> = () => {
   const [csvContent, setCsvContent] = useState<string>('');
 
   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     if (file) {
       const reader = new FileReader();
       reader.onload = (e: ProgressEvent<FileReader>) => {
         const text = e.target?.result;
         setCsvContent(text as string);
       };
       reader.readAsText(file);
     }
   };
 
   return (
     <>
      <div>
      <label htmlFor="upload-csv" style={{ backgroundColor: 'black', color: 'white', padding: '1.5px', borderRadius: '1px', cursor: 'pointer' }}>
        Upload File
      </label>
      <input type="file" id="upload-csv" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
      {csvContent && <p>{csvContent}</p>}
    </div>
     </>
   );
 };
 
 export default ImportCsv;