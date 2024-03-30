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
        try {
          const text = e.target?.result;
          setCsvContent(text);
          await uploadCsv(text);
        } catch (error) {
          console.error(error);
          // Here you might want to set an error state and display it to the user
        }
      };
      reader.readAsText(file);
    }
  };
  

  const uploadCsv = async (csv: any) => {
    const account = new AccountTypes('Uccu');
    console.log('csv', csv);
    await TransactionProcessingLocal.processTransactions(csv, account);
  }

  const getAllTransactions = async () => {
    const response = await TransactionProcessingLocal.getAllTransactions();
    console.log('response', response);
  }

  return (
    <>
      <div className='container'>
      <h1 className='title'>Import CSV</h1>
      <input type="file" id="upload-csv" accept=".csv" onChange={handleFileUpload} />
      <button onClick={getAllTransactions}>Get All Transactions</button>
      {csvContent && <p className='csv-content'>{csvHeaders}</p>}
    </div>
    </>
  );
};

export default ImportCsv;