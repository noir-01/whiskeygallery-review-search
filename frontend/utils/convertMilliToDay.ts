const convertMilliToDay = (date: number) => {
  const dateData = new Date(date);
  return `${dateData.getFullYear().toString().slice(-2)}-${(
    dateData.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${dateData.getDate().toString().padStart(2, "0")}`;
};

export default convertMilliToDay;
