renderVideo = document.getElementsByClassName(".video-stream")

function setVideoLoop() {
    renderVideo.setAttribute('loop', '');
}

var newer = setInterval(setVideoLoop, 1000)