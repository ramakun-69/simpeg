<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;

class TrainingReport implements FromArray, WithHeadings, WithEvents, ShouldAutoSize
{
    protected Collection $employees;
    protected array $rows = [];
    protected array $merges = [];
    protected int $currentRow = 2;
    protected int $no = 1;

    public function __construct(Collection $employees)
    {
        $this->employees = $employees;
        $this->buildRows();
    }

    protected function buildRows(): void
    {
        foreach ($this->employees as $employee) {
            $employeeStartRow = $this->currentRow;

            $grouped = $employee->trainingHistories
                ->groupBy('issuing_institution');

            foreach ($grouped as $institution => $trainings) {
                $institutionStartRow = $this->currentRow;

                foreach ($trainings as $training) {
                    $this->rows[] = [
                        $this->no,
                        $employee->nip,
                        $employee->name,
                        $institution,
                        '- ' . $training->training_name,
                    ];
                    $this->currentRow++;
                }

                if ($trainings->count() > 1) {
                    $this->merges[] = "D{$institutionStartRow}:D" . ($this->currentRow - 1);
                }
            }

            if ($this->currentRow - $employeeStartRow > 1) {
                $endRow = $this->currentRow - 1;
                $this->merges[] = "A{$employeeStartRow}:A{$endRow}";
                $this->merges[] = "B{$employeeStartRow}:B{$endRow}";
                $this->merges[] = "C{$employeeStartRow}:C{$endRow}";
            }

            $this->no++;
        }
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return [
            'No',
            __('NIP'),
            __('Name'),
            __('Issuing Institution'),
            __('Training Name'),
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                foreach ($this->merges as $merge) {
                    $event->sheet->mergeCells($merge);
                }

                $event->sheet->getStyle('A1:E1')->getFont()->setBold(true);
                $event->sheet->getStyle('A1:E' . ($this->currentRow - 1))
                    ->getAlignment()
                    ->setVertical('center');
            },
        ];
    }
}
