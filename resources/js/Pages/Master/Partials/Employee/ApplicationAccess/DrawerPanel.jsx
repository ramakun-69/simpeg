import { useEffect, useMemo, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import Search from "../../../../../src/components/datatable/Search";
import Button from "../../../../../src/components/ui/Button";

const toAccessState = (accesses = []) => Object.fromEntries(
    accesses.map((access) => [access.application_id, {
        enabled: true,
        is_admin: Boolean(access.is_admin),
    }]),
);

export default function DrawerPanel({
    show,
    user,
    applications = [],
    accesses = [],
    onClose,
    onSubmit,
    isLoading,
}) {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState({});

    useEffect(() => {
        if (show) setSelected(toAccessState(accesses));
    }, [show, accesses]);

    const filteredApplications = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return applications;
        return applications.filter((application) =>
            `${application.name} ${application.code}`.toLowerCase().includes(query),
        );
    }, [applications, search]);

    const updateAccess = (applicationId, changes) => {
        setSelected((current) => ({
            ...current,
            [applicationId]: {
                enabled: false,
                is_admin: false,
                ...current[applicationId],
                ...changes,
            },
        }));
    };

    const selectedAccesses = Object.entries(selected)
        .filter(([, value]) => value.enabled)
        .map(([application_id, value]) => ({ application_id, is_admin: value.is_admin }));

    return (
        <Offcanvas show={show} onHide={onClose} placement="end" scroll backdrop="static" className="w-100" style={{ maxWidth: 560 }}>
            <Offcanvas.Header closeButton className="border-bottom px-4 py-3">
                <div>
                    <Offcanvas.Title className="fw-semibold">{t("Application Access")}</Offcanvas.Title>
                    <div className="text-muted small mt-1">{user?.name} · {user?.email}</div>
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column p-0">
                <div className="px-4 py-3 border-bottom">
                    <Search search={search} setSearch={setSearch} />
                    <div className="small text-muted">{selectedAccesses.length} {t("Applications Selected")}</div>
                </div>

                <div className="flex-grow-1 overflow-auto px-4 py-3">
                    {filteredApplications.length === 0 && (
                        <div className="text-center text-muted py-5">{t("No applications found")}</div>
                    )}
                    {filteredApplications.map((application) => {
                        const value = selected[application.id] || { enabled: false, is_admin: false };
                        return (
                            <div key={application.id} className="border rounded-3 p-3 mb-3 shadow-sm">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-primary-subtle text-primary p-2 d-flex">
                                        <Icon icon="solar:widget-5-outline" width="22" height="22" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold">{application.name}</div>
                                    </div>
                                    <div className="application-access-option">
                                        <input className="application-access-checkbox" type="radio"
                                            name={`application-access-${application.id}`}
                                            id={`application-none-${application.id}`} checked={!value.enabled}
                                            onChange={() => updateAccess(application.id, {
                                                enabled: false,
                                                is_admin: false,
                                            })} disabled={isLoading} />
                                        <label className="application-access-label small" htmlFor={`application-none-${application.id}`}>{t("No Access")}</label>
                                    </div>
                                    <div className="application-access-option">
                                        <input className="application-access-checkbox" type="radio"
                                            name={`application-access-${application.id}`}
                                            id={`application-user-${application.id}`} checked={value.enabled && !value.is_admin}
                                            onChange={(event) => updateAccess(application.id, {
                                                enabled: event.target.checked,
                                                is_admin: false,
                                            })} disabled={isLoading} />
                                        <label className="application-access-label small" htmlFor={`application-user-${application.id}`}>{t("User")}</label>
                                    </div>
                                    <div className="application-access-option">
                                        <input className="application-access-checkbox" type="radio"
                                            name={`application-access-${application.id}`}
                                            id={`application-admin-${application.id}`}
                                            checked={value.is_admin} onChange={(event) => updateAccess(application.id, {
                                                enabled: true, is_admin: event.target.checked,
                                            })} disabled={isLoading} />
                                        <label className="application-access-label small" htmlFor={`application-admin-${application.id}`}>{t("Admin")}</label>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="border-top p-3 d-flex justify-content-end gap-2 bg-white">
                    <Button type="button" className="btn btn-light" onClick={onClose} disabled={isLoading}>{t("Cancel")}</Button>
                    <Button type="button" className="btn btn-primary" onClick={() => onSubmit(selectedAccesses)} isLoading={isLoading}>
                        <Icon icon="material-symbols-light:save-outline-rounded" className="me-2" width="20" height="20" />
                        {t("Save")}
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
