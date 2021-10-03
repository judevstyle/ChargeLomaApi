export function getFolderDate() {
    const Year = pad((new Date()).getUTCFullYear(), 2)
    const Month = pad((new Date()).getUTCMonth()+1, 2)
    const Day = pad((new Date()).getDate(), 2)

    return `${Year}${Month}${Day}`
}

export function pad(num: number, size: number) {
    let numToString = num.toString();
    console.log();
    
    while (numToString.length < size) {
        numToString = "0" + numToString;
        console.log(numToString);
        
    }
    return numToString;
}
