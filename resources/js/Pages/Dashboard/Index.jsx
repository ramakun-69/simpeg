import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Breadcrumb from "../../src/components/ui/Breadcrumb";
import { toDateString } from "../../helper";
import AssignmentHistory from "./Partials/AssignmentHistory";
import AssignmentStatus from "./Partials/AssignmentStatus";

export default function Index({ employee, assignments, documents, summary }) {
    const { t } = useTranslation();
    const summaryCards = [
        { label: 'Estimated Service Period', value: summary.service_years === null ? '-' : t('Service Years', { count: summary.service_years }), description: t('Based on PNS NIP') },
        { label: 'Total Assignments', value: summary.total_assignments, description: t('Recorded PLH / PLT') },
        { label: 'Trainings Attended', value: summary.total_trainings, description: t('Certificates Uploaded', { count: summary.certified_trainings }) },
        { label: 'Active Assignments', value: summary.active_assignments, description: t('Currently Ongoing'), active: true },
    ];
    const employeeInfo = [
        ['Rank', employee?.rank?.name],
        ['Next Rank Promotion', t('Not Available')],
        ['Position Appointment Date', toDateString(employee?.last_position?.appointment_date)],
        ['Division', employee?.division],
        ['Employee Type', employee?.employee_type],
        ['Email', employee?.user?.email],
        ['Phone', employee?.phone],
    ];

    return (
        <AppLayout>
            <Breadcrumb title={t('Dashboard')} />
            {!employee ? (
                <div className="card"><div className="card-body p-24 text-secondary-light">{t('Employee Data Not Available')}</div></div>
            ) : (
                <div className="row gy-4">
                    <div className="col-12">
                        <div className="card radius-16">
                            <div className="card-body p-24 d-flex flex-wrap align-items-center justify-content-between gap-4">
                                <div className="d-flex flex-wrap align-items-center gap-4">
                                    <img src={employee.user?.photo_url} alt={employee.name} className="w-80-px h-80-px rounded-circle object-fit-cover" />
                                    <div>
                                        <h5 className="mb-8">{employee.name}</h5>
                                        <p className="text-secondary-light mb-12">{t('NIP')} {employee.nip}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            <span className="badge bg-primary-50 text-primary-600">{employee.current_position?.name || '-'}</span>
                                            <span className="badge border text-secondary-light">{employee.rank?.name || '-'}</span>
                                            <span className="badge border text-secondary-light">{employee.division || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-secondary-light mb-4">{t('Retirement')}</p>
                                    <p className="fw-semibold mb-12">{t('Not Available')}</p>
                                    <Link href={route('profile.index')} className="text-primary-600">{t('View Profile')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    {summaryCards.map((item) => (
                        <div className="col-sm-6 col-xl-3" key={item.label}>
                            <div className={`card radius-16 h-100 ${item.active ? 'bg-warning-100 border-warning' : ''}`}>
                                <div className="card-body p-24">
                                    <p className="text-secondary-light mb-12">{t(item.label)}</p>
                                    <h4 className="mb-8">{item.value}</h4>
                                    <p className="text-secondary-light mb-0">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-lg-6">
                        <div className="card radius-16 h-100">
                            <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
                                <h6 className="text-lg mb-0">{t('Latest Assignments')}</h6>
                                <a href="#assignment-history" className="text-primary-600">{t('View All')}</a>
                            </div>
                            <div className="card-body p-24">
                                {assignments.slice(0, 4).map((item) => (
                                    <div key={item.id} className="border-bottom pb-16 mb-16">
                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-8">
                                            <span className="fw-semibold text-break">{item.name || '-'}</span>
                                            <AssignmentStatus status={item.status} />
                                        </div>
                                        <p className="text-secondary-light mb-0">{item.letter_number} · {toDateString(item.letter_date)}</p>
                                    </div>
                                ))}
                                {!assignments.length && <p className="text-secondary-light mb-0">{t('No Assignments Recorded')}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card radius-16 mb-24">
                            <div className="card-header"><h6 className="text-lg mb-0">{t('Employee Info')}</h6></div>
                            <div className="card-body p-24">
                                {employeeInfo.map(([label, value]) => (
                                    <div className="d-flex flex-wrap justify-content-between gap-2 mb-12" key={label}>
                                        <span className="text-secondary-light">{t(label)}</span>
                                        <span className="text-break">{value || '-'}</span>
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between gap-2">
                                    <span className="text-secondary-light">{t('Status')}</span>
                                    <AssignmentStatus status={employee.status} />
                                </div>
                            </div>
                        </div>
                        <div className="card radius-16">
                            <div className="card-header"><h6 className="text-lg mb-0">{t('Latest Documents')}</h6></div>
                            <div className="card-body p-24">
                                {documents.map((item) => (
                                    <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="d-flex align-items-center gap-3 mb-12">
                                        <Icon icon="mdi:file-document-outline" className="text-danger-600 text-2xl flex-shrink-0" />
                                        <span className="text-break">{t(item.type)}<small className="d-block text-secondary-light">{item.name}</small></span>
                                    </a>
                                ))}
                                {!documents.length && <p className="text-secondary-light mb-0">{t('No Documents Available')}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="col-12"><AssignmentHistory assignments={assignments} /></div>
                </div>
            )}
        </AppLayout>
    );
}
