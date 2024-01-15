import { combineReducers } from "redux";

import customiseReducer from "./customise/customiseReducer";
import authReducer from "./auth/authReducer";
import workspaceReducer from "./workspace/workspaceReducers";
import projectsReducer from "./projects/projectsReducers";
// import storage from 'redux-persist/lib/storage';
// import { persistReducer, persistStore } from 'redux-persist';
// import localStorage from "redux-persist/es/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  customise: customiseReducer,
  workspace: workspaceReducer,
  projects: projectsReducer,
});

// export default rootReducer;
export default rootReducer;
