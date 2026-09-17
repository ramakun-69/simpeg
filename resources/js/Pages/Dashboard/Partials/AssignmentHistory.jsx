import { useState } from "react";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import DataTable from "react-data-table-component";
import { toDateString } from "../../../helper";
import AssignmentStatus from "./AssignmentStatus";

export default function AssignmentHistory({ assignments }) {
    const { t } = useTranslation();
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const years = [...new Set(assignments.map(item => item.letter_date?.slice(0, 4)).filter(Boolean))].sort().reverse();
    const yearOptions = [{ value: '', label: t('All Years') }, ...years.map(value => ({ value, label: value }))];
    const typeOptions = [{ value: '', label: t('All Types') }, ...['PLH', 'PLT'].map(value => ({ value, label: t(value) }))];
    const tableData = assignments.filter(item => (!year || item.letter_date?.startsWith(year)) && (!type || item.type === type));
    const columns = [
        { name: t('Date'), selector: row => row.letter_date, cell: row => toDateString(row.letter_date), sortable: true, wrap: true },
        { name: t('Assignment Name'), selector: row => row.name || '-', wrap: true, grow: 2 },
        { name: t('Type'), selector: row => t(row.type) },
        { name: t('Letter Number'), selector: row => row.letter_number, wrap: true },
        { name: t('Status'), cell: row => <AssignmentStatus status={row.status} /> },
    ];

    return (
        <div className="card radius-16" id="assignment-history">
            <div className="card-header">
                <div className="row align-items-center gy-3">
                    <div className="col-md-6"><h6 className="text-lg mb-0">{t('Assignment History')}{year && ` — ${year}`}</h6></div>
                    <div className="col-md-3"><Select aria-label={t('Year')} options={yearOptions} value={yearOptions.find(item => item.value === year)} onChange={item => setYear(item?.value || '')} /></div>
                    <div className="col-md-3"><Select aria-label={t('Type')} options={typeOptions} value={typeOptions.find(item => item.value === type)} onChange={item => setType(item?.value || '')} /></div>
                </div>
            </div>
            <div className="card-body p-0">
                <DataTable columns={columns} data={tableData} pagination responsive
                    noDataComponent={<div className="p-24 text-secondary-light">{t('No Assignments Recorded')}</div>}
                    paginationComponentOptions={{ rowsPerPageText: t('Rows Per Page'), rangeSeparatorText: t('Of') }} />
            </div>
        </div>
    );
}
