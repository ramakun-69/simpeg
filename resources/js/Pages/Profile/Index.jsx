import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppLayout from "../../Layouts/AppLayout";
import Button from "../../src/components/ui/Button";
import TextInput from "../../src/components/ui/TextInput";
import { notifyError, notifySuccess } from "../../src/components/ui/Toastify";
import EmployeeDataForm from "../Master/Partials/Employee/Form/EmployeeDataForm";
import RankHistory from "../Master/Partials/Employee/Detail/RankHistory";
import PositionHistory from "../Master/Partials/Employee/Detail/PositionHistory";
import EducationHistory from "../Master/Partials/Employee/Detail/EducationHistory";
import TrainingHistory from "../Master/Partials/Employee/Detail/TrainingHistory";
import Modal from "../../src/components/ui/Modal";
import Select from 'react-select';
import ErrorMessage from "../../src/components/ui/ErrorMessage";

export default function Index({ employee, positions, ranks, grades }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [imagePreview, setImagePreview] = useState(employee?.user?.photo_url);
    const [activeTab, setActiveTab] = useState("summary");
    const [modal, setModal] = useState({
        show: false,
        title: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    }

    const { data, setData, post, put, processing, errors, setError, reset, transform, clearErrors } = useForm({
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
        password: "",
        password_confirmation: "",
        status_reason: "",
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target.result);
            };
            reader.readAsDataURL(file);
            transform((data) => ({
                user_id: employee?.user_id,
                photo: file,
            }));
            post(route('master-data.employees.change-photo'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const error = page.props?.flash?.error;
                    const success = page.props?.flash?.success;
                    if (error) notifyError(error, 'bottom-center');
                    notifySuccess(success, 'bottom-center');

                },
                onError: (error) => {
                    notifyError(error, 'bottom-center')
                }
            });
        }
    };
    const isOwnProfile = auth.user.id === employee.user_id;
    const isActive = employee?.status === "Active";
    const handleStatusChange = (e) => {
        if (isActive) {
            setModal({
                show: true,
                title: t('Enter Attribute', { attribute: t('Reason') }),
            });
        } else {
            handleSubmitStatusChange("Active");
        }
    };

    const handleCloseModal = () => {
        setModal({
            show: false
        });
        reset();
    }

    const handleSubmitStatusChange = (status) => {
        transform(data => ({
            ...data,
            status: status,
        }))
        post(route('master-data.employees.change-status'), {
            preserveScroll: true,
            onSuccess: (page) => {
                const error = page.props?.flash?.error;
                const success = page.props?.flash?.success;
                handleCloseModal();
                if (error) notifyError(error, 'bottom-center');
                notifySuccess(success, 'bottom-center');

            },
            onError: (error) => {
                notifyError(error, 'bottom-center')
            }
        })
    }
    const reasonStatus = ['Retired', 'Transfer', 'Honorable Discharge', 'Dishonorable Discharge'];

    return (
        <AppLayout>
            <div className="row gy-4">
                <div className="col-lg-12">
                    <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                        <div className="pb-24 ms-16 mb-24 me-16 mt-20">
                            <div className="text-center border border-top-0 border-start-0 border-end-0">
                                {/* Upload Image Start */}
                                <div className="mb-24 mt-16 d-flex justify-content-center">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <TextInput
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={(e) => handleImageChange(e)}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                            >
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: `url(${imagePreview})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Upload Image End */}
                                <h6 className="mb-0 mt-16">{employee?.name}</h6>
                                <span className={`badge bg-${employee?.status == 'Active' ? 'success' : 'danger'} mb-20`}>{t(employee?.status)}</span>
                                {auth.role.some(r => ["Administrator", "Superadmin"].includes(r)) && (
                                    <div className="mb-3">
                                        <Button
                                            type="button"
                                            onClick={handleStatusChange}
                                            isLoading={processing}
                                            className={`btn btn-sm border ${isActive ? "btn-danger" : "btn-success"
                                                }`}
                                        >
                                            <Icon icon="ic:baseline-power-settings-new" className="me-2 " width="20" height="20" />  {isActive ? t("Deactivate") : t("Activate")}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-24">
                                <h6 className="text-xl mb-16">{t('Employee Info')}</h6>
                                <ul>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Name')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.name}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Email')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.user?.email}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Phone')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.phone || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Division')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.division || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Position')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.position?.name || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Rank')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.rank?.name || '-'}
                                        </span>
                                    </li>
                                    <li className="d-flex align-items-center gap-1 mb-12">
                                        <span className="w-30 text-md fw-semibold text-primary-light">
                                            {t('Grade')}
                                        </span>
                                        <span className="w-70 text-secondary-light fw-medium">
                                            : {employee?.grade?.name || '-'}
                                        </span>
                                    </li>
                                    {!isActive && (
                                        <li className="d-flex align-items-center gap-1 mb-12">
                                            <span className="w-30 text-md fw-semibold text-primary-light">
                                                {t('Reason Disabled')}
                                            </span>
                                            <span className="w-70 text-secondary-light fw-medium">
                                                : {t(employee?.status_reason)}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card */}
                <div className="col-lg-12">
                    <div className="card h-100">
                        <div className="card-body p-24">
                            <ul
                                className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className={`nav-link px-24 ${activeTab === "summary" && "active"}`}
                                        id="pills-summary-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-summary"
                                        role="tab"
                                        aria-controls="pills-summary"
                                        aria-selected="true"
                                        onClick={() => setActiveTab("summary")}
                                    >
                                        {t('Summary')}
                                    </Button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className="nav-link d-flex align-items-center px-24"
                                        id="pills-position-history-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-position-history"
                                        role="tab"
                                        aria-controls="pills-position-history"
                                        aria-selected="false"
                                        onClick={() => setActiveTab("position-history")}

                                        tabIndex={-1}
                                    >
                                        {t('Position History')}
                                    </Button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className="nav-link d-flex align-items-center px-24"
                                        id="pills-rank-history-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-rank-history"
                                        role="tab"
                                        aria-controls="pills-rank-history"
                                        aria-selected="false"
                                        onClick={() => setActiveTab("rank-history")}

                                        tabIndex={-1}
                                    >
                                        {t('Rank History')}
                                    </Button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className="nav-link d-flex align-items-center px-24"
                                        id="pills-education-history-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-education-history"
                                        role="tab"
                                        aria-controls="pills-education-history"
                                        aria-selected="false"
                                        onClick={() => setActiveTab("education-history")}

                                        tabIndex={-1}
                                    >
                                        {t('Education History')}
                                    </Button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <Button
                                        type="button"
                                        className="nav-link d-flex align-items-center px-24"
                                        id="pills-training-history-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#pills-training-history"
                                        role="tab"
                                        aria-controls="pills-training-history"
                                        aria-selected="false"
                                        onClick={() => setActiveTab("training-history")}

                                        tabIndex={-1}
                                    >
                                        {t('Training History')}
                                    </Button>
                                </li>
                                {isOwnProfile && (
                                    <li className="nav-item" role="presentation">
                                        <Button
                                            className="nav-link d-flex align-items-center px-24"
                                            id="pills-change-password-tab"
                                            data-bs-toggle="pill"
                                            data-bs-target="#pills-change-password"
                                            type="button"
                                            role="tab"
                                            aria-controls="pills-change-password"
                                            aria-selected="false"
                                            onClick={() => setActiveTab("change-password")}
                                            tabIndex={-1}
                                        >
                                            {t('Change Password')}
                                        </Button>
                                    </li>
                                )}
                            </ul>


                            {/* Employee */}
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-summary"
                                    role="tabpanel"
                                    aria-labelledby="pills-summary-tab"
                                    tabIndex={0}
                                >
                                    <div className="row">
                                        <EmployeeDataForm data={data} setData={setData} errors={errors} setError={setError} clearErrors={clearErrors} />

                                    </div>
                                </div>

                            </div>

                            {/* Position History */}
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade"
                                    id="pills-position-history"
                                    role="tabpanel"
                                    aria-labelledby="pills-position-history-tab"
                                    tabIndex={0}
                                >
                                    <div className="row">
                                        <PositionHistory positions={positions} employee={employee} />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade"
                                    id="pills-rank-history"
                                    role="tabpanel"
                                    aria-labelledby="pills-rank-history-tab"
                                    tabIndex={0}
                                >
                                    <div className="row">
                                        <RankHistory ranks={ranks} grades={grades} employee={employee} />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade"
                                    id="pills-education-history"
                                    role="tabpanel"
                                    aria-labelledby="pills-education-history-tab"
                                    tabIndex={0}
                                >
                                    <div className="row">
                                        <EducationHistory employee={employee} />
                                    </div>
                                </div>
                            </div>
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade"
                                    id="pills-training-history"
                                    role="tabpanel"
                                    aria-labelledby="pills-training-history-tab"
                                    tabIndex={0}
                                >
                                    <div className="row">
                                        <TrainingHistory employee={employee} />
                                    </div>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade" id="pills-change-password" role="tabpanel" aria-labelledby="pills-change-password-tab" tabIndex="0">
                                    <div className="mb-20">
                                        <label htmlFor="your-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            {t('New Password')} <span className="text-danger-600">*</span>
                                        </label>
                                        <div className='has-validation mb-16'>
                                            <div className='icon-field form-group'>
                                                <span className='icon mt-2'>
                                                    <Icon icon='solar:lock-password-outline' />
                                                </span>
                                                <TextInput
                                                    type={passwordVisible ? 'text' : 'password'}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className='bg-neutral-50 radius-12'
                                                    id='password'
                                                    placeholder={t('Password')}
                                                    autoComplete="off"
                                                    errorMessage={errors.password}
                                                    value={data?.password}
                                                />
                                                <span
                                                    className={`toggle-password cursor-pointer position-absolute end-0 translate-middle-y ${errors.password ? 'me-32' : 'me-16'} text-secondary-light`}
                                                    style={{ top: errors.password ? '28%' : '45%' }}
                                                    data-toggle='password' onClick={togglePasswordVisibility}
                                                >
                                                    <Icon icon={passwordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-20">
                                        <label htmlFor="confirm-password" className="form-label fw-semibold text-primary-light text-sm mb-8">
                                            {t('Confirm Password')} <span className="text-danger-600">*</span>
                                        </label>

                                        <div className='has-validation mb-16'>
                                            <div className='icon-field form-group'>
                                                <span className='icon mt-2'>
                                                    <Icon icon='solar:lock-password-outline' />
                                                </span>
                                                <TextInput
                                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className='bg-neutral-50 radius-12'
                                                    id='password_confirmation'
                                                    value={data?.password_confirmation}
                                                    placeholder={t('Confirm Password')}
                                                    autoComplete="off"
                                                    errorMessage={errors.password_confirmation}
                                                />
                                                <span
                                                    className={`cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light ${errors.password_confirmation ? 'me-32' : 'me-16'} text-secondary-light`}
                                                    style={{ top: errors.password_confirmation ? '28%' : '45%' }}
                                                    data-toggle='password' onClick={toggleConfirmPasswordVisibility}
                                                >
                                                    <Icon icon={confirmPasswordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} width="20" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-start justify-content-start gap-3">
                                {(activeTab === "summary" || activeTab === "change-password") && (
                                    <Button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            transform((data) => ({
                                                ...data,
                                                _method: 'PUT',
                                            }));
                                            put(route('master-data.employees.update', employee.id), {
                                                onSuccess: (page) => {
                                                    const error = page.props?.flash?.error;
                                                    const success = page.props?.flash?.success;
                                                    if (error) notifyError(error, 'bottom-center');
                                                    notifySuccess(success, 'bottom-center');
                                                    reset('password', 'password_confirmation', 'photo');

                                                },
                                            });
                                        }}
                                        isLoading={processing}
                                        className="btn btn-primary btn-sm border border-primary-600 "
                                    >
                                        {t('Save')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Moadal */}
            <Modal
                show={modal.show}
                title={modal.title}
                size="md"
                fullscreen={false}
                hideFooter={false}
                onClose={handleCloseModal}
                onSave={() => handleSubmitStatusChange("Inactive")}
                processing={processing}
            >
                <Select
                    options={reasonStatus.map(rs => ({
                        value: rs,
                        label: t(rs)
                    }))}
                    onChange={(option) => {
                        clearErrors('status_reason');
                        setData('status_reason', option ? option.value : '');
                    }}
                    placeholder={t('Select Reason')}
                    isSearchable={true}
                    isClearable={true}
                    value={
                        reasonStatus
                            .map(rs => ({ value: rs, label: t(rs) }))
                            .find(option => option.value === data.status_reason) || null
                    }
                />
                {errors.status_reason && <ErrorMessage message={errors.status_reason} />}
            </Modal>
        </AppLayout >
    );
}