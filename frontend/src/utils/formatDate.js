import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { enIN } from 'date-fns/locale';

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  
  if (isToday(d)) {
    return `Today at ${format(d, 'hh:mm a', { locale: enIN })}`;
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'hh:mm a', { locale: enIN })}`;
  }
  
  return format(d, 'dd MMM yyyy', { locale: enIN });
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: enIN });
};
