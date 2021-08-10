import React from 'react'

export default function AlbumCard({ name, image, id }) {
    return (
        <div className="container-img-text-overlay ">
            <img
                className="w-100 px-1 img-black-gradient-overlay"
                src={image}
                alt={id}
            />

            <h5 className="bottom-right-txt-overlay text-wrap">{name}</h5>
        </div>
    )
}
