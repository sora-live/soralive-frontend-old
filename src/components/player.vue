<template>
    <div class="player-wrapper" :class="{'player-wide' : isWidescreen}" id="player_wrapper">
        <div class="player-controls">
            <div class="player-buttons">
                <div class="player-buttons-left-group">
                    <span class="material-icons" @click="pause">{{playing ? 'pause' : 'play_arrow'}}</span>
                    <span class="material-icons" @click="mute">{{volumeIcon}}</span>
                </div>
                <div class="player-buttons-right-group">
                    <span class="material-icons" @click="widescreen">aspect_ratio</span>
                    <span class="material-icons" @click="picinpic" v-if="supportPictureInPicture">{{isPicinPic ? 'picture_in_picture_alt' : 'picture_in_picture'}}</span>
                    <span class="material-icons" @click="fullscreen">{{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}}</span>
                </div>
            </div>
        </div>
        <video id="player_video"></video>
    </div>
</template>

<style lang="scss" scoped>
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(../assets/MaterialIcons-Regular.woff2) format('woff2'),
    url(../assets/MaterialIcons-Regular.woff) format('woff'),
    url(../assets/MaterialIcons-Regular.ttf) format('truetype');
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 35px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
  padding: 20px;
  cursor: pointer;
}
.player-wrapper{
    background-color: black;
    height: 100%;
    width: 100%;
    position: relative;
}
.player-controls{
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
}
.player-buttons{
    color: white;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    opacity: 0;
    transition: all .7s linear;
    user-select: none;
}
.player-buttons:hover{
    opacity: 1;
}
video{
    width: 100%;
    height: 100%;
}
.player-wide{
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2080;
}
</style>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Hls from 'hls.js'

@Component({
    props: ['url'],
})
class Player extends Vue {
    supportPictureInPicture = false;
    playing = false;
    isPicinPic = false;
    isFullscreen = false;
    isWidescreen = false;
    volume = 1;
    tempvolume = 1;
    get volumeIcon(){
        if(this.volume < 0.001) return 'volume_off';
        else if(this.volume <= 0.1) return 'volume_mute';
        else if(this.volume <= 0.5) return 'volume_down';
        else return 'volume_up';
    }
    mounted(){
        let videoElement = document.getElementById('player_video');
        videoElement.addEventListener('leavepictureinpicture', async () => {
            if (this.playing) {
                await videoElement.play();
            }
            this.isPicinPic = false;
        });
        videoElement.addEventListener('enterpictureinpicture', async () => {
            this.isPicinPic = true;
        });
        videoElement.addEventListener('playing', async () => {
            this.playing = true;
        });
        videoElement.addEventListener('pause', async () => {
            this.playing = false;
        });
        videoElement.addEventListener('volumechange', async () => {
            console.log("volume change", videoElement.volume)
            this.volume = videoElement.volume;
        });
        this.supportPictureInPicture = ~~document.pictureInPictureEnabled;
        document.addEventListener('fullscreenchange', async () => {
            if(!document.webkitFullscreenElement && !document.fullscreenElement){
                this.isFullscreen = false;
            }else{
                this.isFullscreen = true;
            }
        });


        this.readyPlayer(this.url);
    }
    async readyPlayer(url){
        let videoElement = document.getElementById('player_video');

        let hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            try{
                await videoElement.play();
                this.playing = true;
            }catch (e){
                console.log("cannot auto play");
            }
        })
    }
    async pause(){
        let videoElement = document.getElementById('player_video');

        if(videoElement.paused){
            await videoElement.play();
            this.playing = true;
        }else{
            await videoElement.pause();
            this.playing = false;
        }
    }
    async picinpic(){
        if(this.isPicinPic){
            await document.exitPictureInPicture();
            this.isPicinPic = false;
        }else{
            let videoElement = document.getElementById('player_video');
            await videoElement.requestPictureInPicture();
            this.isPicinPic = true;
        }
    }
    async fullscreen(){
        if(this.isFullscreen){
            if(document.exitFullscreen) {
                await document.exitFullscreen();
                this.isFullscreen = false;
            }else if(document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
                this.isFullscreen = false;
            }else if(document.mozRequestFullScreen) {
                await document.mozRequestFullScreen();
                this.isFullscreen = false;
            }
        }else{
            let videoElement = document.getElementById('player_wrapper');
            if (videoElement.requestFullscreen) {
                await videoElement.requestFullscreen();
                this.isFullscreen = true;
            }else if(videoElement.webkitRequestFullScreen) {
                await videoElement.webkitRequestFullScreen();
                this.isFullscreen = true;
            }else if(videoElement.mozRequestFullScreen) {
                await videoElement.mozRequestFullScreen();
                this.isFullscreen = true;
            }
        }
    }
    async widescreen(){
        this.isWidescreen = !this.isWidescreen;
    }
    async setvolume(volume){
        console.log("setvolume", volume);
        let videoElement = document.getElementById('player_video');
        videoElement.volume = volume;
    }
    async mute(){
        if(this.volume < 0.001){
            this.setvolume(1);
        }else{
            this.setvolume(0);
        }
    }
}
export default Player;
</script>

