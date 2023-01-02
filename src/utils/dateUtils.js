export const dateConversion = (currentDate, START_YEAR) => {
    const year = Math.floor(currentDate / 12) + START_YEAR;
    const month = currentDate % 12 + 1;
    const date = new Date(`${year}-${month}-01`);

    return date.toUTCString().slice(8, 16);
};

