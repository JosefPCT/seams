const preparePatchData = (payload) => {
  return Object.entries(payload).reduce((acc, [key, value]) => {
    if(value !== undefined){
      acc[key] = value;
    }
    return acc;
  }, {});
}

// Alternative

const preparePatchDataAlternative = (payload) => {
  Object.fromEntries(Object.entries(payload).filter(([_, val]) => val !== undefined));
}


export { preparePatchData, preparePatchDataAlternative}