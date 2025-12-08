import { useTranslation } from "react-i18next";
import TextInput from "../../../../../src/components/ui/TextInput";
import Select from 'react-select';
import SingleFileUpload from '../../../../../src/components/ui/SingleFileUpload';
import ErrorMessage from "../../../../../src/components/ui/ErrorMessage";

export default function LastEducationDataForm({ data, setData, errors, setError, clearErrors }) {
    const { t } = useTranslation();
    const educationProgram = ['D1', 'D2', 'D3', 'S1', 'S2', 'S3']
    return (
        <>
            {/* Rank */}
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="university_name" className="form-label">{t('University Name')}</label>
                    <TextInput
                        id="university_name"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('university_name', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('University Name') })}
                        value={data?.university_name}
                        errorMessage={errors?.university_name} />
                </div>
                <div className="col-6">
                    <label htmlFor="study_program" className="form-label">{t('Study Program')}</label>
                    <TextInput
                        id="study_program"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('study_program', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Study Program') })}
                        value={data?.study_program}
                        errorMessage={errors?.study_program} />
                </div>

            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="education_program" className="form-label">{t('Education Program')}</label>
                    <Select
                        options={educationProgram.map(ep => ({
                            value: ep,
                            label: ep
                        }))}
                        onChange={(option) => {
                            clearErrors('education_program');
                            setData('education_program', option ? option.value : '');
                        }}
                        placeholder={t('Select Education Program')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            educationProgram
                                .map(ep => ({ value: ep, label: ep }))
                                .find(option => option.value === data.education_program) || null
                        }
                    />
                    {errors.education_program && <ErrorMessage message={errors.education_program} />}
                </div>
                <div className="col-6">
                    <label htmlFor="degree_certificate_number" className="form-label">{t('Degree Certificate Number')}</label>
                    <TextInput
                        id="degree_certificate_number"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('degree_certificate_number', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Degree Certificate Number') })}
                        value={data?.degree_certificate_number}
                        errorMessage={errors?.degree_certificate_number} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-4">
                    <label htmlFor="degree_certificate_date" className="form-label">{t('Degree Certificate Date')}</label>
                    <TextInput
                        id="degree_certificate_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('degree_certificate_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Degree Certificate Date') })}
                        value={data?.degree_certificate_date}
                        errorMessage={errors?.degree_certificate_date} />
                </div>
                <div className="col-4">
                    <label htmlFor="honorific_title" className="form-label">{t('Honorific Title')}</label>
                    <TextInput
                        id="honorific_title"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('honorific_title', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Honorific Title') })}
                        value={data?.honorific_title}
                        errorMessage={errors?.honorific_title} />
                </div>
                <div className="col-4">
                    <label htmlFor="post_nominal_letters" className="form-label">{t('Post Nominal Letters')}</label>
                    <TextInput
                        id="post_nominal_letters"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('post_nominal_letters', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Post Nominal Letters') })}
                        value={data?.post_nominal_letters}
                        errorMessage={errors?.post_nominal_letters} />
                </div>
            </div>
            <div className="row-mb-3">
                <div className="col-12">
                    <label htmlFor="degree_certificate_file" className="form-label">{t('Degree Certificate File')}</label>
                    <SingleFileUpload
                        id="degree_certificate_file"
                        label={t('Upload File')}
                        initialFileUrl={data.degree_certificate_file_url}
                        onFileChange={(file) => {
                            clearErrors('degree_certificate_file')
                            setData('degree_certificate_file', file)
                        }}
                        onFileRemove={() => setData('degree_certificate_file', null)}
                        allowedFileTypes={['application/pdf']}
                        height={300}
                    />
                    {errors.degree_certificate_file && <ErrorMessage message={errors.degree_certificate_file} />}
                </div>
            </div>
        </>
    );
}