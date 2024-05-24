import { FC } from 'react';
import ImportCsv from '../ImportCsv/ImportCsv';
import './uploadTransactions.scss';


interface UploadTransactionsProps {}

const UploadTransactions: FC<UploadTransactionsProps> = () => (
  <>
    <ImportCsv />
  </>
);

export default UploadTransactions;
