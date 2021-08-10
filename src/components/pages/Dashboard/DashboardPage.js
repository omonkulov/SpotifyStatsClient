//React hooks/functions
import React from "react";
import { useEffect, useState } from "react";
//Components
import RecentlyPlayed from "./components/RecentlyPlayed";
import TrackPage from "../TrackPage";
import ArtistPage from "../ArtistPage";
import SearchPage from "../SearchPage";
import PlayListTracks from "../PlayListTracks";
import useAuth from "../../misc/auth/useAuth";
import CarouselTop from "./components/CarouselTop";
import TopTracks from "./components/TopTracks";
//Modules
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from "universal-cookie";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import axios from "axios";
//Style
import { Row, Col, Nav, Navbar } from "react-bootstrap";
import PlaylistPage from "../PlaylistPage";
//Icons
import Home from "../../icons/home";
import Library from "../../icons/library";
import Settings from "../../icons/settings";
import SearchIcon from "../../icons/search";

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.REACT_APP_CLIENT_ID,
});

//intiliaze cookie
const cookies = new Cookies();

export default function DashboardPage({ setPage }) {
	const [data, setData] = useState({});
	const [recents, setRecents] = useState({});
	const [topTracks, setTopTracks] = useState({});
	const [topArtist, setTopArtist] = useState({});
	const [refreshToken, setRefreshToken] = useState();
	const [started, setStarted] = useState();
	const [expiresIn, setExpiresIn] = useState();
	let { path, url } = useRouteMatch();

	//cookies
	let code = cookies.get("code");
	let tokenFromCookie = cookies.get("token");

	//localStorage
	let usrDataFromLocal = localStorage.getItem("user");
	let usrRecentPlayed = localStorage.getItem("recent_played");
	let usrTopTracks = localStorage.getItem("top_tracks");
	let usrTopArtist = localStorage.getItem("top_artists");

	if (tokenFromCookie !== undefined) code = undefined;
	const accessToken = useAuth(code);

	useEffect(() => {
		if (cookies.get("token") !== undefined) {
			spotifyApi.setAccessToken(cookies.get("token"));
			return;
		}
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	useEffect(() => {
		try {
			if (
				usrDataFromLocal !== null &&
				usrRecentPlayed !== null &&
				usrTopArtist !== null
			) {
				setData(JSON.parse(usrDataFromLocal));
				setRecents(JSON.parse(usrRecentPlayed));
				setTopArtist(JSON.parse(usrTopArtist));
				setTopTracks(JSON.parse(usrTopTracks));
				return;
			} else {
				if (!accessToken) return;

				setTimeout(() => {
					if (Object.keys(data).length !== 0) return;
					spotifyApi.getMe().then(
						(res) => {
							console.log("REQUEST: Get Me");
							localStorage.setItem("user", JSON.stringify(res.body));
							setData(res.body);

							//Get Recent Played
							spotifyApi
								.getMyRecentlyPlayedTracks({
									limit: 20,
								})
								.then(
									function (res) {
										console.log("REQUEST: Get Recently Played");
										localStorage.setItem(
											"recent_played",
											JSON.stringify(res.body)
										);
										setRecents(res.body);
									},
									function (err) {
										console.log("Something went wrong!", err);
									}
								);

							spotifyApi.getMyTopTracks().then(
								function (data) {
									localStorage.setItem("top_tracks", JSON.stringify(data.body));
									setTopTracks(data.body);
								},
								function (err) {
									console.log("Something went wrong!", err);
								}
							);

							//Get User's Top Artist
							spotifyApi
								.getMyTopArtists({
									limit: 10,
								})
								.then(
									(res) => {
										console.log("REQUEST: Get My Top Artists");
										localStorage.setItem(
											"top_artists",
											JSON.stringify(res.body.items)
										);
										setTopArtist(res.body.items);
									},
									(err) => {
										console.log(err);
									}
								);
						},
						function (err) {
							console.error(err);
						}
					);
				}, 200);
			}
		} catch (err) {
			console.log(err);
		}
		// eslint-disable-next-line
	}, [accessToken, usrDataFromLocal, usrRecentPlayed, usrTopArtist]);

	//Refresh
	useEffect(() => {
		let refreshInter = null;
		const waitForCookiesLoad = setTimeout(() => {
			try {
				setExpiresIn(cookies.get("expires"));
				setRefreshToken(cookies.get("refresh"));
				setStarted(cookies.get("started"));
				if (!(expiresIn && refreshToken && started)) return;
				let time =
					(expiresIn - 1800 - (new Date().getSeconds() - started)) * 1000;
				console.log("Time in seconds: " + time / 1000);
				time = time < 1000 ? 1000 : time;
				refreshInter = setInterval(() => {
					axios
						.post(process.env.REACT_APP_SERVER_DOMAIN + "/refresh", {
							refreshToken,
						})
						.then((res) => {
							cookies.set("refresh", res.data.refreshToken);
							cookies.set("token", res.data.accessToken);
							cookies.set("started", new Date().getSeconds());
							clearInterval();
						})
						.catch((e) => {
							cookies.remove("code");
							cookies.remove("token");
							cookies.remove("refresh");
							cookies.remove("expires");
							cookies.remove("started");
							localStorage.clear();
							window.location = "/";
							console.log("Refresh error: " + e);
						});
					console.log("Time in seconds: " + started);
				}, time);
			} catch (error) {
				console.log(error);
			}
		}, 1000);
		return () => {
			clearInterval(refreshInter);
			clearTimeout(waitForCookiesLoad);
		};
	}, [refreshToken, expiresIn, started]);

	return (
		<div className="">
			<Row>
				<Col xs={2} md={2} className="mobileDisable1">
					<div className="sticky-top">
						<Nav className="flex-column marginTopScroll">
							<Link className="text-secondary" to={`${url}`}>
								<p variant="outline-secondary">Dashboard</p>
							</Link>
							<Link className="text-secondary" to={`${url}/search`}>
								<p variant="outline-secondary">Search</p>
							</Link>
							<Link className="text-secondary" to={`${url}/playlists`}>
								<p variant="outline-secondary">Playlists</p>
							</Link>
						</Nav>
					</div>
				</Col>
				<Col>
					<div className="main mb-5 pb-1">
						<Switch>
							<Route path={`${path}/`} exact>
								<CarouselTop topArtist={topArtist} />
								<RecentlyPlayed recents={recents} />
								<TopTracks tracks={topTracks} />
							</Route>
							<Route path={`${path}/track/:trackId`}>
								<TrackPage api={spotifyApi} />
							</Route>
							<Route path={`${path}/artist/:artistId`}>
								<ArtistPage api={spotifyApi} />
							</Route>
							<Route path={`${path}/search`} exact>
								<SearchPage api={spotifyApi}></SearchPage>
							</Route>
							<Route path={`${path}/search/track/:trackId`}>
								<TrackPage api={spotifyApi} />
							</Route>
							<Route path={`${path}/search/artist/:artistId`}>
								<ArtistPage api={spotifyApi} />
							</Route>
							<Route path={`${path}/playlists`} exact>
								<PlaylistPage api={spotifyApi} user={data} />
							</Route>
							<Route path={`${path}/playlists/:playListId`}>
								<PlayListTracks api={spotifyApi} />
							</Route>
						</Switch>
					</div>
				</Col>
			</Row>
			<Navbar
				className="mobileEnable1 mobile-navbar custom-bottom-navbar-background"
				fixed="bottom"
			>
				<Nav className="w-100 justify-content-around">
					<Nav.Item>
						<Link className="nav-link text-white" to={`${url}`}>
							<Home></Home>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Link className="nav-link text-white" to={`${url}/playlists`}>
							<Library></Library>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Link className="nav-link text-white" to={`${url}/search`}>
							<SearchIcon></SearchIcon>
						</Link>
					</Nav.Item>
					<Nav.Item>
						<Link className="nav-link text-white" to={`${url}/search`}>
							<Settings></Settings>
						</Link>
					</Nav.Item>
				</Nav>
			</Navbar>
			<div className="mb-5" />
		</div>
	);
}
