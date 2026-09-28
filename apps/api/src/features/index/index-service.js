import * as indexQueries from "./index-queries.js";

export const getWelcomeMessage = async() => {
  try {
    return { message: "Welcome to api/v1 index service layer"};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getSampleUser = async () => {
  try {
    const user = await indexQueries.fetchSampleUser();
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}