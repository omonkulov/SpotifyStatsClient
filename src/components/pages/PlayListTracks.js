import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
let cookies = new Cookies();

export default function PlayListTracks({ api }) {
	let { playListId } = useParams();
	const [playListData, setPlayListData] = useState(null);
	const [page, setPage] = useState(0);
	const [total, setTotal] = useState(0);
	useEffect(() => {
		const abortCont = new AbortController();
		if (!playListId) return;
		if (!api._credentials.accessToken) {
			if (cookies.get("token")) {
				api.setAccessToken(cookies.get("token"));
			} else {
				console.log("CODE 'leaf 1' : Failed to get cookie");
				return;
			}
		}

		api
			.getPlaylistTracks(playListId, {
				signal: abortCont,
				offset: page,
				limit: 100,
			})
			.then((res) => {
				console.log(res);
				setTotal(res.body.total);
				setPlayListData(res.body);
			})
			.catch((err) => {
				if (err.name === "AbortError") {
					console.log("fetch abborded");
				}
			});

		return () => abortCont.abort();
	}, [playListId, api, page]);

	useEffect(() => {}, [playListData]);

	const trackList = () => {
		let arr = null;
		if (playListData) {
			arr = playListData.items.map((track, i) => {
				return (
					<div
						key={i}
						className=" border-bottom border-dark row justify-content-sm-center my-4 mx-1 align-items-center"
					>
						<img
							className="col-4 playlist-images"
							src={track.track.album.images[1].url}
							alt="album"
						/>
						<h4 className="col-6 text-center col">{track.track.name}</h4>
						<Link
							className="col-sm-2 btn btn-dark"
							from=""
							to={`/dashboard/track/${track.track.id}`}
						>
							{i + 1 + page}
						</Link>
					</div>
				);
			});
		}

		return arr;
	};

	const prevPage = () => {
		if (page <= 0) return;
		setPage((prev) => prev - 100);
	};
	const nextPage = () => {
		if (page + 100 >= total) return;
		setPage((prev) => prev + 100);
	};
	return (
		<div className="">
			<div className="d-flex justify-content-end">
				<nav aria-label="Page navigation example mx-auto">
					<ul className="pagination">
						<li className="page-item">
							<button onClick={prevPage} className="page-link">
								Previous
							</button>
						</li>
						<li className="page-item">
							<button onClick={nextPage} className="page-link">
								Next
							</button>
						</li>
					</ul>
				</nav>
			</div>

			{trackList()}

			<div className="d-flex justify-content-end">
				<nav aria-label="Page navigation example mx-auto">
					<ul className="pagination">
						<li className="page-item">
							<button onClick={prevPage} className="page-link">
								Previous
							</button>
						</li>
						<li className="page-item">
							<button onClick={nextPage} className="page-link">
								Next
							</button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}
