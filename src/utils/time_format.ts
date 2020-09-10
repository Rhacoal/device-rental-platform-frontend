import moment from 'moment';

/**
 * 格式化时间.
 * @param timeStamp UTC 时间戳
 */
export function formatTime(timeStamp: number) {
    return moment(timeStamp * 1000).format("YYYY年M月D日 hh:mm:ss");
}

/**
 * 短时间.
 * @param time
 */
export function toShortTimeString(time: number) {
    const t = moment(time * 1000);
    const today = moment();
    return t.format((t.date() === today.date() && t.month() === today.month() && t.year() === today.year())
        ? "HH:mm:ss" : "YYYY-MM-DD");
}

export function today() {
    return moment().format("YYYY/MM/DD");
}

export function nowTime() {
    return moment().format("hh:mm");
}

export function getTimeStamp(date: string, time: string): string {
    return moment(`${date} ${time}`, "YYYY/MM/DD hh:mm").format("X");
}