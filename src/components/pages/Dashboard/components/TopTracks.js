import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

export default function TopTracks({ tracks }) {
	// The `path` lets us build <Route> paths that are
	// relative to the parent route, while the `url` lets
	// us build relative links.
	let { url } = useRouteMatch();
	let render = true;
	let items = tracks;

	if (tracks !== null) {
		items = tracks.items;
	}

	let i = 1;
	if (!tracks || !Object.keys(tracks).length || items.length === 0) {
		render = false;
		items = [];
	}

	const content = items.map((obj) => {
		return (
			<div key={i++} className="container-img-text-overlay ">
				<Link to={`${url}/track/${obj.id}`} className="link-nodecor ">
					<img
						className="w-100 px-1 img-black-gradient-overlay"
						src={obj.album.images[0].url}
						alt={obj.id}
					/>
					{obj.explicit ? (
						<h6 className="top-right-txt-overlay">explicit</h6>
					) : null}
					<p className="bottom-right-txt-overlay text-wrap">{obj.name}</p>
				</Link>
			</div>
		);
	});

	const onEmpty = (
		<div className="jumbotron bg-dark">
			<h3 className="display-5">Not Enought Data</h3>
			<p className="lead">
				Spotify didn't have enought information about your top artists. Please
				keep enjoying the songs you like to populate the data.
			</p>
		</div>
	);

	return (
		<div className="mt-4">
			<div className="d-flex justify-content-between align-items-baseline">
				<h3>Top Track:</h3>
				<p className="link-nodecor">See All</p>
			</div>

			{render ? <div className="scrolling-wrapper"> {content}</div> : onEmpty}
		</div>
	);
}
