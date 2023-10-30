export const addDaysToDate = (date:Date, days:number) => {
    var ms = new Date().getTime() + 86400000 * days;
    let res = new Date(ms) 
    return res
}