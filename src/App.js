//React Hooks/Functions
import React from 'react'
import { useState } from 'react'
//Components
import HomePage from './components/pages/Home/HomePage'
import DashboardPage from './components/pages/Dashboard/DashboardPage'
import AboutPage from './components/pages/About/AboutPage'
import Auth from './components/misc/auth/AuthRedirect'
//Modules
import Cookies from 'universal-cookie'
import { Switch, Route, BrowserRouter, Link } from "react-router-dom"
//Styles
import { Button, Navbar, Nav, ButtonGroup, Container } from 'react-bootstrap';


//Auth urls
let url = "https://accounts.spotify.com/authorize?response_type=code&client_id=" + process.env.REACT_APP_CLIENT_ID + "&redirect_uri=" + process.env.REACT_APP_CLIENT_ID_REDIRECT_URI + "&scope=user-read-private%20user-read-email%20user-library-read%20user-library-modify%20user-follow-read%20user-follow-modify%20playlist-read-collaborative%20playlist-read-private%20playlist-modify-private%20playlist-modify-public%20streaming%20app-remote-control%20user-read-currently-playing%20user-modify-playback-state%20user-read-playback-state%20user-read-playback-position%20user-top-read%20user-read-recently-played%20ugc-image-upload&state=HELLO"
//Cookies
const cookies = new Cookies()

function App() {
  const [page, setPage] = useState("/");

  //Logout
  const logOutFunct = () => {
    cookies.remove("code");
    cookies.remove("token");
    cookies.remove("refresh");
    cookies.remove("expires");
    cookies.remove("started");
    localStorage.clear()
  }


  return (

    <BrowserRouter>

      <Navbar collapseOnSelect className="custom-navbar-background" expand="lg" bg={"black"} variant="dark" sticky="top">
        <Navbar.Brand>Spotify-Stats</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Nav className="mr-auto">
            <Link onClick={() => { setPage("/") }} className={(page === '/') ? "  nav-link active" : "nav-link"} to="/">Home</Link>
            <Link onClick={() => { setPage("about") }} className={(page === 'about') ? "nav-link active" : "nav-link"} to="/about">About</Link>
            <Link onClick={() => { setPage("dashboard") }} className={(page === "dashboard") ? "nav-link active" : "nav-link"} to="/dashboard">Dashboard</Link>
          </Nav>
          <Nav>
            <ButtonGroup>
              <Button onClick={() => { setPage("dashboard"); logOutFunct(); window.location.href = url }} variant="success">Login</Button>
              <Button onClick={() => { setPage("/"); logOutFunct(); window.location.href = "/"; }} variant="danger">Logout</Button>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Navbar>


      {/*App*/}

      <Container className="text-white customMaxWidthContainer" fluid>
        <Switch>
          <Route path="/" exact>
            <HomePage></HomePage>
          </Route>
          <Route path="/auth">
            <Auth></Auth>
          </Route>
          <Route path="/dashboard">
            <DashboardPage setPage={setPage}></DashboardPage>
          </Route>
          <Route path="/about">
            <AboutPage></AboutPage>
          </Route>
        </Switch>

      </Container>
    </BrowserRouter >
  );
}

export default App;
