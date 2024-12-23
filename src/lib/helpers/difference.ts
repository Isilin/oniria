export const difference = (newObj, origObj) => {
  const origObjKeyList = Object.keys(origObj),
    newObjKeyList = Object.keys(newObj);

  if (origObjKeyList?.length !== newObjKeyList?.length) {
    return;
  }

  if (
    Object.keys(origObj).filter((val) => !Object.keys(newObj).includes(val))
      ?.length
  ) {
    return;
  }

  return Object.entries(origObj).reduce(
    (acc, [key, value]) =>
      newObj[key] !== value ? { ...acc, ...{ [key]: newObj[key] } } : acc,
    [],
  );
};
