let accountInfo = '{"Username":"testuser","Email-Address":"testemail@fakeaddress.com","Password":"password123","Number-of-Rooms-Created":"10","Number-of-Room-Layouts-Created":"7"}';
let savedBoard = "";
const accountKey = "abc123";

export function getAccountInfo(key) {
    if (key === "abc123") {
        if (window.localStorage.getItem('account_info') !== null) {
            return window.localStorage.getItem('account_info');
        } else {
            return accountInfo;
        }
    } 
    return '';
}

export function saveAccountInfo(key, info) {
    key === "abc123" ? accountInfo = info : null;
}

export function getSavedBoard() {
    return saveBoard;
}

export function saveBoard(board) {
    savedBoard = board;
}