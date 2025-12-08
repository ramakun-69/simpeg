
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import Search from "../../../../../src/components/datatable/Search";
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
import PositionDataForm from "../Form/PositionDataForm";
import TextInput from "../../../../../src/components/ui/TextInput";
import SwitchButton from "../../../../../src/components/ui/SwitchButton";


export default function PositionHistory({ positions, employee, }) {
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
        axios.get(route('datatable.position-history', employee?.nip), {
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
            name: t('Name'),
            selector: row => row?.position?.name,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Status'),
            width: "200px",
            cell: row => {
                const isLast = row.is_last === "Yes";

                return (
                    <span
                        className={
                            `px-24 py-4 rounded-pill fw-medium text-sm ${isLast
                                ? "bg-success-focus text-success-main"
                                : "bg-danger-focus text-danger-main"
                            }`
                        }
                    >
                        {isLast ? t("Last Position") : t("Previous Position")}
                    </span>
                );
            }
        },
        {
            name: t('Appointment Date'),
            selector: row => toDateString(row?.appointment_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t('SK Number'),
            selector: row => row?.position_sk_number,
            width: "200px",
            sortable: true,
        },
        {
            name: t('SK Date'),
            selector: row => toDateString(row?.position_sk_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t("SK File"),
            cell: (row) => {
                // Jika file tidak ada
                if (!row?.position_sk_file) {
                    return <span className="text-secondary">-</span>;
                }

                return (
                    <a
                        href={`/storage/${row.position_sk_file}`}
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
        // Position Data
        position_history_id: null,
        nip: employee?.nip,
        position_id: null,
        position_appointment_date: '',
        position_sk_number: '',
        position_sk_date: '',
        position_sk_file: '',
        position_sk_file_url: '',
        is_last: 'No',
    });

    const handleShowModal = (positionHistory = null) => {
        positionHistory ? setData({ ...positionHistory, nip: employee?.nip, position_sk_file_url: positionHistory?.sk_file_url, position_history_id: positionHistory?.id, position_appointment_date: positionHistory?.appointment_date }) : reset();
        setModal({
            show: true,
            title: positionHistory ? t('Edit Position History') : t('Add Position History'),
        });
    };

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, show: false }));
        clearErrors();
    };

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('position-history.destroy', id), {
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
        post(route('position-history.store'), {
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
                        {t('Add Position History')}
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
                <SwitchButton onChange={(e) => setData("is_last", e.target.checked ? "Yes" : "No")}
                    label={t("Set as Last Position")} checked={data?.is_last == "Yes"} className="mb-20" />
                <hr />
                <PositionDataForm positions={positions} data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />
            </Modal>

        </>
    );
}