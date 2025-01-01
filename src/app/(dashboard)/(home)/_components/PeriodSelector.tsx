"use client";

import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent
} from '@/components/ui/select';
import { Period } from '@/types/analytics';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export function PeriodSelector({
  periods,
  selectedPeriod }: {
    periods: Period[],
    selectedPeriod: Period
  }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      onValueChange={(value) => {

        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams)
        params.set("month", month);
        params.set("year", year)
        router.push(`?${params.toString()}`);
      }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period, index) => (
          <SelectItem key={index} value={`${period.month}-${period.year}`}>
            {`${MONTH_NAMES[period.month]} ${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default PeriodSelector;
