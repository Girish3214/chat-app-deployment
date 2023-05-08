import axios from "./baseAxios";

const postRequest = async (api, body) => {
  try {
    const response = await axios.post(api, body);

    return response.data;
  } catch (error) {
    console.log(error);
    return { error: true, msg: error?.response?.data?.msg ?? error?.message };
  }
};

const getRequest = async (api, body) => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: true, msg: error?.response?.data?.msg ?? error?.message };
  }
};

const deleteRequest = async (api, body) => {
  try {
    const response = await axios.delete(api, body);
    return response.data;
  } catch (error) {
    console.log(error);
    return { error: true, msg: error?.response?.data?.msg ?? error?.message };
  }
};

export { postRequest, getRequest, deleteRequest };
