
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
import RankDataForm from "../Form/RankDataForm";
import SwitchButton from "../../../../../src/components/ui/SwitchButton";
import LastEducationDataForm from './../Form/LastEducationDataForm';


export default function EducationHistory({ employee }) {
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
        axios.get(route('datatable.education-history', employee?.nip), {
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
            name: t('University Name'),
            selector: row => row?.university_name,
            width: "300px",
            sortable: true,
        },
        {
            name: t('Study Program'),
            selector: row => row?.study_program,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Education Program'),
            selector: row => row?.education_program,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Honorific Title'),
            selector: row => row?.honorific_title ?? "-",
            width: "200px",
            sortable: true,
        },
        {
            name: t('Post Nominal Letters'),
            selector: row => row?.post_nominal_letters ?? "-",
            width: "200px",
            sortable: true,
        },
        {
            name: t('Degree Certificate Number'),
            selector: row => row?.degree_certificate_number,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Degree Certificate Date'),
            selector: row => toDateString(row?.degree_certificate_date),
            width: "200px",
            sortable: true,
        },
        {
            name: t("Degree Certificate File"),
            cell: (row) => {
                // Jika file tidak ada
                if (!row?.degree_certificate_file) {
                    return <span className="text-secondary">-</span>;
                }

                return (
                    <a
                        href={`/storage/${row.degree_certificate_file}`}
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
        education_history_id: null,
        nip: employee?.nip,
        university_name: '',
        study_program: '',
        education_program: '',
        degree_certificate_number: '',
        honorific_title: '',
        post_nominal_letters: '',
        degree_certificate_date: '',
        degree_certificate_file: '',
        degree_certificate_file_url: '',
    });

    const handleShowModal = (educationHistory = null) => {
        console.log(educationHistory);
        educationHistory ? setData({ ...educationHistory, nip: employee?.nip, degree_certificate_file_url: educationHistory?.degree_certificate_file_url, education_history_id: educationHistory?.id, }) : reset();
        setModal({
            show: true,
            title: educationHistory ? t('Edit Education History') : t('Add Education History'),
        });
    };

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, show: false }));
        clearErrors();
    };

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('education-history.destroy', id), {
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
        post(route('education-history.store'), {
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
                        {t('Add Education History')}
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
                <LastEducationDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />
            </Modal>

        </>
    );
}