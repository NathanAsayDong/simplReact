import { FC, useState } from 'react';
import { Account } from '../../services/Classes/classes';
import { DataApiService } from '../../services/Classes/dataApiService';

import { UserAccountsData } from '../../services/Classes/dataContext';
import './ImportCsv.scss';

interface ImportCsvProps {
  setLoading: (loading: boolean) => void;
  setLoadingProgress: (progress: number) => void;
}

const ImportCsv: FC<ImportCsvProps> = ({setLoading, setLoadingProgress}) => {
  const [csvContent, setCsvContent] = useState<any>('');
  // const [csvHeaders] = useState<string[]>([]);

  const accounts = UserAccountsData() || [];
  const [selectedAccount, setSelectedAccount] = useState<String>('');
  const [numTransactions, setNumTransactions] = useState<number>(0);
  const [batches, setBatches] = useState<number>(0);
  const [loading2, setLoading2] = useState<boolean>(false);


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
            setBatches(Math.ceil((lines.length-1)/10));
            console.log('batches: ', batches);
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
      setLoading2(true);
      const account = accounts.find((account: Account) => account.name === selectedAccount);
      if (!account) {
        alert('Account not found');
        return;
      }
      DataApiService.processTransactions(csvContent, account);
      for (let i = 0; i <+ 100; i++) {
        setTimeout(() => {
          setLoadingProgress(i);
        }, 1000);
      }
      setTimeout(() => {
        setCsvContent('');
        setSelectedAccount('None');
        setNumTransactions(0);
        setLoading(false);
        setLoading2(false);
        setLoadingProgress(0);
      }, 5000);
    }
  }

  return (
    <>
      <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1em'}}>
        <div className='row'>
            <h2 className='special-title' style={{ marginLeft: '3%', marginTop: '10px', color: 'white'}}>Upload New Transactions</h2>
        </div>
        <div className='container'>
          <div className='row'>
          <input type="file" id="upload-csv" accept=".csv" onChange={handleFileUpload}/>
            <select onChange={handleAccountChange}>
              <option value="None">Select Account</option>
              {accounts.map((account: Account, key: any) => {
                return <option value={account.name} key={key}>{account.name}</option>
              })}
            </select>
            <button onClick={uploadCsv} className='special-button'>
            { loading2 ? 'Uploading...' :
              `Upload ${numTransactions}`
            }
          </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportCsv;