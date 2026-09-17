import { useTranslation } from "react-i18next";

export default function AssignmentStatus({ status }) {
    const { t } = useTranslation();
    const statusClass = {
        Active: 'bg-warning-100 text-warning-600',
        Completed: 'bg-success-100 text-success-600',
        Upcoming: 'bg-primary-50 text-primary-600',
        Inactive: 'bg-danger-100 text-danger-600',
    };

    return <span className={`badge radius-8 ${statusClass[status] || 'bg-neutral-100 text-secondary-light'}`}>{t(status)}</span>;
}
