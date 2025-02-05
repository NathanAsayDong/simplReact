import { MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FC, useState } from "react";
import { Account, Category, DashboardFilterData } from "../../services/Classes/classes";
import './DashboardConfig.scss';

interface DashboardConfigProps {
    filterObject: DashboardFilterData;
    accounts: Account[]
    onClose: () => void;
    onApply: (filter: DashboardFilterData) => void;
}

export const DashboardConfig: FC<DashboardConfigProps> = ({filterObject, accounts, onClose, onApply}) => {
    const [filter, setFilter] = useState<DashboardFilterData>({ ...filterObject });

    const filterStyling = {
        border: '1px solid white',
        borderRadius: '5px',
        color: 'white',
        padding: '0px',
        width : '100%'
    }

    const lineChartModeOptions = ['netValue', 'category', 'account'];
    const pieChartModeOptions = ['category', 'account'];

    const handleStartDateSelect = (date: Dayjs | null) => {
        filter.startDate = date?.toDate() || null;
    }

    const handleEndDateSelect = (date: Dayjs | null) => {
        filter.endDate = date?.toDate() || null;
    }

    const handleFilterSelect = (event: any) => {
        const { name, value } = event.target;
    
        if (name === 'category') {
        if (!value || value.length === 0) {
            setFilter({ ...filter, selectedCategoryIds: [] });
        } else if (value.includes('All') && !filter.selectedCategoryIds.includes(-1)) {
            setFilter({ ...filter, selectedCategoryIds: [] });
        } else if (value.includes('All') && filter.selectedCategoryIds.includes(-1)) {
            setFilter({ ...filter, selectedCategoryIds: value.filter((category: string) => category !== 'All') });
        } else {
            const selectedCategoryIds = filter.categoryOptions
            .filter(category => value.includes(category.categoryName))
            .map(category => category.categoryId);
            setFilter({ ...filter, selectedCategoryIds });
        }
        }
    
        if (name === 'account') {
        if (!value || value.length === 0) {
            setFilter({ ...filter, selectedAccountIds: [] });
        } else if (value.includes('All') && !filter.selectedAccountIds.includes(-1)) {
            setFilter({ ...filter, selectedAccountIds: [] });
        } else if (value.includes('All') && filter.selectedAccountIds.includes(-1)) {
            setFilter({ ...filter, selectedAccountIds: value.filter((account: string) => account !== 'All') });
        } else {
            const selectedAccountIds = accounts
            .filter(account => value.includes(account.accountName))
            .map(account => account.accountId);
            setFilter({ ...filter, selectedAccountIds });
        }
        }
    };

    const handleModeSelect = (event: any) => {
        if (event.target.name === 'lineChartMode') {
            setFilter({...filter, lineChartMode: event.target.value});
        }
        if (event.target.name === 'pieChartMode') {
            setFilter({...filter, pieChartMode: event.target.value});
        }
    }

    const handleCancel = () => {
        onClose();
    }

    const handleApply = () => {
        onApply(filter);
    }

    return (
        <>
            <div className="options-box">
                <div className="options-header archivo-font">
                    <h2 className="header">Date Ranges</h2>
                </div>
                <div className="options-row">
                    <DatePicker
                        label="Start Date"
                        value={dayjs(filter.startDate) as Dayjs}
                        onChange={handleStartDateSelect}
                        sx={filterStyling}
                    />
                    <DatePicker
                        label="End Date"
                        value={dayjs(filter.endDate) as Dayjs}
                        onChange={handleEndDateSelect}
                        sx={filterStyling}
                    />
                </div>

                <div className="options-header archivo-font">
                    <h2 className="header">Categories</h2>
                </div>
                <div className="options-row">
                    <Select
                        labelId="category-select"
                        id="category-select"
                        name='category'
                        value={filter.selectedCategoryIds}
                        label="Categories"
                        onChange={handleFilterSelect}
                        sx={filterStyling}
                        multiple
                    >
                    {filter.categoryOptions.map((category: Category, index: any) => (
                    <MenuItem key={index} value={category.categoryId}>{category.categoryName}</MenuItem>
                    ))}
                    </Select>
                </div>

                <div className="options-header archivo-font">
                    <h2 className="header">Accounts</h2>
                </div>
                <div className="options-row">
                    <Select
                        labelId="account-select"
                        id="account-select"
                        name='account'
                        value={filter.selectedAccountIds}
                        label="Accounts"
                        onChange={handleFilterSelect}
                        sx={filterStyling}
                        multiple
                    >
                    {filter.accountOptions.map((account: Account, index: any) => (
                    <MenuItem key={index} value={account.accountId}>{account.accountName}</MenuItem>
                    ))}
                    <MenuItem key={10000} value={'All'}>All</MenuItem>
                    </Select>
                </div>

                <div className="options-header archivo-font">
                    <h2 className="header">Line Chart</h2>
                </div>
                <div className="options-row">
                    <Select
                        labelId="line-mode"
                        id="line-mode"
                        name='lineChartMode'
                        value={filter.lineChartMode}
                        label="Mode"
                        onChange={handleModeSelect}
                        sx={filterStyling}
                    >
                    {lineChartModeOptions.map((mode: string, index: any) => (
                    <MenuItem key={index} value={mode}>{mode}</MenuItem>
                    ))}
                    </Select>
                </div>

                <div className="options-header archivo-font">
                    <h2 className="header">Pie Chart</h2>
                </div>
                <div className="options-row">
                    <Select
                        labelId="pie-mode"
                        id="pie-mode"
                        name='pieChartMode'
                        value={filter.pieChartMode}
                        label="Mode"
                        onChange={handleModeSelect}
                        sx={filterStyling}
                    >
                    {pieChartModeOptions.map((mode: string, index: any) => (
                    <MenuItem key={index} value={mode}>{mode}</MenuItem>
                    ))}
                    </Select>
                </div>

                <div className="options-row" style={{marginBottom: '0', marginTop: 'auto', gap: '10px'}}>
                    <button className="cancel-button archivo-font app-button" style={{width: '50%'}} onClick={handleCancel}>Cancel</button>
                    <button className="confirm-button apply-button archivo-font app-button" style={{width: '50%'}} onClick={handleApply}>Apply</button>
                </div>


            </div>
        </>
    )





}