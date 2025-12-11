import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import DataTable from "react-data-table-component";
import Loading from "../../src/components/datatable/Loading";
import axios from "axios";
import Select from "react-select";
import { useForm } from "@inertiajs/react";
import Button from "../../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { notifyError } from "../../src/components/ui/Toastify";
import TextInput from "../../src/components/ui/TextInput";
export default function ItemReport({ ranks, positions, grades }) {
    const { t } = useTranslation();
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [isLoading, setIsLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isExporting, setIsExporting] = useState(false)
    const { data, setData, errors, clearErrors } = useForm({
        identity: '',
        position_id: '',
        rank_id: '',
        gender: '',
        division: '',
    });
    const { identity, position_id: positionId, rank_id: rankId, gender, division } = data;

    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.employee-report'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                identity: identity,
                position_id: positionId,
                rank_id: rankId,
                gender: gender,
                division: division
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, identity, positionId, rankId, gender, division]);
    const COLUMN = [
        {
            name: 'No',
            cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: true,
            width: '100px',
            style: {
                textAlign: 'center',
            },
        },
        {
            name: t('NIP'),
            selector: row => row.nip,
            sortable: true,
        },
        {
            name: t('Name'),
            selector: row => row.name,
            sortable: true,
        },
        {
            name: t('Gender'),
            selector: row => t(row.gender),
            sortable: true,
        },
        {
            name: t('Division'),
            selector: row => t(row.division),
            sortable: true,
        },
        {
            name: t('Position'),
            selector: row => t(row?.position?.name),
            sortable: true,
        },
        {
            name: t('Rank'),
            selector: row => t(row?.rank?.name),
            sortable: true,
        },
        {
            name: t('Photo'),
            cell: (row) => (
                row?.user?.photo ? (
                    <img src={row?.user?.photo_url} alt={row.name} className="img-thumbnail" style={{ width: '50px', height: '50px' }} />
                ) : null
            ),
        },
    ];

    const handleExport = async () => {
        try {
            setIsExporting(true); // mulai animasi

            const response = await axios.post(route("report.employees.export"), {
                identity: identity,
                position_id: positionId,
                rank_id: rankId,
                gender: gender,
                division: division
            }, {
                responseType: "blob",
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${t('Employee Report')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            notifyError(error.response?.data?.message || error.message);
        } finally {
            setIsExporting(false);
        }
    };
    const genders = [
        { value: 'Male', label: t('Male') },
        { value: 'Female', label: t('Female') },
    ];

    const divisions = [
        { value: "Sekretariat", label: t("Secretariat") },
        { value: "Irban 1", label: t("Irban 1") },
        { value: "Irban 2", label: t("Irban 2") },
        { value: "Irban 3", label: t("Irban 3") },
        { value: "Irban 4", label: t("Irban 4") },
        { value: "Irban 5", label: t("Irban 5") },
    ];
    return (
        <AppLayout>
            <Breadcrumb title={t('Report')} subtitle={t('Item Report')} />
            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="row mb-50 gap-3">
                                <h6 htmlFor="gender">{t('Filter')}</h6>
                                <div className="col-md-3">
                                    <TextInput
                                        id="identity"
                                        type="text"
                                        className="form-control"
                                        autoComplete="off"
                                        onChange={(e) => setData('identity', e.target.value)}
                                        readOnly={!!data?.id}
                                        placeholder={t('Enter Attribute', { 'attribute': t('Name Or NIP') })}
                                        value={data?.identity}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        options={genders}
                                        onChange={(option) => {
                                            clearErrors('gender');
                                            setData('gender', option ? option.value : '');
                                        }}
                                        placeholder={t('Select Gender')}
                                        isSearchable={true}
                                        isClearable={true}
                                        classNames={{
                                            control: (state) =>
                                                `react-select__control ${errors.gender ? "is-invalid" : ""}`
                                        }}
                                        value={
                                            genders.find(option => option.value === data.gender) || null
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        options={divisions}
                                        onChange={(option) => {
                                            clearErrors('division');
                                            setData('division', option ? option.value : '');
                                        }}
                                        placeholder={t('Select Division')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={
                                            divisions.find(option => option.value === data.division) || null
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        options={positions}
                                        getOptionLabel={(position) => position.name}
                                        getOptionValue={(position) => position.id}
                                        onChange={(option) => {
                                            clearErrors('position_id');
                                            setData('position_id', option ? option.id : '');
                                        }}
                                        placeholder={t('Select Position')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={
                                            positions.find(option => option.id === data?.position_id) || null
                                        }
                                    />
                                </div>
                                <div className="col-md-3">
                                    <Select
                                        options={ranks}
                                        getOptionLabel={(rank) => rank.name}
                                        getOptionValue={(rank) => rank.id}
                                        onChange={(option) => {
                                            clearErrors('rank_id');
                                            setData('rank_id', option ? option.id : '');
                                        }}
                                        placeholder={t('Select Rank')}
                                        isSearchable={true}
                                        isClearable={true}
                                        value={
                                            ranks.find(option => option.id === data?.rank_id) || null
                                        }
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <Button type="button" className="btn btn-primary btn-sm mb-1" onClick={handleExport} isLoading={isExporting} >
                                        <Icon icon="mdi:file-excel" className="me-2" width="20" height="20" />
                                        {t('Export')}
                                    </Button>
                                </div>
                            </div>
                            <div className="col-12">
                                <DataTable
                                    className="table-responsive"
                                    columns={COLUMN}
                                    data={tableData}
                                    progressPending={isLoading}
                                    noDataComponent={isLoading ? (
                                        <Loading />
                                    ) : tableData.length === 0 ? (
                                        t('datatable.zeroRecords')
                                    ) : (
                                        t('datatable.emptyTable')
                                    )}
                                    searchable
                                    defaultSortField="name"
                                    progressComponent={<Loading />}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    paginationPerPage={rowsPerPage}
                                    onChangePage={page => setCurrentPage(page)}
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setRowsPerPage(newPerPage);
                                        setCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    persistTableHead
                                    striped />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}