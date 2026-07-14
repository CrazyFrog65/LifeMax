export const toMins = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const toTimeStr = (mins: number) => {
  let h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  if (h >= 24) h %= 24;
  if (h < 0) h = 24 + (h % 24);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const displayTime = (timeStr: string, useAmPm: boolean) => {
  if (timeStr === '00:00') return useAmPm ? '12:00 AM' : '24:00';
  if (!useAmPm) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? ' PM' : ' AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')}${suffix}`;
};
