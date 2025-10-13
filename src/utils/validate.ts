export class Validate {
  static Phone(phone: string) {
    if (/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(phone)) {
      return true;
    }
    return false;
  }

  static Password = (val: string) => {
    return val.length >= 6;
  };
}
