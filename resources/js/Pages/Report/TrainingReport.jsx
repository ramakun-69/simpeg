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
import { identity } from "@fullcalendar/core/internal";
import useDebounce from "../../src/hook/useDebounce";

export default function TrainingReport({ ranks, positions }) {
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
        issuing_institution: '',
        training_name: '',
    });
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const debouncedIdentity = useDebounce(data.identity, 500);
    const debouncedInstitution = useDebounce(data.issuing_institution, 500);
    const debouncedTrainingName = useDebounce(data.training_name, 500);
    const loadTableData = () => {
        setIsLoading(true);
        axios.get(route('datatable.training-report'), {
            params: {
                page: currentPage,
                per_page: rowsPerPage,
                identity: debouncedIdentity,
                issuing_institution: debouncedInstitution,
                training_name: debouncedTrainingName
            },
        }).then((res) => {
            setTableData(res.data.data);
            setTotalRows(res.data.total);
            setIsLoading(false);
        });
    };
    useEffect(() => {
        loadTableData();
    }, [currentPage, rowsPerPage, debouncedIdentity, debouncedInstitution, debouncedTrainingName]);

    const handleExport = async () => {
        try {
            setIsExporting(true); // mulai animasi

            const response = await axios.post(route("report.trainings.export"), {
                identity: debouncedIdentity,
                issuing_institution: debouncedInstitution,
                training_name: debouncedTrainingName
            }, {
                responseType: "blob",
            });

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${t('Training Report')}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            notifyError(error.response?.data?.message || error.message);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AppLayout>
            <Breadcrumb title={t('Report')} subtitle={t('Training Report')} />
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
                                <div className="col-md-4">
                                    <TextInput
                                        id="issuing_institution"
                                        type="text"
                                        className="form-control"
                                        autoComplete="off"
                                        onChange={(e) => setData('issuing_institution', e.target.value)}
                                        readOnly={!!data?.id}
                                        placeholder={t('Enter Attribute', { 'attribute': t('Issuing Institution') })}
                                        value={data?.issuing_institution}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <TextInput
                                        id="training_name"
                                        type="text"
                                        className="form-control"
                                        autoComplete="off"
                                        onChange={(e) => setData('training_name', e.target.value)}
                                        readOnly={!!data?.id}
                                        placeholder={t('Enter Attribute', { 'attribute': t('Training Name') })}
                                        value={data?.training_name}
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
                                <table className="table table-bordered">
                                    <thead className="text-center">
                                        <tr>
                                            <th style={{ width: 60 }}>No</th>
                                            <th>{t('NIP')}</th>
                                            <th>{t('Name')}</th>
                                            <th>{t('Issuing Institution')}</th>
                                            <th>{t('Training Name')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-4">
                                                    <Loading />
                                                </td>
                                            </tr>
                                        )}

                                        {!isLoading && tableData.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="text-center">
                                                    {t('datatable.zeroRecords')}
                                                </td>
                                            </tr>
                                        )}

                                        {!isLoading && tableData.map((row, index) => {
                                            const institutions = Object.entries(row.trainings_by_institution || {});
                                            const totalRowSpan = institutions.reduce(
                                                (sum, [, trainings]) => sum + trainings.length,
                                                0
                                            );

                                            return institutions.flatMap(([institution, trainings], instIndex) =>
                                                trainings.map((training, i) => (
                                                    <tr key={`${row.nip}-${institution}-${i}`}>
                                                        {instIndex === 0 && i === 0 && (
                                                            <>
                                                                <td rowSpan={totalRowSpan} className="text-center">
                                                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                                                </td>
                                                                <td rowSpan={totalRowSpan}>{row.nip}</td>
                                                                <td rowSpan={totalRowSpan}>{row.name}</td>
                                                            </>
                                                        )}

                                                        {i === 0 && (
                                                            <td rowSpan={trainings.length}>{institution}</td>
                                                        )}

                                                        <td>- {training}</td>
                                                    </tr>
                                                ))
                                            );
                                        })}
                                    </tbody>
                                </table>


                                <nav className="mt-3">
                                    <ul className="pagination justify-content-end">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(p => p - 1)}
                                            >
                                                {t('Previous')}
                                            </button>
                                        </li>

                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <li
                                                key={i}
                                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(i + 1)}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(p => p + 1)}
                                            >
                                                {t('Next')}
                                            </button>
                                        </li>
                                    </ul>
                                </nav>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}