import React, { useReducer } from "react";
import axios from "axios";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import {
  SEARCH_USERS,
  GET_USER,
  CLEAR_USERS,
  GET_REPOS,
  SET_LOADING,
} from "../types";

let gitHubClientId;
let gitHubClientSecret;

if (process.env.NODE_ENV !== "production") {
  gitHubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  gitHubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  gitHubClientId = process.env.GITHUB_CLIENT_ID;
  gitHubClientSecret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search Users
  const searchUsers = async (text) => {
    setLoading();
    const result =
      await axios.get(`https://api.github.com/search/users?q=${text}&client_id=
    ${gitHubClientId}
    &client_secret=${gitHubClientSecret}`);
    dispatch({ type: SEARCH_USERS, payload: result.data.items });
  };

  // Get User

  const getUser = async (username) => {
    setLoading();
    const result =
      await axios.get(`https://api.github.com/users/${username}?client_id=
    ${gitHubClientId}
    &client_secret=${gitHubClientSecret}`);
    dispatch({ type: GET_USER, payload: result.data });
  };

  // Get Repos
  const getUserRepos = async (username) => {
    setLoading();
    const result =
      await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=
    ${gitHubClientId}
    &client_secret=${gitHubClientSecret}`);
    dispatch({ type: GET_REPOS, payload: result.data });
  };

  // Clear Users

  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};
export default GithubState;
