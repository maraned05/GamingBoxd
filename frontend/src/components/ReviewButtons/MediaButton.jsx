import './MediaButton.css'

function MediaButton (props) {
    return (
        <button className="mediaButton" onClick={() => { props.onPressMedia(props.reviewID); }}>
            Media</button>
    );
};

export default MediaButton;