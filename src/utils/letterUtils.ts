export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export function getTodayIndonesianDate(): string {
  const d = new Date();
  const day = d.getDate();
  const monthName = INDONESIAN_MONTHS[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function generateLetterNumber(prefix = '421.2', code = 'SDN-CBR'): string {
  const randNum = Math.floor(Math.random() * 800) + 100;
  const currentYear = new Date().getFullYear();
  return `${prefix}/${String(randNum).padStart(3, '0')}/${code}/${currentYear}`;
}
