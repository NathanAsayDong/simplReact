import { MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { FC, useState } from "react";
import { DashboardFilterData } from "../../services/Classes/classes";
import './DashboardConfig.scss';

interface DashboardConfigProps {filterObject: DashboardFilterData}

export const DashboardConfig: FC<DashboardConfigProps> = ({filterObject}) => {
    const [filter, setFilter] = useState<DashboardFilterData>({ ...filterObject });

    const filterStyling = {
        border: '1px solid white',
        borderRadius: '5px',
        color: 'white',
        padding: '0px',
        width : '100%'
    }

    const handleStartDateSelect = (date: Dayjs | null) => {
        filter.startDate = date?.unix() || null;
    }

    const handleEndDateSelect = (date: Dayjs | null) => {
        filter.endDate = date?.unix() || null;
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

    return (
        <>
            <div className="options-box">
                <div className="options-header archivo-font">
                    <h2 className="header">Date Ranges</h2>
                </div>
                <div className="options-row">
                    <DatePicker
                        label="Start Date"
                        value={dayjs.unix(filter.startDate as number)}
                        onChange={handleStartDateSelect}
                        sx={filterStyling}
                    />
                    <DatePicker
                        label="End Date"
                        value={dayjs.unix(filter.endDate as number)}
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

            </div>
        </>
    )





}