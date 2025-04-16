audios = document.querySelectorAll("audio");
slider = document.getElementById("volume")

audios.forEach(audio => {
    audio.volume = 0.1;
    volume.addEventListener("input", function(){
        audio.volume = slider.value / 1000
    })
});