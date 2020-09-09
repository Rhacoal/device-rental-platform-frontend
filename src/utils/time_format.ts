import moment from 'moment';

/**
 * 格式化时间.
 * @param timeStamp UTC 时间戳
 */
export function formatTime(timeStamp: number) {
    return moment(timeStamp * 1000).format("YYYY年M月D日 hh:mm:ss");
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