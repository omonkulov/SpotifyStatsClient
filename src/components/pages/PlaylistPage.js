import React from "react";
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Link, useRouteMatch } from "react-router-dom";

let cookies = new Cookies();

export default function PlaylistPage({ api, user }) {
	let { url } = useRouteMatch();
	const [playlists, setPlaylists] = useState(undefined);
	let spotifyApi = api;

	useEffect(() => {
		const abortCont = new AbortController();
		if (playlists) return;
		if (!spotifyApi._credentials.accessToken) {
			if (cookies.get("token")) {
				spotifyApi.setAccessToken(cookies.get("token"));
			} else {
				console.log("CODE 'leaf 8' : Failed to get cookie");
				return;
			}
		}
		spotifyApi.getUserPlaylists(user.id).then(
			function (data) {
				setPlaylists(data.body.items);
				console.log("Retrieved playlists", data.body.items);
			},
			function (err) {
				console.log("Something went wrong!", err);
			}
		);

		return () => abortCont.abort();
	}, [spotifyApi, user, playlists]);

	const playlistEmpty = () => {
		return (
			<div>
				<h3>No playlists found</h3>
				<h5>If this is an error, please refresh or loggout and log back in.</h5>
			</div>
		);
	};

	const mapPayList = () => {
		return playlists.map((obj, i) => {
			if (obj.images[1] === undefined) return null;
			return (
				<div key={i} className="m-1 p-1">
					<img
						className="card-img-top card-custom-class"
						src={obj.images[1].url}
						alt=""
					/>
					<div className="card-body card-custom-class">
						<h4 className="card-title">{obj.name}</h4>
						<p className="text-success">{obj.owner.display_name}</p>
						<p className="text-secondary ">{obj.tracks.total} tracks</p>
						{console.log(obj.id)}
						<Link to={`${url}/${obj.id}`}>
							{" "}
							<p className="btn btn-secondary">Learn More</p>{" "}
						</Link>
					</div>
				</div>
			);
		});
	};
	const playList = () => {
		return (
			<div className="d-flex flex-row flex-wrap justify-content-center pt-2">
				{mapPayList()}
			</div>
		);
	};
	return <div>{playlists !== undefined ? playList() : playlistEmpty()}</div>;
}
