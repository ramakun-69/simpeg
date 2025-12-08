import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import { useTranslation } from "react-i18next";
import DataTable from "react-data-table-component";
import Search from "../../src/components/datatable/Search";
import Loading from "../../src/components/datatable/Loading";
import EditButton from "../../src/components/datatable/EditButton";
import DeleteButton from "../../src/components/datatable/DeleteButton";
import Button from "../../src/components/ui/Button";
import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import Modal from "../../src/components/ui/Modal";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import EmployeeForm from "./Partials/Employee/Form/EmployeeForm";
import { route } from "ziggy-js";

export default function Employee({ positions, ranks, grades }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
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
        axios.get(route('datatable.employees'), {
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
            name: t('Image'),
            cell: (row) => (
                row?.user?.photo ? (
                    <img src={row?.user?.photo} alt={row.name} className="img-thumbnail" style={{ width: '50px', height: '50px' }} />
                ) : null
            ),
        },
        {
            name: t('NIP'),
            selector: row => row.nip,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Name'),
            selector: row => row.name,
            width: "200px",
            sortable: true,
        },
        {
            name: t('Gender'),
            selector: row => t(row?.gender),
            sortable: true,
        },
        {
            name: t('Division'),
            selector: row => row.division,
            sortable: true,
        },
        {
            name: t('Position'),
            selector: row => `${row?.position?.name ?? '-'}`,
            width: "150px",
            sortable: true,
        },
        {
            name: t('Rank'),
            selector: row => `${row?.rank?.name ?? '-'}`,
            width: "200px",
            sortable: true,
        },

        {
            name: t('Actions'),
            cell: (row) => (
                <>
                    <EditButton onClick={() =>  router.get(route('master-data.employees.edit', row.id))} isLoading={isLoading} />
                    {row.id !== auth.user.id && (
                        <DeleteButton onClick={() => handleDelete(row.id)} isLoading={isLoading} />
                    )}
                </>
            ),
            sortable: true,
        }
    ];

    const handleShowModal = (employee = null) => {
        setModal({
            show: true,
            title: employee ? t('Edit Employee') : t('Add New Employee'),
        });
    };

    const handleCloseModal = () => {
        setModal(prev => ({ ...prev, show: false }));
    };

    const handleDelete = (id) => {
        confirmAlert(t('Are You Sure?'), t('delete_description'), 'warning', () => {
            destroy(route('master-data.employees.destroy', id), {
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

    const reload = () => loadTableData();

    return (
        <AppLayout>
            <Breadcrumb title={t('Employee')} subtitle={t('Employee Management')} />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button type="button" className="btn btn-sm btn-primary" onClick={() => handleShowModal()}>
                        <Icon icon="line-md:plus" className="me-2" width="20" height="20" />
                        {t('Add New Employee')}
                    </Button>
                    <Link href={route('trash.employees')} className="btn btn-sm btn-danger ms-2">
                        <Icon icon="line-md:trash" className="me-2" width="20" height="20" />
                        {t('Trash')}
                    </Link>
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


            {/* MODAL */}
            <Modal
                show={modal.show}
                title={modal.title}
                size="xl"
                fullscreen={false}
                hideFooter={true}
                onClose={handleCloseModal}
            >
                <EmployeeForm
                    closeModal={handleCloseModal}
                    onSuccess={() => {
                        handleCloseModal();
                        reload();
                    }}
                    positions={positions}
                    ranks={ranks}
                    grades={grades}
                />
            </Modal>
        </AppLayout>
    );
}