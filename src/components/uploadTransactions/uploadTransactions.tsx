import { FC } from 'react';
import ImportCsv from '../ImportCsv/ImportCsv';
import NavBar from '../NavBar/NavBar';
import './uploadTransactions.scss';


interface UploadTransactionsProps {}

const UploadTransactions: FC<UploadTransactionsProps> = () => (
  <>
    <NavBar />
    <ImportCsv />
  </>
);

export default UploadTransactions;
