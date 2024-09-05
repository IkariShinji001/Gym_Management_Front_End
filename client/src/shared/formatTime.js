export const formatTime = (timeToChange) => {
  const [date, time] = timeToChange.split(" ");

  // Tách thành phần ngày ra năm, tháng, ngày
  const [year, month, day] = date.split("-");

  // Tạo chuỗi mới theo định dạng mong muốn
  const formattedTime = `${time} ${day}-${month}-${year}`;

  return formattedTime;
};

export const getHour = (timeToChange) => {
  const [date, time] = timeToChange.split(" ");

  return time;
};

export const getDate = (timeToChange) => {
  const [date, time] = timeToChange.split(" ");

  // Tách thành phần ngày ra năm, tháng, ngày
  const [year, month, day] = date.split("-");

  // Tạo chuỗi mới theo định dạng mong muốn
  const formattedTime = `${day}-${month}-${year}`;

  return formattedTime;
};
