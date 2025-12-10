export const sex = (data: string) => {
  switch (data) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    default:
      return "Khác";
  }
};
