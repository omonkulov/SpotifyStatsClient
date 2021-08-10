import React from 'react'
import { Carousel } from 'react-bootstrap'
import { Link, useRouteMatch } from 'react-router-dom';


export default function CarouselTop({ topArtist }) {
    let render = true;
    let { path } = useRouteMatch();
    if (!topArtist || !Object.keys(topArtist).length) {
        topArtist = []
        render = false;
    }
    let keyId = 1
    const carouselItems = topArtist.map(artist => {
        return (
            <Carousel.Item key={keyId++}>
                <div className="position-relative">
                    <div className="top-artist-div img-black-gradient-overlay" style={{ backgroundImage: "url(" + artist.images[0].url + ")" }} >
                    </div>
                    <img className="Absolute-Center mobileDisable3" src={artist.images[0].url} alt="" />
                </div>
                <Carousel.Caption >
                    <h4 className="d-block text-white">#{keyId}</h4>
                    <div className="mx-auto text-center text-dark" >
                        <h2 className="d-inline bg-white">{artist.name}</h2>
                    </div>
                    <p> Total Followes: {artist.followers.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    <Link to={`${path}artist/${artist.id}`} className="link-nodecor" >
                        <button className="btn btn-outline-success btn-sm">About Artist</button>
                    </Link>
                </Carousel.Caption>
            </Carousel.Item >
        )
    })


    const onEmpty = () => {
        return (<div className="jumbotron bg-dark">
            <h3 className="display-5">Not Enought Data</h3>
            <p className="lead">Spotify didn't have enought information about your top artists. Please keep enjoying the songs you like to populate the data.</p>
        </div>)
    }


    return (
        <div>

            {(render) ? <Carousel>{carouselItems}</Carousel> : onEmpty()}

        </div>
    )
}
