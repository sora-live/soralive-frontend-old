<template>
    <div class="player-wrapper">
        <div class="player-controls">
            <div class="player-buttons">
                <div class="player-buttons-left-group">
                    <span class="glyphicon glyphicon-play" aria-hidden="true"></span>
                    <span class="glyphicon glyphicon-pause" aria-hidden="true"></span>
                </div>
                <div class="player-buttons-right-group">
                    <span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span>
                    <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
                </div>
            </div>
        </div>
        <video id="player_video"></video>
    </div>
</template>

<style lang="scss" scoped>
.player-wrapper{
    height: 100%;
    width: 100%;
    position: relative;
}
.player-controls{
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
}
video{
    height: 100%;
    width: 100%;
}
.player-buttons{
    color: white;
    display: flex;
    justify-content: space-between;
}
</style>


<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Hls from 'hls.js'

@Component({
    props: ['url']
})
class Player extends Vue {
    mounted(){
        console.log(this.url);
        this.readyPlayer(this.url);
    }
    async readyPlayer(url){
        let videoElement = document.getElementById('player_video');

        let hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, function(){
            videoElement.play();
        })
    }
}
export default Player;
</script>

