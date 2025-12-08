import { useTranslation } from "react-i18next";
import TextInput from "../../../../../src/components/ui/TextInput";
import Select from 'react-select';
import SingleFileUpload from '../../../../../src/components/ui/SingleFileUpload';
import ErrorMessage from "../../../../../src/components/ui/ErrorMessage";

export default function PositionDataForm({ data, setData, errors, setError, clearErrors, positions }) {
    const { t } = useTranslation();

    return (
        <>
            {/* Position */}
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="position" className="form-label">{t('Position')}</label>
                    <Select
                        options={positions}
                        getOptionLabel={(position) => position.name}
                        getOptionValue={(position) => position.id}
                        onChange={(option) => {
                            clearErrors('position_id');
                            setData('position_id', option ? option.id : '');
                        }}
                        placeholder={t('Select Position')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            positions.find(option => option.id === data?.position_id) || null
                        }
                    />
                    {errors?.position_id && <ErrorMessage message={errors?.position_id} />}
                </div>
                <div className="col-6">
                    <label htmlFor="position_appointment_date" className="form-label">{t('Appointment Date')}</label>
                    <TextInput
                        id="position_appointment_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('position_appointment_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Appointment Date') })}
                        value={data?.position_appointment_date}
                        errorMessage={errors?.position_appointment_date} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="position_sk_number" className="form-label">{t('SK Number')}</label>
                    <TextInput
                        id="position_sk_number"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('position_sk_number', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('SK Number') })}
                        value={data?.position_sk_number}
                        errorMessage={errors?.position_sk_number} />
                </div>
                <div className="col-6">
                    <label htmlFor="position_sk_date" className="form-label">{t('SK Date')}</label>
                    <TextInput
                        id="position_sk_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('position_sk_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('SK Date') })}
                        value={data?.position_sk_date}
                        errorMessage={errors?.position_sk_date} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-12">
                    <label htmlFor="position_sk_file" className="form-label">{t('SK File')}</label>
                    <SingleFileUpload
                        id="position_sk_file"
                        label={t('Upload File')}
                        initialFileUrl={data?.position_sk_file_url}
                        onFileChange={(file) => {
                            clearErrors('position_sk_file');
                            setData('position_sk_file', file)
                        }}
                        onFileRemove={() => setData('position_sk_file', null)}
                        allowedFileTypes={['application/pdf']}
                        height={300}
                    />
                    {errors?.position_sk_file && <ErrorMessage message={errors?.position_sk_file} />}
                </div>
            </div>
            {/* Rank */}
        </>
    );
}