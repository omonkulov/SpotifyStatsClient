//React hooks/functions
import React from "react";
import { useEffect, useState } from "react";
//Components
import AlbumCard from "../misc/AlbumCard";
//import DonutChart from '../misc/visuals/DonutChart'
//import Card from '../misc/MiniCard';
//Modules
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";

let cookies = new Cookies();

export default function ArtistPage({ api }) {
	let spotifyApi = api;
	let { artistId } = useParams();
	if (!artistId) artistId = "0TnOYISbd1XYRBk9myaseg";

	const [artist, setArtist] = useState(undefined);
	const [albums, setAlbums] = useState(undefined);
	const [appears, setApppears] = useState(undefined);
	const [compilation, setCompilation] = useState(undefined);

	useEffect(() => {
		const abortCont = new AbortController();

		if (!spotifyApi._credentials.accessToken) {
			if (cookies.get("token")) {
				spotifyApi.setAccessToken(cookies.get("token"));
			} else {
				console.log("CODE 'leaf 6' : Failed to get cookie");
				return;
			}
		}

		spotifyApi.getArtist(artistId).then(
			(res) => {
				setArtist(res.body);
				console.log("REQUEST: Artist's Details", res.body);
			},
			(error) => console.log(error)
		);

		return () => abortCont.abort();
	}, [spotifyApi, artistId]);

	useEffect(() => {
		const abortCont = new AbortController();
		if (!artistId) return;
		if (!spotifyApi._credentials.accessToken) return;

		spotifyApi
			.getArtistAlbums(artistId, {
				limit: 20,
				include_groups: "album,single",
				offset: 0,
			})
			.then(
				(res) => {
					console.log("REQUEST: Artist's Albums, Singles");
					setAlbums(removeDuplicateAlbums(res.body));
				},
				(err) => {
					console.log(err);
				}
			);

		spotifyApi
			.getArtistAlbums(artistId, {
				limit: 20,
				include_groups: "appears_on",
				offset: 0,
			})
			.then(
				(res) => {
					console.log("REQUEST: Artist's Albums, Appears On");
					console.log(res.body.items);
					setApppears(removeDuplicateAlbums(res.body));
				},
				(err) => {
					console.log(err);
				}
			);

		spotifyApi
			.getArtistAlbums(artistId, {
				limit: 20,
				include_groups: "compilation",
				offset: 0,
			})
			.then(
				(res) => {
					console.log("REQUEST: Artist's Albums, Compilation");
					console.log(res.body.items);
					setCompilation(removeDuplicateAlbums(res.body));
				},
				(err) => {
					console.log(err);
				}
			);

		return () => abortCont.abort();
	}, [spotifyApi, artistId]);

	// const header = (artist) => {
	// 	if (!artist) return <h1>No</h1>;
	// 	return (
	// 		<div>
	// 			{artist.name}
	// 			<img src={artist.images[0].url} alt="" />
	// 			{artist.followers.total}
	// 			<br />
	// 			{artist.popularity}
	// 		</div>
	// 	);
	// };

	const albumsComponent = (albums) => {
		if (!albums) return <div>No Albums</div>;
		let key = 0;
		return albums.map((album) => {
			return (
				<AlbumCard
					key={key++}
					name={album.name}
					id={album.id}
					image={album.images[1].url}
				/>
			);
		});
	};

	const singlesComponent = () => {
		return (
			<div className="my-5">
				<div className="d-flex justify-content-between align-items-baseline">
					<h3>Singles:</h3>
					<p className="link-nodecor">See All</p>
				</div>
				{albums ? (
					<div className="scrolling-wrapper"> {albumsComponent(albums)} </div>
				) : null}
			</div>
		);
	};

	const appearsOnComponent = () => {
		return (
			<div className="my-5">
				<div className="d-flex justify-content-between align-items-baseline">
					<h3>Appears On:</h3>
					<p className="link-nodecor">See All</p>
				</div>
				{appears ? (
					<div className="scrolling-wrapper"> {albumsComponent(appears)} </div>
				) : null}
			</div>
		);
	};

	const compilationComponent = () => {
		return (
			<div className="my-5">
				<div className="d-flex justify-content-between align-items-baseline">
					<h3>Compilation:</h3>
					<p className="link-nodecor">See All</p>
				</div>
				{compilation ? (
					<div className="scrolling-wrapper">
						{" "}
						{albumsComponent(compilation)}{" "}
					</div>
				) : (
					<h3>No Compilation</h3>
				)}
			</div>
		);
	};

	return (
		<div>
			<div className="my-5">
				<div className="artist-page-background p-4 d-flex flex-row flex-wrap justify-content-center align-items-center">
					<img
						className="mx-4 rounded artist-page-image"
						src={artist !== undefined ? artist.images[0].url : null}
						alt=""
					/>
					<div>
						<h1 className="artist-page-arist-name text-center">
							{artist !== undefined ? artist.name : "Log In"}
						</h1>
						<p className="text-center">
							Followers:{" "}
							{artist !== undefined
								? artist.followers.total
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
								: "Log In"}
						</p>
					</div>
				</div>
			</div>

			{albums && albums.length !== 0 ? (
				singlesComponent()
			) : (
				<h1 className="my-5 pt-5  text-center text-muted">No Albums Found</h1>
			)}
			{appears && appears.length !== 0 ? (
				appearsOnComponent()
			) : (
				<h1 className="my-5 pt-5  text-center text-muted">
					No Appears On Albums Found
				</h1>
			)}
			{compilation && compilation.length !== 0 ? (
				compilationComponent()
			) : (
				<h1 className="my-5 pt-5  text-center text-muted">
					No Compilations Found
				</h1>
			)}
			<div className="mb-5" />
		</div>
	);
}

function removeDuplicateAlbums(albums) {
	let items = albums.items;
	let filteredItems = [];
	for (let i = 0; i < items.length; i++) {
		let x = filteredItems.findIndex((ele) => {
			return ele.name === items[i].name;
		});

		if (x === -1) {
			filteredItems.push(items[i]);
		} else if (x) {
			if (filteredItems[x].total_tracks < items[i].total_tracks) {
				console.log(
					"filerted: ",
					filteredItems[x].total_tracks,
					" items",
					items[i].total_tracks,
					" index:",
					i
				);
				filteredItems[x] = items[i];
			}
		}
	}

	return filteredItems;
}
//  <h6 className="ml-2 p-2" >Followers: {(artist !== undefined) ? artist.followers.total : "Log In"}</h6>
