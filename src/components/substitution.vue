<template>
    <div>
        <div id="playerSlot">
            {{$t("info.loading")}}
        </div>
    </div>
</template>

<style>
video {
    width: 1280px;
    height: 720px;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Hls from 'hls.js'

@Component
class SubstitutionPage extends Vue {
    mounted(){
        this.readyPlayer();
    }
    async readyPlayer(){
        let playerSlot = document.getElementById("playerSlot");
        //清空
        playerSlot.innerHTML = "";

        //准备载入播放器
        let url = "https://stream.cyaron.moe/live/sl_49428e8.m3u8";

        let videoElement = document.createElement("video");
        playerSlot.appendChild(videoElement);


        let hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, function(){
            videoElement.play();
        })
    }
}
export default SubstitutionPage;
</script>