import dayjs from "dayjs";

export const convertNumberToCurrency = (num: number): number => {
    return parseFloat(num.toFixed(2));
}

export const convertToSunday = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

export const scaleDate = (date: number, scale: string): number => {
    switch (scale) {
        case 'day':
            return date;
        case 'week':
            return convertToSunday(new Date(date)).getTime();
        case 'month':
            return new Date(date).setDate(1);
        case 'year':
            return new Date(date).setMonth(0, 1);
        default:
            return date;
    }
}

export const dateFormatPretty = (value: any, dateFormat: string) => {
    return dayjs(value).format(dateFormat);
}
