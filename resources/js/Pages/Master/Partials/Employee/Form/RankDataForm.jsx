import { useTranslation } from "react-i18next";
import TextInput from "../../../../../src/components/ui/TextInput";
import Select from 'react-select';
import SingleFileUpload from '../../../../../src/components/ui/SingleFileUpload';
import ErrorMessage from "../../../../../src/components/ui/ErrorMessage";

export default function RankDataForm({ data, setData, errors, setError, clearErrors, ranks, grades }) {
    const { t } = useTranslation();

    return (
        <>
            {/* Rank */}
            <div className="row mb-3">
                <div className="col-6">
                    <label htmlFor="rank" className="form-label">{t('Rank')}</label>
                    <Select
                        options={ranks}
                        getOptionLabel={(rank) => rank.name}
                        getOptionValue={(rank) => rank.id}
                        onChange={(option) => {
                            clearErrors('rank_id');
                            setData('rank_id', option ? option.id : '');
                        }}
                        placeholder={t('Select Rank')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            ranks.find(option => option.id === data.rank_id) || null
                        }
                    />
                    {errors.rank_id && <ErrorMessage message={errors.rank_id} />}
                </div>
                <div className="col-6">
                    <label htmlFor="rank" className="form-label">{t('Grade')}</label>
                    <Select
                        options={grades}
                        getOptionLabel={(grade) => grade.name}
                        getOptionValue={(grade) => grade.id}
                        onChange={(option) => {
                            clearErrors('grade_id');
                            setData('grade_id', option ? option.id : '');
                        }}
                        placeholder={t('Select Grade')}
                        isSearchable={true}
                        isClearable={true}
                        value={
                            grades.find(option => option.id === data.grade_id) || null
                        }
                    />
                    {errors.grade_id && <ErrorMessage message={errors.grade_id} />}
                </div>

            </div>
            <div className="row mb-3">
                <div className="col-4">
                    <label htmlFor="rank_appointment_date" className="form-label">{t('Appointment Date')}</label>
                    <TextInput
                        id="rank_appointment_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('rank_appointment_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('Appointment Date') })}
                        value={data?.rank_appointment_date}
                        errorMessage={errors?.rank_appointment_date} />
                </div>
                <div className="col-4">
                    <label htmlFor="rank_sk_number" className="form-label">{t('SK Number')}</label>
                    <TextInput
                        id="rank_sk_number"
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('rank_sk_number', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('SK Number') })}
                        value={data?.rank_sk_number}
                        errorMessage={errors?.rank_sk_number} />
                </div>
                <div className="col-4">
                    <label htmlFor="rank_sk_date" className="form-label">{t('SK Date')}</label>
                    <TextInput
                        id="rank_sk_date"
                        type="date"
                        className="form-control"
                        autoComplete="off"
                        onChange={(e) => setData('rank_sk_date', e.target.value)}
                        placeholder={t('Enter Attribute', { 'attribute': t('SK Date') })}
                        value={data?.rank_sk_date}
                        errorMessage={errors?.rank_sk_date} />
                </div>
            </div>
            <div className="row-mb-3">
                <div className="col-12">
                    <label htmlFor="rank_sk_file" className="form-label">{t('SK File')}</label>
                    <SingleFileUpload
                        id="rank_sk_file"
                        label={t('Upload File')}
                        initialFileUrl={data.rank_sk_file_url}
                        onFileChange={(file) => {
                            clearErrors('rank_sk_file')
                            setData('rank_sk_file', file)
                        }}
                        onFileRemove={() => setData('rank_sk_file', null)}
                        allowedFileTypes={['application/pdf']}
                        height={300}
                    />
                    {errors.rank_sk_file && <ErrorMessage message={errors.rank_sk_file} />}
                </div>
            </div>
        </>
    );
}