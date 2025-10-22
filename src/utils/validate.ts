export const Validate = {
  Phone: (phone: string) => {
    const regex = /^(0|\+84)[0-9]{9,10}$/;
    return regex.test(phone);
  },
  Password: (password: string) => {
    return password.length >= 5; // Tùy chỉnh thêm nếu cần
  },
};
