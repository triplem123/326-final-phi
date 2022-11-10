import { saveAccountInfo, getAccountInfo, saveBoard, getSavedBoard } from "./database.js";

export function getAccountDetails(key) {
    const info = getAccountInfo(key);
    return info.length > 0 ? info : '';
}

export function saveAccountDetails(key, details) {
    saveAccountInfo(key, details);
}