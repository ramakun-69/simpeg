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
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import Modal from "../../src/components/ui/Modal";
import { confirmAlert } from "../../src/components/ui/SweetAlert";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import EmployeeForm from "./Partials/Employee/Form/EmployeeForm";
import { route } from "ziggy-js";
import DrawerPanel from "./Partials/Employee/ApplicationAccess/DrawerPanel";

export default function Employee({ positions, ranks }) {
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
    // Applicatin Access State
    const [applicationAccess, setApplicationAccess] = useState({
        show: false,
        user: null,
        applications: [],
        accesses: [],
    });
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, search]);
    const COLUMN = [
        {
            name: "No",
            cell: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
            sortable: true,
            width: "100px",
            style: {
                textAlign: "center",
            },
        },
        {
            name: t("Photo"),
            cell: (row) =>
                row?.user?.photo ? (
                    <img
                        src={row?.user?.photo_url}
                        alt={row.name}
                        className="img-thumbnail"
                        style={{ width: "50px", height: "50px" }}
                    />
                ) : null,
        },
        {
            name: t("NIP"),
            selector: (row) => row.nip,
            width: "200px",
            sortable: true,
        },
        {
            name: t("Name"),
            selector: (row) => row.name,
            width: "200px",
            sortable: true,
        },
        {
            name: t("Gender"),
            selector: (row) => t(row?.gender),
            sortable: true,
        },
        {
            name: t("Division"),
            selector: (row) => row.division,
            sortable: true,
        },
        {
            name: t("Position"),
            selector: (row) => `${row?.position?.name ?? "-"}`,
            width: "150px",
            sortable: true,
        },
        {
            name: t("Rank"),
            selector: (row) => `${row?.rank?.name ?? "-"}`,
            width: "200px",
            sortable: true,
        },

        {
            name: t("Actions"),
            width: "250px",
            cell: (row) => (
                <>
                    <EditButton
                        onClick={() =>
                            router.get(
                                route("master-data.employees.edit", row.id),
                            )
                        }
                        isLoading={isLoading}
                    />
                    {row?.user?.id && (
                        <Button
                            type="button"
                            className="w-32-px h-32-px me-8 bg-info-100 text-info-main rounded-circle d-inline-flex align-items-center justify-content-center"
                            onClick={() => handleApplicationAccess(row)}
                            disabled={isLoading}
                            loadingType={2}
                        >
                            <Icon
                                icon="mdi:shield-key-outline"
                                className="me-2"
                                width={20}
                                height={20}
                            />
                        </Button>
                    )}
                    {row.user_id !== auth.user.id && (
                        <DeleteButton
                            onClick={() => handleDelete(row.id)}
                            isLoading={isLoading}
                        />
                    )}
                </>
            ),
            sortable: true,
        },
    ];
    const { delete: destroy } = useForm({});
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

    const handleApplicationAccess = async (employee) => {
        const user = employee?.user;
        if (!user?.id) {
            notifyError(t("User account not found"), "bottom-center");
            return;
        }
       
        try {
            const response = await axios.get(
                route("master-data.employees.application-access", user.id),
            );

            setApplicationAccess({
                show: true,
                user: response.data.user,
                applications: response.data.applications,
                accesses: response.data.accesses,
            });
        } catch (error) {
            notifyError(
                error.response?.data?.message ?? t("Something went wrong"),
                "bottom-center",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseApplicationAccess = () => {
        setApplicationAccess({
            show: false,
            user: null,
            applications: [],
            accesses: [],
        });
    };

    const handleSaveApplicationAccess = async (accesses) => {
        try {
           const {data}= await axios.put(
                route("master-data.employees.application-access.update", applicationAccess.user.id),
                { accesses },
            );
            notifySuccess(data?.message, "bottom-center");
            handleCloseApplicationAccess();
        } catch (error) {
            notifyError(error.response?.data?.message ?? t("Something went wrong"), "bottom-center");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <AppLayout>
            <Breadcrumb
                title={t("Employee")}
                subtitle={t("Employee Management")}
            />
            <div className="container">
                <div className="d-flex justify-content-end mb-3">
                    <Button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShowModal()}
                    >
                        <Icon
                            icon="line-md:plus"
                            className="me-2"
                            width="20"
                            height="20"
                        />
                        {t("Add New Employee")}
                    </Button>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <div className="col-md-4">
                                    <Search
                                        search={search}
                                        setSearch={setSearch}
                                    />
                                </div>
                            </div>
                            <div className="col-12">
                                <DataTable
                                    className="table-responsive"
                                    columns={COLUMN}
                                    data={tableData}
                                    progressPending={isLoading}
                                    noDataComponent={
                                        isLoading ? (
                                            <Loading />
                                        ) : search && tableData.length === 0 ? (
                                            t("datatable.zeroRecords")
                                        ) : (
                                            t("datatable.emptyTable")
                                        )
                                    }
                                    searchable
                                    defaultSortField="name"
                                    progressComponent={<Loading />}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    paginationPerPage={rowsPerPage}
                                    onChangePage={(page) =>
                                        setCurrentPage(page)
                                    }
                                    onChangeRowsPerPage={(newPerPage, page) => {
                                        setRowsPerPage(newPerPage);
                                        setCurrentPage(page);
                                    }}
                                    highlightOnHover
                                    persistTableHead
                                    striped
                                />
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
                />
            </Modal>

            <DrawerPanel
                user={applicationAccess.user}
                applications={applicationAccess.applications}
                accesses={applicationAccess.accesses}
                show={applicationAccess.show}
                onClose={handleCloseApplicationAccess}
                onSubmit={handleSaveApplicationAccess}
                isLoading={isLoading}
            />
        </AppLayout>
    );
}
