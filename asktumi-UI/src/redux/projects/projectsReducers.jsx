const initialState = {
  data: null,
  loading: false,
  allProjects: [],
  project: {},
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        allProjects: action.allProjects,
      };
    case "ADD_PROJECT":
      return {
        ...state,
        allProjects: [...state.allProjects, action.project],
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };

    case "SET_ERROR":
      return { ...state, error: action.error };

    case "SET_MESSAGE":
      return { ...state, message: action.message };

    default:
      return { ...state };
  }
};

export default projectReducer;
