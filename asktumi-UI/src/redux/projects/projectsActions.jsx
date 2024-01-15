import axios from "../../services/axiosInterceptor";
import { message } from "antd";

export const getProjects = (params) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.get("/v1/bot/projects", params);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      dispatch({
        type: "SET_DATA",
        allProjects: response.data?.data?.results,
      });
      console.log(response);
      return response;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const addProject = (params) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    return await axios
      .post("/v1/bot/create", params)
      .then((response) => {
        dispatch({
          type: "SET_LOADING",
          loading: false,
        });
        dispatch({
          type: "ADD_PROJECT",
          project: response.data?.data,
        });
        message.success("Project created");
      })
      .catch((e) => {
        console.log(e.response.data.message, "error");
        // dispatch({
        //   type: "SET_ERROR",
        //   error: e.response.data.message,
        // });
        dispatch({
          type: "SET_LOADING",
          loading: false,
        });
        message.error(e.response.data.message);
        return false;
      });
  };
};

export const getTranslation = (params) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.post(
        "/v1/bot/get-translate-content",
        params
      );
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const getSummary = (params) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.post(
        "/v1/bot/get-summarize-content",
        params
      );
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const markFav = (params) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.post("/v1/bot/save-as-favourite", params);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const getHistory = (params) => {
  return async (dispatch) => {
    const { favourites, time, page } = params;
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios
        // .get(`/v1/bot/get-workspaces`)
        .get(
          `/v1/bot/get-workspaces?sortBy=createdAt:desc&isFavourite=${favourites}&filter=${time}&limit=5&page=${page}`
        );
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const deleteWorkspace = (params) => {
  return async (dispatch) => {
    const { id } = params;
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.delete(`/v1/bot/delete-workspace/${id}`);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};

export const removeFromFavourites = (params) => {
  return async (dispatch) => {
    const { id } = params;
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });

    try {
      const response = await axios.post(
        `/v1/bot/remove-from-favourite/${id}`,
        params
      );
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
      return response?.data;
    } catch (e) {
      message.error(e?.response?.data?.message);
      dispatch({
        type: "SET_LOADING",
        loading: false,
      });
    }
  };
};
