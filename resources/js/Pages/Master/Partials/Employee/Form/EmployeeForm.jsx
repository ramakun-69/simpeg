import { useForm } from "@inertiajs/react";
import Button from "../../../../../src/components/ui/Button";
import { notifySuccess, notifyError } from "../../../../../src/components/ui/Toastify";
import EmployeeDataForm from "./EmployeeDataForm";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PositionDataForm from "./PositionDataForm";
import RankDataForm from "./RankDataForm";
import LastEducationDataForm from "./LastEducationDataForm";

export default function EmployeeForm({ employee, onSuccess, positions, ranks, grades, closeModal }) {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors, setError, reset, clearErrors } = useForm({
        // Employee Data
        id: employee?.id ?? '',
        user_id: employee?.user_id,
        nip: employee?.nip ?? '',
        name: employee?.name ?? '',
        email: employee?.user?.email ?? '',
        gender: employee?.gender ?? '',
        born_place: employee?.born_place ?? '',
        born_date: employee?.born_date ?? '',
        phone: employee?.phone ?? '',
        address: employee?.address ?? '',
        employee_type: employee?.employee_type ?? '',
        division: employee?.division ?? '',

        // Position Data
        position_history_id: employee?.last_position?.id ?? null,
        position_id: employee?.position_id ?? '',
        position_appointment_date: employee?.last_position?.appointment_date ?? '',
        position_sk_number: employee?.last_position?.sk_number ?? '',
        position_sk_date: employee?.last_position?.position_sk_date ?? '',
        position_sk_file: employee?.last_position?.position_sk_file ?? '',
        position_sk_file_url: employee?.last_position?.sk_file_url ?? '',

        // Rank Data
        rank_history_id: employee?.last_rank?.id ?? null,
        rank_id: employee?.rank_id ?? '',
        grade_id: employee?.grade_id ?? '',
        rank_appointment_date: employee?.last_rank?.appointment_date ?? '',
        rank_sk_number: employee?.last_rank?.rank_sk_number,
        rank_sk_date: employee?.last_rank?.rank_sk_date,
        rank_sk_file: employee?.last_rank?.rank_sk_file,
        rank_sk_file_url: employee?.last_rank?.sk_file_url,

        // Last Education Data
        education_history_id: employee?.last_education?.id ?? null,
        university_name: employee?.last_education?.university_name ?? '',
        study_program: employee?.last_education?.study_program ?? '',
        education_program: employee?.last_education?.education_program,
        degree_certificate_number: employee?.last_education?.degree_certificate_number,
        honorific_title: employee?.last_education?.honorific_title ?? '',
        post_nominal_letters: employee?.last_education?.post_nominal_letters,
        degree_certificate_date: employee?.last_education?.degree_certificate_date,
        degree_certificate_file: employee?.last_education?.degree_certificate_file,
        degree_certificate_file_url: employee?.last_education?.degree_certificate_file_url,
    });
    const steps = [
        { id: 1, label: t('Employee Data') },
        { id: 2, label: t('Position Data') },
        { id: 3, label: t('Rank Data') },
        { id: 4, label: t('Last Education Data') }
    ];

    const stepRoutes = {
        1: "master-data.employees.store.employee-data",
        2: "master-data.employees.store.position-data",
        3: "master-data.employees.store.rank-data",
        4: "master-data.employees.store"
    };

    const handleNextOrSubmit = () => {
        const routeName = stepRoutes[currentStep];
        post(route(routeName), {
            onSuccess: (page) => {
                if (currentStep < steps.length) {
                    setCurrentStep(currentStep + 1);
                } else {
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) notifyError(error, 'bottom-center');
                    notifySuccess(success, 'bottom-center');
                    onSuccess?.();
                }
            },
            onError: (errors) => {

            }
        });
    };

    return (
        <>
            <div className="form-wizard">
                <form>
                    <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>
                        {/* Step */}
                        <ul className="list-unstyled form-wizard-list style-two d-flex flex-nowrap">
                            {steps.map((step, index) => {
                                return (

                                    <li key={step.id}
                                        className={`form-wizard-list__item ${index + 1 < currentStep ? "activated" : ""} ${currentStep === index + 1 ? "active" : ""}`}
                                    >
                                        <div className="form-wizard-list__line">
                                            <span className="count">{index + 1}</span>
                                        </div>
                                        <span className="text text-xs fw-semibold">
                                            {step.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {/* Field */}
                    {steps.map((step, index) => {
                        return (
                            <fieldset key={step.id} className={`wizard-fieldset ${currentStep === index + 1 ? "show" : ""}`}>
                                {currentStep === 1 && <EmployeeDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />}
                                {currentStep === 2 && <PositionDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} positions={positions} ranks={ranks} grades={grades} />}
                                {currentStep === 3 && <RankDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} ranks={ranks} grades={grades} />}
                                {currentStep === 4 && <LastEducationDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />}
                            </fieldset>
                        )

                    })}
                </form>
            </div>
            <div className="form-group text-end mt-20">
                <Button
                    type="button"
                    onClick={closeModal}
                    className="btn btn-danger me-2"
                    isLoading={processing}
                >
                    {t('Cancel')}
                </Button>
                {currentStep > 1 && (
                    <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn btn-secondary me-2"
                        disabled={processing}
                    >
                        {t('Previous')}
                    </Button>
                )}

                <Button
                    type="button"
                    onClick={handleNextOrSubmit}
                    className="btn btn-primary"
                    isLoading={processing}
                >
                    {currentStep === steps.length ? t('Save') : t('Next')}
                </Button>

            </div>
        </>
    )
};