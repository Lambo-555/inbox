import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import RoomPage from "./components/RoomPage";
import Welcome from "./components/Welcome";

function App() {
  return (
    <Router>
      <Switch>
        <Route path={"/"} exact component={Welcome}/>
        <Route path={"/:room"} exact component={Welcome}/>
        <Route path={"/room/:room"} component={RoomPage}/>
        <Route path={"*"}>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
