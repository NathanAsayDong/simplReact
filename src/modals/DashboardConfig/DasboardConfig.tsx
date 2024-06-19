import { MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FC, useEffect, useState } from "react";
import { DashboardFilterData } from "../../services/Classes/classes";
import './DashboardConfig.scss';

interface DashboardConfigProps {
    filterObject: DashboardFilterData;
    onClose: () => void;
    onApply: (filter: DashboardFilterData) => void;
}

export const DashboardConfig: FC<DashboardConfigProps> = ({filterObject, onClose, onApply}) => {
    const [filter, setFilter] = useState<DashboardFilterData>({ ...filterObject });

    useEffect(() => { 
        console.log(filter);
    }, [filter]);

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
        if (event.target.name === 'category') {
            if (event.target.value.includes('All')) {
                if (filter.selectedCategories.includes('All')) {
                    setFilter({...filter, selectedCategories: filter.selectedCategories.filter((category: string) => category !== 'All')});
                } else {
                    setFilter({...filter, selectedCategories: [...filter.selectedCategories, 'All']});
                }
            } else {
                if (filter.selectedCategories.includes('All')) {
                    setFilter({...filter, selectedCategories: [event.target.value]});
                } else {
                    setFilter({...filter, selectedCategories: event.target.value});
                }
            }
        }
        if (event.target.name === 'account') {
            if (event.target.value.includes('All')) {
                if (filter.selectedAccounts.includes('All')) {
                    setFilter({...filter, selectedAccounts: filter.selectedAccounts.filter((account: string) => account !== 'All')});
                } else {
                    setFilter({...filter, selectedAccounts: [...filter.selectedAccounts, 'All']});
                }
            } else {
                if (filter.selectedAccounts.includes('All')) {
                    setFilter({...filter, selectedAccounts: [event.target.value]});
                } else {
                    setFilter({...filter, selectedAccounts: event.target.value});
                }
            }
        }
    }

    const handleModeSelect = (event: any) => {
        if (event.target.name === 'lineChartMode') {
            setFilter({...filter, lineChartMode: event.target.value});
        }
        if (event.target.name === 'pieChartMode') {
            setFilter({...filter, pieChartMode: event.target.value});
        }
        console.log(event);
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
                        value={filter.selectedCategories}
                        label="Categories"
                        onChange={handleFilterSelect}
                        sx={filterStyling}
                        multiple
                    >
                    {filter.categoryOptions.map((category: string, index: any) => (
                    <MenuItem key={index} value={category}>{category}</MenuItem>
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
                        value={filter.selectedAccounts}
                        label="Accounts"
                        onChange={handleFilterSelect}
                        sx={filterStyling}
                        multiple
                    >
                    {filter.accountOptions.map((account: string, index: any) => (
                    <MenuItem key={index} value={account}>{account}</MenuItem>
                    ))}
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
                    <button className="cancel-button archivo-font" style={{width: '50%', borderRadius: '2px'}} onClick={handleCancel}>Cancel</button>
                    <button className="confirm-button apply-button archivo-font" style={{width: '50%', borderRadius: '2px'}} onClick={handleApply}>Apply</button>
                </div>


            </div>
        </>
    )





}