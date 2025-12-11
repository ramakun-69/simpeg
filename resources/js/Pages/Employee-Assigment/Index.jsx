import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import axios from "axios";
import DataTable from "react-data-table-component";
import Search from "../../src/components/datatable/Search";
import Loading from "../../src/components/datatable/Loading";
import Button from "../../src/components/ui/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "../../src/components/ui/Modal";
import TextInput from "../../src/components/ui/TextInput";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import Select from 'react-select';
import ErrorMessage from "../../src/components/ui/ErrorMessage";
import SingleFileUpload from "../../src/components/ui/SingleFileUpload";
import { toDateString } from "../../helper";

export default function Index({ employees, positions, assigment }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
        onSave: () => { },
        processing: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { data, setData, post, delete: destroy, processing, errors, clearErrors, reset } = useForm({
        id: null,
        employee_id: assigment?.employee_id ?? '',
        position_id: assigment?.position_id ?? '',
        current_position: '',
        type: '',
        letter_number: assigment?.letter_number ?? '',
        letter_date: assigment?.letter_date ?? '',
        letter_subject: assigment?.letter_subject ?? '',
        start_date: assigment?.start_date ?? '',
        end_date: assigment?.end_date ?? '',
        assigment_document: assigment?.assigment_document ?? '',
        assigment_document_url: assigment?.assigment_document_url ?? '',
    });
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Search state
    const [search, setSearch] = useState('');
    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.employee-assigment'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                search: search,
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, search]);
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
            name: t('Letter Number'),
            selector: row => row?.letter_number,
            width: '200px',
            sortable: true,
        },
        {
            name: t('Letter Date'),
            selector: row => toDateString(row?.letter_date),
            width: '250px',
            sortable: true,
        },
        {
            name: t('Letter Subject'),
            selector: row => row?.letter_subject,
            width: '200px',
            sortable: true,
        },
        {
            name: t('NIP'),
            selector: row => row?.employee?.nip,
            width: '200px',
            sortable: true,
        },
        {
            name: t('Name'),
            selector: row => row?.employee?.name,
            width: '200px',
            sortable: true,
        },
        {
            name: t('Position'),
            selector: row => row?.position?.name,
            width: '200px',
            sortable: true,
        },
        {
            name: t('Start Date'),
            selector: row => toDateString(row?.start_date),
            width: '200px',
            sortable: true,
        },
        {
            name: t('End Date'),
            selector: row => toDateString(row?.end_date),
            width: '200px',
            sortable: true,
        },
        {
            name: t('Document'),
            cell: row => (
                <a
                    href={`/storage/${row.letter_document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                >
                    {t("Download")}
                </a>
            ),
            sortable: true,
        },
        {
            name: t('Actions'),
            cell: (row) => (
                <>
                    <EditButton onClick={() => handleShowModal(row)} isLoading={isLoading} />
                    <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (assigment = null) => {
        assigment ? setData({ ...assigment, assigment_document_url: assigment.letter_document_url, current_position: assigment?.employee?.position?.name }) : reset();
        setModal({
            show: true,
            title: assigment ? t('Edit Employee Assigment') : t('Add Employee Assigment'),
        });
    }
    const handleCloseModal = () => {
        clearErrors();
        setModal(prev => ({ ...prev, show: false }));
        reset();
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('employee-assigments.store'), {
            onSuccess: (page) => {
                const error = page.props?.flash?.error;
                const success = page.props?.flash?.success;
                reset();
                handleCloseModal();
                if (error) notifyError(error, 'bottom-center');
                notifySuccess(success, 'bottom-center');
                loadTableData();
            },
        });
    }

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('employee-assigments.destroy', id), {
                onSuccess: (page) => {
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) notifyError(error, 'bottom-center');
                    notifySuccess(success, 'bottom-center');
                    loadTableData();

                },
            });
        });
    };
    const assignType = ['PLT', 'PLH'];
    return (
        <AppLayout>
            <Breadcrumb title={t('Employee')} subtitle={t('Employee Assigment')} />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                        <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                        {t('Add New Employee Assigment')}
                    </Button>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <div className="col-md-4">
                                    <Search search={search} setSearch={setSearch} />
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
                                    ) : search && tableData.length === 0 ? (
                                        t('datatable.zeroRecords')
                                    ) : (
                                        t('datatable.emptyTable')
                                    )
                                    }
                                    searchable
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

            <Modal
                show={modal.show}
                onClose={handleCloseModal}
                title={modal.title}
                onSave={handleSubmit}
                processing={processing}
                size="xl"
            >
                <div className="row mb-3">
                    <div className="col-4">
                        <label htmlFor="letter_number" className="form-label">{t('Letter Number')}</label>
                        <TextInput
                            id="letter_number"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('letter_number', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Letter Number') })}
                            value={data?.letter_number}
                            errorMessage={errors.letter_number} />
                    </div>
                    <div className="col-4">
                        <label htmlFor="letter_date" className="form-label">{t('Letter Date')}</label>
                        <TextInput
                            id="letter_date"
                            type="date"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('letter_date', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Letter Date') })}
                            value={data?.letter_date}
                            errorMessage={errors.letter_date} />
                    </div>
                    <div className="col-4">
                        <label htmlFor="letter_subject" className="form-label">{t('Letter Subject')}</label>
                        <TextInput
                            id="letter_subject"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('letter_subject', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Letter Subject') })}
                            value={data?.letter_subject}
                            errorMessage={errors.letter_subject} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-4">
                        <label htmlFor="letter_number" className="form-label">{t('Employee')}</label>
                        <Select
                            options={employees}
                            getOptionLabel={(employee) => employee.name}
                            getOptionValue={(employee) => employee.id}
                            onChange={(option) => {
                                clearErrors('employee_id');
                                setData('employee_id', option ? option.id : '');
                                setData('current_position', option?.position?.name || '');
                            }}
                            placeholder={t('Select Employee')}
                            isSearchable={true}
                            isClearable={true}
                            value={
                                employees.find(option => option.id === data?.employee_id) || null
                            }
                        />
                        {errors?.employee_id && <ErrorMessage message={errors?.employee_id} />}
                    </div>
                    <div className="col-4">
                        <label htmlFor="current_position" className="form-label">{t('Current Position')}</label>
                        <TextInput
                            id="current_position"
                            type="text"
                            className="form-control"
                            autoComplete="off"
                            placeholder={t('Enter Attribute', { 'attribute': t('Current Position') })}
                            value={data?.current_position}
                            errorMessage={errors.current_position}
                            readOnly />
                    </div>
                    <div className="col-4">
                        <label htmlFor="letter_number" className="form-label">{t('Assigned Position')}</label>
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
                        {errors?.position_id && <ErrorMessage message={errors?.position_id} />}
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-4">
                        <label htmlFor="start_date" className="form-label">{t('Start Date')}</label>
                        <TextInput
                            id="start_date"
                            type="date"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('start_date', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('Start Date') })}
                            value={data?.start_date}
                            errorMessage={errors.start_date} />
                    </div>
                    <div className="col-4">
                        <label htmlFor="end_date" className="form-label">{t('End Date')}</label>
                        <TextInput
                            id="end_date"
                            type="date"
                            className="form-control"
                            autoComplete="off"
                            onChange={(e) => setData('end_date', e.target.value)}
                            placeholder={t('Enter Attribute', { 'attribute': t('End Date') })}
                            value={data?.end_date}
                            errorMessage={errors.end_date} />
                    </div>
                    <div className="col-4">
                        <label htmlFor="type" className="form-label">{t('Type')}</label>
                        <Select
                            options={assignType.map(at => ({
                                value: at,
                                label: at
                            }))}
                            onChange={(option) => {
                                clearErrors('type');
                                setData('type', option ? option.value : '');
                            }}
                            placeholder={t('Select Type')}
                            isSearchable={true}
                            isClearable={true}
                            value={
                                assignType
                                    .map(at => ({ value: at, label: at }))
                                    .find(option => option.value === data.type) || null
                            }
                        />
                        {errors.type && <ErrorMessage message={errors.type} />}
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="letter_document" className="form-label">{t('Letter Document')}</label>
                    <SingleFileUpload
                        id="letter_document"
                        label={t('Upload File')}
                        initialFileUrl={data?.letter_document_url}
                        onFileChange={(file) => {
                            clearErrors('letter_document');
                            setData('letter_document', file)
                        }}
                        onFileRemove={() => setData('letter_document', null)}
                        allowedFileTypes={['application/pdf']}
                        height={300}
                    />
                    {errors?.letter_document && <ErrorMessage message={errors?.letter_document} />}
                </div>

            </Modal>
        </AppLayout >
    );
}
