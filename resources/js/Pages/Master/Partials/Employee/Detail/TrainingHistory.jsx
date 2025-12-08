
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import Loading from "../../../../../src/components/datatable/Loading";
import EditButton from "../../../../../src/components/datatable/EditButton";
import DeleteButton from "../../../../../src/components/datatable/DeleteButton";
import Button from "../../../../../src/components/ui/Button";
import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import Modal from "../../../../../src/components/ui/Modal";
import { confirmAlert } from "../../../../../src/components/ui/SweetAlert";
import { notifyError, notifySuccess } from "../../../../../src/components/ui/Toastify";
import { route } from "ziggy-js";
import { toDateString } from "../../../../../helper";
import TrainingDataForm from "../Form/TrainingDataForm";



export default function TrainingHistory({ employee }) {
    const { t } = useTranslation();
    const [modal, setModal] = useState({
        show: false,
        title: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    // Pagination states
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // Search state
    const [search, setSearch] = useState('');
    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.training-history', employee?.nip), {
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
            name: t('Training Name'),
            selector: row => row?.training_name,
            width: "300px",
            sortable: true,
        },
        {
            name: t('Issuing Institution'),
            selector: row => row?.issuing_institution,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Start Date'),
            selector: row => toDateString(row?.start_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t('End Date'),
            selector: row => toDateString(row?.end_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t('Training Hours'),
            cell: row => (
                <span span > {`${row?.training_hours} ${t('Hours')}`}</span >
            ),
            width: "200px",
            sortable: true,
        },

        {
            name: t('Certificate Number'),
            selector: row => row?.certificate_number,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Certificate Date'),
            selector: row => toDateString(row?.certificate_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t("Certificate"),
            cell: (row) => {
                // Jika file tidak ada
                if (!row?.training_certificate_file) {
                    return <span className="text-secondary">-</span>;
                }

                return (
                    <a
                        href={`/storage/${row.training_certificate_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-underline"
                    >
                        {t("Download")}
                    </a>
                );
            },
            sortable: false,
        },

        {
            name: t('Actions'),
            selector: row => row.is_last,
            cell: (row) => (
                <>
                    <EditButton onClick={() => handleShowModal(row)} isLoading={isLoading} />
                    <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                </>
            ),
            sortable: true,
        }


    ];

    const { data, setData, post, delete: destroy, errors, setError, reset, processing, clearErrors } = useForm({
        // Education Data
        training_history_id: null,
        nip: employee?.nip,
        training_name: '',
        issuing_institution: '',
        start_date: '',
        end_date: '',
        training_hours: '',
        certificate_date: '',
        certificate_file: '',
        training_certificate_file_url: '',
    });

    const handleShowModal = (trainingHistory = null) => {
        trainingHistory ? setData({ ...trainingHistory, nip: employee?.nip, training_certificate_file_url: trainingHistory?.training_certificate_file_url, training_history_id: trainingHistory?.id, }) : reset();
        setModal({
            show: true,
            title: trainingHistory ? t('Edit Training History') : t('Add Training History'),
        });
    };

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, show: false }));
        clearErrors();
    };

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('training-history.destroy', id), {
                onSuccess: (page) => {
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) notifyError(error, 'bottom-center');
                    notifySuccess(success, 'bottom-center');
                    loadTableData();
                },
            });
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('training-history.store'), {
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

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                        <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                        {t('Add Training History')}
                    </Button>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
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

            <Modal
                show={modal.show}
                title={modal.title}
                size="xl"
                fullscreen={false}
                hideFooter={false}
                onClose={handleCloseModal}
                onSave={handleSubmit}
                processing={processing}
            >
                <TrainingDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />
            </Modal>

        </>
    );
}