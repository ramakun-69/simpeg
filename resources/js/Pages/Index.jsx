import { usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import AppLayout from "../Layouts/AppLayout";
import Breadcrumb from "../src/components/ui/Breadcrumb";
import { Icon } from "@iconify/react/dist/iconify.js";
import Chart from "react-apexcharts";

export default function Index() {
    const { t } = useTranslation();
    const { users, divisionCounts, genderCounts, gradeCounts } = usePage().props;

    const createPieOptions = (labels) => ({
        labels: labels.map(label => t(label)),
        legend: { position: "bottom" },
        chart: { id: "pie-chart" },
        dataLabels: {
            formatter: (val, opts) => {
                const seriesIndex = opts.seriesIndex;
                const value = opts.w.globals.series[seriesIndex];
                return value; // tampilkan jumlah, bukan persen
            }
        },
        tooltip: {
            y: {
                formatter: (val) => val // tooltip juga pakai jumlah
            }
        },
        responsive: [{
            breakpoint: 480,
            options: { chart: { width: 300 }, legend: { position: "bottom" } }
        }]
    });


    return (
        <AppLayout>
            <Breadcrumb title={t("Dashboard")} />

            <div className="row row-cols-xxxl-3 row-cols-lg-2 row-cols-sm-1 gy-4 mb-50">

                {/* Total Users */}
                <div className="col">
                    <div className="card shadow-none border bg-gradient-start-1 h-100">
                        <div className="card-body p-20">
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                <div>
                                    <p className="fw-medium text-primary-light mb-1">{t("Total Users")}</p>
                                    <h6 className="mb-0">{`${users.length} ${t("Users")}`}</h6>
                                </div>
                                <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                                    <Icon icon="gridicons:multiple-users" className="text-white text-2xl mb-0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row row-cols-xxxl-3 row-cols-lg-2 row-cols-sm-1 gy-4">
                {/* Pie Chart: Division */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>{t("Rekapitulation Per Division")}</h6>
                            <Chart
                                options={createPieOptions(Object.keys(divisionCounts))}
                                series={Object.values(divisionCounts)}
                                type="donut"
                                height={300}
                            />
                        </div>
                    </div>
                </div>

                {/* Pie Chart: Gender */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>{t("Rekapitulation Per Gender")}</h6>
                            <Chart
                                options={createPieOptions(Object.keys(genderCounts))}
                                series={Object.values(genderCounts)}
                                type="donut"
                                height={300}
                            />
                        </div>
                    </div>
                </div>

                {/* Pie Chart: Grade / Golongan */}
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6>{t("Rekapitulation Per Grade")}</h6>
                            <Chart
                                options={createPieOptions(Object.keys(gradeCounts))}
                                series={Object.values(gradeCounts)}
                                type="donut"
                                height={300}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
