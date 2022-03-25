import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import SingUp from "./components/screens/Singup";
import Profile from "./components/screens/profile";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUserPosts from "./components/screens/SubscrabeUserPosts";
import Reset from "./components/screens/Reset";
import NewPassword from "./components/screens/NewPassword";
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/reset"))
        history.push("/signin");
    }
  }, [history, dispatch]);
  return (
    <Switch>
      <Route path="/" exact>
        <Home></Home>
      </Route>
      <Route path="/signin">
        <Signin></Signin>
      </Route>
      <Route path="/signup">
        <SingUp></SingUp>
      </Route>
      <Route exact path="/profile">
        <Profile></Profile>
      </Route>
      <Route path="/createpost">
        <CreatePost></CreatePost>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowerspost">
        <SubscribeUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
