import config from '../constants/config.json';

export default function getValueOfEventType(eventType) {
    let tempList = [];
    if (eventType === "Hằng ngày") {
        tempList = [];
    }
    if (eventType === "Hằng tuần") {
        tempList = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    }
    if (eventType === "Hằng tháng") {
        for (let i = 0; i < 31; i++) {
            tempList = tempList.concat("Ngày " + (i + 1));
        }
    }
    if (eventType === "Hằng năm") {
        for (let i = 0; i < 12; i++) {
            tempList = tempList.concat("Tháng " + (i + 1));
        }
    }
    return tempList;
}
