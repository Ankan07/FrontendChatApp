import logo from './logo.svg';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Chat from './components/chat/chat.js';
import Login from './components/login/login.js';

import SignUp from './components/signUp/signUp.js';

function App() {
  return (

    <Router>
      <Switch>
        <Route path="/chat">
          <Chat />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
