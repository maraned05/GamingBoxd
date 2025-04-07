import './ReviewMediaPage.css'
import { BACKEND_URL } from '../config';

function ReviewMediaPage () {
    const isVideo = (filename) => {
        const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
        return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };
      
    const isImage = (filename) => {
        const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
        return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };


    return (
        <div>
            {
                isVideo(window["mediaName"]) ? 
                (
                    <div>
                        <video controls width="400" src={`${BACKEND_URL}/media/${window["mediaName"]}`} />
                        <a href={`${BACKEND_URL}/media/${window["mediaName"]}`} download>
                            Download Video
                        </a>
                    </div>
                )
                : isImage(window["mediaName"]) ? 
                (
                    <div>
                        <img src={`${BACKEND_URL}/media/${window["mediaName"]}`} alt="Review Media" />
                        <a href={`${BACKEND_URL}/media/${window["mediaName"]}`} download>
                                Download Image
                        </a>
                    </div>
                )
                : 
                <p>No Media Available.</p>
            }
        </div>
    );
};

export default ReviewMediaPage;