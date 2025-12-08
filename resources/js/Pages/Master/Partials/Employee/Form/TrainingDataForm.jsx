import { useTranslation } from "react-i18next";
import TextInput from "../../../../../src/components/ui/TextInput";
import Select from 'react-select';
import SingleFileUpload from '../../../../../src/components/ui/SingleFileUpload';
import ErrorMessage from "../../../../../src/components/ui/ErrorMessage";
import { useState } from "react";

export default function TrainingDataForm({ data, setData, errors, setError, clearErrors }) {
    const { t } = useTranslation();
    const issuingInstitution = ['LKPP', 'Kemendagri', 'Other']
    const [isOther, setIsOther] = useState(false);
    return (
        <>
            {/* Training */}
            <div className="row mb-3">
                <div className="col-12">
                    <label htmlFor="training_name" className="form-label">{t('Training Name')}</label>
                    <TextInput
                        id="training_name"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('training_name', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Training Name') })}
                        value={data?.training_name}
                        errorMessage={errors?.training_name} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="issuing_institution" className="form-label">{t('Issuing Institution')}</label>
                    <Select
                        options={issuingInstitution.map(iss => ({
                            value: iss,
                            label: t(iss)
                        }))}
                        onChange={(option) => {
                            clearErrors('issuing_institution');
                            if (option?.value === 'Other') {
                                setIsOther(true);
                                setData('issuing_institution', '');
                            } else {
                                setIsOther(false);
                                setData('issuing_institution', option?.value || '');
                            }
                        }}
                        placeholder={t('Select Issuing Institution')}
                        isSearchable={true}
                        isClearable={true}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        value={
                            issuingInstitution
                                .map(ep => ({ value: ep, label: ep }))
                                .find(option => option.value === data.issuing_institution) || null
                        }
                    />
                    {errors.issuing_institution && <ErrorMessage message={errors.issuing_institution} />}
                </div>

                <div className="col-6">
                    <label htmlFor="issuing_institution" className="form-label"></label>
                    <TextInput
                        id="issuing_institution"
                        type="text"
                        className="form-control mt-2"
                        autoComplete="off"
                        disabled={!isOther}
                        placeholder={t('Enter Attribute', { 'attribute': t('Issuing Institution') })}
                        value={data.issuing_institution || ''}
                        onChange={(e) => setData('issuing_institution', e.target.value)}
                        errorMessage={errors?.issuing_institution}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="start_date" className="form-label">{t('Start Date')}</label>
                    <TextInput
                        id="start_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('start_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Start Date') })}
                        value={data?.start_date}
                        errorMessage={errors?.start_date} />
                </div>
                <div className="col-6">
                    <label htmlFor="end_date" className="form-label">{t('End Date')}</label>
                    <TextInput
                        id="end_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('end_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('End Date') })}
                        value={data?.end_date}
                        errorMessage={errors?.end_date} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-4">
                    <label htmlFor="certificate_number" className="form-label">{t('Certificate Number')}</label>
                    <TextInput
                        id="certificate_number"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('certificate_number', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Certificate Number') })}
                        value={data?.certificate_number}
                        errorMessage={errors?.certificate_number} />
                </div>
                <div className="col-4">
                    <label htmlFor="certificate_date" className="form-label">{t('Certificate Date')}</label>
                    <TextInput
                        id="certificate_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('certificate_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Certificate Date') })}
                        value={data?.certificate_date}
                        errorMessage={errors?.certificate_date} />
                </div>
                <div className="col-4">
                    <label htmlFor="training_hours" className="form-label">{t('Training Hours')}</label>
                    <TextInput
                        id="training_hours"
                        type="number"
                        className="form-control"
                        autoComplete="off"
                        min={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || Number(value) >= 0) {
                                setData('training_hours', value);
                            }
                        }}
                        placeholder={t('Enter Attribute', { 'attribute': t('Training Hours') })}
                        value={data?.training_hours}
                        errorMessage={errors?.training_hours} />
                </div>
            </div>
            <div className="row-mb-3">
                <div className="col-12">
                    <label htmlFor="training_certificate_file" className="form-label">{t('Training Certificate File')}</label>
                    <SingleFileUpload
                        id="training_certificate_file"
                        label={t('Upload File')}
                        initialFileUrl={data.training_certificate_file_url}
                        onFileChange={(file) => {
                            clearErrors('training_certificate_file')
                            setData('training_certificate_file', file)
                        }}
                        onFileRemove={() => setData('training_certificate_file', null)}
                        allowedFileTypes={['application/pdf']}
                        height={300}
                    />
                    {errors.training_certificate_file && <ErrorMessage message={errors.training_certificate_file} />}
                </div>
            </div>
        </>
    );
}