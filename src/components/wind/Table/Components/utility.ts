export const returnTrueValue = (val) => {
  if (val === undefined || val === null) {
    return " ";
  } else {
    return val;
  }
};

export const deepCopy = (val) => {
  return JSON.parse(JSON.stringify(val));
};
