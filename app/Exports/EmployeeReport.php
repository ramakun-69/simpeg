<?php

namespace App\Exports;

use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EmployeeReport implements FromCollection, WithHeadings, WithTitle, WithStyles, ShouldAutoSize, WithEvents
{
    /**
     * @return \Illuminate\Support\Collection
     */
    protected $employees;

    public function __construct($employees)
    {
        $this->employees = $employees;
    }
    public function collection()
    {
        return $this->employees->map(fn($employee, $index) => [
            'No' => $index + 1,
            'NIP' => (string) $employee->nip,
            'Nama' => $employee->name,
            'Jenis Kelamin' => __($employee->gender),
            'Divisi' => $employee->division,
            'Jabatan' => $employee?->position?->name ?? '-',
            'Pangkat' => $employee?->rank?->name ?? '-',
        ]);
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:G1')->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'FFEFEFEF'],
            ],
        ]);
    }
    public function headings(): array
    {
        return [
            'No',
            __('NIP'),
            __('Name'),
            __('Gender'),
            __('Division'),
            __('Position'),
            __('Rank'),
        ];
    }

    public function title(): string
    {
        return __("Employee Report");
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $row = 2; // mulai baris kedua (baris 1 adalah heading)

                foreach ($this->employees as $employee) {
                    $event->sheet->getDelegate()->setCellValueExplicit(
                        "B{$row}",              // kolom NIP
                        (string) $employee->nip,
                        DataType::TYPE_STRING   // paksa jadi TEXT
                    );
                    $row++;
                }

                // border tetap
                $rowCount = $this->employees->count() + 1;
                $event->sheet->getStyle("A1:G{$rowCount}")
                    ->applyFromArray([
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN
                            ]
                        ]
                    ]);
            },
        ];
    }
}
