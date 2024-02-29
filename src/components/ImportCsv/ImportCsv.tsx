import { FC, useState } from 'react';
import './ImportCsv.scss';

interface ImportCsvProps {}

const ImportCsv: FC<ImportCsvProps> = () => {
  const [csvContent, setCsvContent] = useState<string>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [netValue, setNetValue] = useState<number>(0);

  const testData = [
    {caption: '', value: 0, timestamp: ''},
    {caption: '', value: 0, timestamp: ''},
    {caption: '', value: 0, timestamp: ''},
    {caption: '', value: 0, timestamp: ''},
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        setCsvContent(text as string);
      };
      reader.readAsText(file);
      setCsvHeaders(getCsvHeaders(csvContent));
    }
  };

  const getCsvHeaders = (csvContent: string) => {
    const [headers] = csvContent.split('\n');
    return (headers.split(','));
  }

  return (
    <>
      <div className='container'>

      <h1 className='title'>Import CSV</h1>

      <input type="file" id="upload-csv" accept=".csv" onChange={handleFileUpload} />
      {csvContent && <p className='csv-content'>{csvHeaders}</p>}
    </div>
    </>
  );
};

export default ImportCsv;