export const ability = (major, minor) => {
  const value = major + Math.min(major, minor);
  const margin = Math.trunc((Math.max(major, 50) - 50) / 5);

  let result = `${value}`;
  if (margin > 0) {
    result += ` / +${margin}`;
  }
  return result;
};
