import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ContactForm from './components/ContactForm';
import MusicianForm from './components/MusicianForm';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Profile from './pages/Profiles';
import ProfileCreate from './components/ProfileCreate';
import Directory from './components/Directory';
import Contact from './components/Contact'

//test delete after
import * as auth from './api/profile';
import jwt_decode from 'jwt-decode';

class App extends Component {
  //
  //   if (env.REACT_APP_SECRET_CODE) {s
  //   console.log(env.REACT_APP_SECRET_CODE);
  // }
  //
  state = {
    tokenId: null
  };

  createProfile = event => {
    event.preventDefault();
    const form = event.target;
    const elements = form.elements;
    const input = elements.input.value;
    const token = elements.token.value;
    auth
      .createProfile({ input, token })
      .then(res => {
        console.log('Done', res);
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  // in order to avoid this error (InvalidTokenError: Invalid token specified)
  componentWillMount() {
    var getToken = auth.token();
    if (getToken !== null) {
      var decodeToken = jwt_decode(getToken);
      var tokenId = decodeToken.sub;
      this.setState({ tokenId });
    } else {
      console.log('error');
    }
  }

  render() {
    return (
      <Router>
        <div className="app">
          <MuiThemeProvider>
            <Header />
          </MuiThemeProvider>

          <form onSubmit={this.createProfile}>
            <label> Input </label>
            <input type="text" name="input" />
            <input type="hidden" name="token" value={this.state.tokenId} />
            <input type="submit" />
          </form>

          <Route exact path="/" component={Home} />
          <Switch>
            <Route path="/directory/create" component={ProfileCreate} />
            <Route path="/directory/:id" component={Profile} />
            <Route path="/directory" component={Directory} />
            <Route path="/contact" component={Contact} />
          </Switch>

          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
