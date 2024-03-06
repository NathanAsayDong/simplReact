import { FC, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { AccountTypes } from '../../services/Classes/classes';

import './ImportCsv.scss';

interface ImportCsvProps {}

const ImportCsv: FC<ImportCsvProps> = () => {
  const [csvContent, setCsvContent] = useState<any>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [netValue, setNetValue] = useState<number>(0);
  const [testApiResponse, setTestApiResponse] = useState<String>('');

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
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result;
        setCsvContent(text as object);
        await uploadCsv(text);
      };
      reader.readAsText(file);
    }
  };

  const uploadCsv = async (csv: any) => {
    const account = new AccountTypes('Uccu');
    console.log('csv', csv);
    await TransactionProcessingLocal.processTransactions(csv, account);
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