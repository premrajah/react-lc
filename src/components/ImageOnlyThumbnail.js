import React from "react";
import PlaceholderImg from "../img/place-holder-lc.png";

function ImageOnlyThumbnail(props) {
    const { images } = props;

    const onError = (ev) => (
        ev.target.src = PlaceholderImg
    )

    return (
        images && (
            <img
                className={"img-fluid img-list"}
                src={
                    (
                        images.find(
                            (item) =>
                                item.mime_type === "image/jpeg" || item.mime_type === "image/png"
                        ) || {}
                    ).blob_url || PlaceholderImg
                }
                alt=""
                onError={onError}
            />
        )
    );
}

export default ImageOnlyThumbnail;
