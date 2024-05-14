import { FC, useState } from 'react';
import { TransactionProcessingLocal } from '../../services/Classes/accountProcessingService';
import { Account } from '../../services/Classes/classes';

import { UserAccountsData } from '../../services/Classes/dataContext';
import './ImportCsv.scss';

interface ImportCsvProps {}

const ImportCsv: FC<ImportCsvProps> = () => {
  const [csvContent, setCsvContent] = useState<any>('');
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);

  const accounts = UserAccountsData() || [];
  const [selectedAccount, setSelectedAccount] = useState<String>('');
  const [numTransactions, setNumTransactions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);


  const handleAccountChange = (e: any) => {
    setSelectedAccount(e.target.value);
  }


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const text = e.target?.result;
          setCsvContent(text);
          if (text) {
            const lines = text.toString().split('\n');
            setNumTransactions(lines.length-1);
          }
        } catch (error) {
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  const uploadCsv = async () => {
    if (numTransactions === 0 || selectedAccount === 'None') {
      alert('Please select an account and upload a CSV file');
    }
    else {
      setLoading(true);
      const account = accounts.find((account: Account) => account.name === selectedAccount);
      const res = await TransactionProcessingLocal.processTransactions(csvContent, account);
      setCsvContent('');
      setSelectedAccount('None');
      setNumTransactions(0);
      setLoading(false);
    }
  }


  const getAllTransactions = async () => {
    const response = await TransactionProcessingLocal.getAllTransactions();
    console.log('response', response);
  }

  return (
    <>
    <div className='body'>
      <div className='container'>
        <div className='row'>
          <h2 className='title'>Upload New Transactions</h2>
        </div>
        <div className='row'>
        <input type="file" id="upload-csv" accept=".csv" onChange={handleFileUpload} />
          <select onChange={handleAccountChange}>
            <option value="None">Select Account</option>
            {accounts.map((account: Account, key: any) => {
              return <option value={account.name} key={key}>{account.name}</option>
            })}
          </select>
          <button onClick={uploadCsv} className='special-button'>
          { loading ? 'Uploading...' :
            `Upload ${numTransactions}`
          }
        </button>
        </div>
        {csvContent && <p className='csv-content'>{csvHeaders}</p>}
      </div>
    </div>
    </>
  );
};

export default ImportCsv;