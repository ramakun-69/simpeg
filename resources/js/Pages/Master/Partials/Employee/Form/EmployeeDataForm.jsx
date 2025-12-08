import { useTranslation } from "react-i18next";
import TextInput from "../../../../../src/components/ui/TextInput";
import TextAreaInput from "../../../../../src/components/ui/TextAreaInput";
import Select from 'react-select';
import ErrorMessage from "../../../../../src/components/ui/ErrorMessage";

export default function EmployeeDataForm({ data, setData, errors, setError, clearErrors }) {
    const { t } = useTranslation();
    const gender = [
        { value: 'Male', label: t('Male') },
        { value: 'Female', label: t('Female') },
    ];
    const employeType = [
        { value: 'PNS', label: t('PNS') },
        { value: 'PPPK', label: t('PPPK') },
    ];
    const division = [
        { value: "Sekretariat", label: t("Secretariat") },
        { value: "Irban 1", label: t("Irban 1") },
        { value: "Irban 2", label: t("Irban 2") },
        { value: "Irban 3", label: t("Irban 3") },
        { value: "Irban 4", label: t("Irban 4") },
        { value: "Irban 5", label: t("Irban 5") },
    ];
    return (
        <>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="name" className="form-label">{t('Name')}</label>
                    <TextInput
                        id="name"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Name') })}
                        value={data?.name}
                        errorMessage={errors?.name} />
                </div>
                <div className="col-6">
                    <label htmlFor="nip" className="form-label">{t('NIP')}</label>
                    <TextInput
                        id="nip"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('nip', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('NIP') })}
                        value={data?.nip}
                        errorMessage={errors?.nip} />
                </div>

            </div>
            <div className="row mb-3">
                <div className="col-4">
                    <label htmlFor="email" className="form-label">{t('Email')}</label>
                    <TextInput
                        id="email"
                        type="email"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Email') })}
                        value={data?.email}
                        errorMessage={errors?.email} />
                </div>
                <div className="col-4">
                    <label htmlFor="phone" className="form-label">{t('Phone')}</label>
                    <TextInput
                        id="phone"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Phone') })}
                        value={data?.phone}
                        errorMessage={errors?.phone} />
                </div>
                <div className="col-4">
                    <label htmlFor="gender" className="form-label">{t('Gender')}</label>
                    <Select
                        options={gender}
                        onChange={(option) => {
                            clearErrors('gender');
                            setData('gender', option ? option.value : '');
                        }}
                        placeholder={t('Select Gender')}
                        isSearchable={true}
                        isClearable={true}
                        classNames={{
                            control: (state) =>
                                `react-select__control ${errors.gender ? "is-invalid" : ""}`
                        }}
                        value={
                            gender.find(option => option.value === data.gender) || null
                        }
                    />
                    {errors.gender && <ErrorMessage message={errors.gender} />}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="born-place" className="form-label">{t('Born Place')}</label>
                    <TextInput
                        id="born-place"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('born_place', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Born Place') })}
                        value={data?.born_place}
                        errorMessage={errors?.born_place} />
                </div>
                <div className="col-6">
                    <label htmlFor="born-date" className="form-label">{t('Born Date')}</label>
                    <TextInput
                        id="born-date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('born_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Born Date') })}
                        value={data?.born_date}
                        errorMessage={errors?.born_date} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="employee-type" className="form-label">{t('Employee Type')}</label>
                    <Select
                        options={employeType}
                        onChange={(option) => {
                            clearErrors('employee_type');
                            setData('employee_type', option ? option.value : '');
                        }}
                        placeholder={t('Select Employee Type')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            employeType.find(option => option.value === data.employee_type) || null
                        }
                    />
                    {errors.employee_type && <ErrorMessage message={errors.employee_type} />}
                </div>
                <div className="col-6">
                    <label htmlFor="division" className="form-label">{t('Division')}</label>
                    <Select
                        options={division}
                        onChange={(option) => {
                            clearErrors('division');
                            console.log(option);

                            setData('division', option ? option.value : '');
                        }}
                        placeholder={t('Select Division')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            division.find(option => option.value === data.division) || null
                        }
                    />
                    {errors.division && <ErrorMessage message={errors.division} />}
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12">
                    <label htmlFor="address" className="form-label">{t('Address')}</label>
                    <TextAreaInput
                        id="address"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Address') })}
                        value={data?.address}
                        errorMessage={errors?.address} />
                </div>
            </div>
        </>
    );
}