import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Cookies from "universal-cookie";

let cookies = new Cookies();
export default function Search({ api }) {
	let { path } = useRouteMatch();
	let spotifyApi = api;

	const [term, setTerm] = useState("");
	const [tracks, setTracks] = useState([]);
	const [wave, setWave] = useState(undefined);

	useEffect(() => {
		if (!spotifyApi._credentials.accessToken) {
			if (cookies.get("token")) {
				spotifyApi.setAccessToken(cookies.get("token"));
			} else {
				console.log("CODE 'leaf 2' : Failed to get cookie");
				return;
			}
		}
		if (Object.keys(spotifyApi).length === 0) return;
		const search = () => {
			spotifyApi.searchTracks(term).then((data) => {
				console.log("REQUEST: Get Search");
				setTracks(data.body.tracks.items);
			});
			console.log("I ran: " + term);
		};
		let timeOutSearch = setTimeout(() => {
			if (!term || term === "") return;
			search();
		}, 700);

		return () => {
			clearTimeout(timeOutSearch);
		};
	}, [spotifyApi, term]);

	let i = 0;

	const searchResults = tracks.map((result) => {
		return (
			<div
				className={`row somethingtest mb-2 py-3 px-1 ${
					wave === result.id && result.preview_url
						? "animated-div"
						: stopAudio()
				}`}
				key={i++}
			>
				<img
					className="col-3  mobileDisable3 search-image"
					src={result.album.images[1].url}
					alt={result.id}
				></img>

				<div
					className={`col`}
					onClick={(e) => {
						playAudio(result.preview_url, e);
						setWave(result.id);
					}}
				>
					{result.preview_url ? (
						<p className="text-success">Song Preview: Click Here!</p>
					) : null}
					<h4 className="text-sm-truncate">{result.name}</h4>
					<div className="d-inline-block">
						{getAllTheArtists(result.artists)}
					</div>
					<div className="mt-3">{getDuration(result.duration_ms)}</div>
				</div>
				<div className="col-3  text-center d-flex justify-content-center align-items-center">
					<Link
						to={`${path}/track/${result.id}`}
						className="link-nodecor "
						onClick={() => {
							stopAudio();
							setWave(-1);
						}}
					>
						<h5>Learn</h5>
						<h5>More</h5>
					</Link>
				</div>
			</div>
		);
	});

	return (
		<div className="d-flex-column">
			<div className="bg-dark text-center py-2 mb-5">
				<h6>Lower your volume!</h6>
				<h6>Audio control is not available for Embeded Players</h6>
			</div>
			<audio id="myAudio" src=""></audio>

			<div className="w-100 my-4 p-2">
				<input
					className="w-100 css-search text-center"
					type="text"
					placeholder="Click To Search"
					onChange={(e) => setTerm(e.target.value)}
				></input>
			</div>
			<div className="d-flex my-3 flex-column">{searchResults}</div>
		</div>
	);
}

function playAudio(src, e) {
	if (!src) return;
	let track = document.getElementById("myAudio");

	setTimeout(() => {
		if (track.paused && track.src === src) {
			track.play();
		} else if (track.src !== src) {
			track.src = src;
			track.play();
		} else {
			track.pause();
		}
	}, 100);
}

function stopAudio() {
	document.getElementById("myAudio").pause();
	return " ";
}

function getAllTheArtists(artists) {
	if (artists.length === 0) return <p>Unknown</p>;
	//if (artists.length === 1) return (<div className="bg-dark border-dark rounded px-2">{artists[0].name}</div>)
	let artist = ["by "];
	for (let i = 0; i < artists.length; ++i) {
		artist.push(
			<p key={i} className="d-inline bg-dark mr-1 px-1">
				{artists[i].name}
			</p>
		);
	}
	return artist;
}

function getDuration(s) {
	var ms = s % 1000;
	s = (s - ms) / 1000;
	var secs = s % 60;
	s = (s - secs) / 60;
	var mins = s % 60;
	return (
		<h5 className="text-secondary">
			{mins + ":" + secs.toString().padEnd(2, "0")}
		</h5>
	);
}
