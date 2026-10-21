export const createOrderByObj = (sortQueryObj = "createdAt") => {
  const sorted = sortQueryObj.split(",")
  .reduce((acc, field) => {
    const isDesc = field.startsWith("-");
    const cleanField = isDesc ? field.substring(1) : field;
    acc[cleanField] = isDesc ? 'desc' : 'asc'
    return acc;
  }, {});

  console.log("Sorted object?")
  console.log(sorted);
  return sorted
}

export const createPrismaOrderByObjectArray = (sortQueryObj = "createdAt") => {
  const sorted = sortQueryObj.split(",")
  .map(field => {
    const isDesc = field.startsWith("-");
    const cleanField = isDesc ? field.substring(1) : field;
    return { [cleanField]: isDesc ? "desc" : "asc" }
  })
  console.log("Sorted object?")
  console.log(sorted);
  return sorted
}