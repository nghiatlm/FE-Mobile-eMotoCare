let _confirmationResult: any = null;

export const setConfirmation = (c: any) => {
  _confirmationResult = c;
};

export const getConfirmation = () => _confirmationResult;

export const clearConfirmation = () => {
  _confirmationResult = null;
};
