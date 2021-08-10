import React from 'react'
import DefaultProfileImage from '../../../icons/user.svg'

export default function AccountInfo({ data }) {
    let filter_enabled = null;
    let filter_locked = null;
    let total = null;
    let profileImage = DefaultProfileImage

    if (data === undefined || data === null) {
        data = null
        filter_enabled = null;
        filter_locked = null;
        total = null;
        profileImage = DefaultProfileImage
    }
    if (data.hasOwnProperty("images") && data.images.length > 0) {
        profileImage = data.images[0].url;
    }
    if (data.hasOwnProperty("explicit_content")) {
        filter_enabled = data.explicit_content.filter_enabled;
        filter_locked = data.explicit_content.filter_locked;
        total = data.followers.total;
    }

    return (
        <>
            <h3 className="my-4 text-center">{data.display_name}</h3>
            <div className="row mx-auto my-3 align-items-center justify-content-end" >

                <div className="col-sm-7">
                    <dl className="row">
                        <dt className="col-sm-4 text-truncate">Account Type</dt>
                        <dd className="col-sm-8 ">{data.type}</dd>

                        <dt className="col-sm-4">Country</dt>
                        <dd className="col-sm-8 ">{data.country}</dd>

                        <dt className="col-sm-4">Email</dt>
                        <dd className="col-sm-8 ">{data.email}</dd>

                        <dt className="col-sm-4">Followers</dt>
                        <dd className="col-sm-8">{total}</dd>

                        <dt className="col-sm-4">User ID</dt>
                        <dd className="col-sm-8">{data.id}</dd>

                        <dt className="col-sm-4 text-truncate">Filter Enabled</dt>
                        <dd className="col-sm-8">{(filter_enabled) ? "Yes" : "No"}</dd>

                        <dt className="col-sm-4 text-truncate">Filter Locked</dt>
                        <dd className="col-sm-8">{(filter_locked) ? "Yes" : "No"}</dd>
                    </dl>
                </div>
                <div className="col-sm-5  float-right mb-3">
                    <img className="profileImg rounded my-2 float-right" alt={"DefaultProfileImage"} src={profileImage} />
                </div>

            </div>
        </>
    )
}
