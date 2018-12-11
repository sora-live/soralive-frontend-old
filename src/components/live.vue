<template>
    <div>
        <h1>{{ roomname }}</h1>
        <p>@{{ uname}}</p>
        <div id="playerSlot">
            <div v-if="is_loading">{{$t("info.loading")}}</div>
            <div v-else class="player-area">未开播</div>
        </div>
        <div>
            <h3>{{$t("info.description")}}</h3>
            <div>{{ description }}</div>
        </div>
    </div>
</template>

<style>
#playerSlot{
    background-color: black;
    height: 75vh;
}
.player-area{
    color: white;
    font-size: 40px;
    text-align: center;
    padding-top: 20%;
}
video{
    height: 100%;
    width: 100%;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Hls from 'hls.js'
import fetchpost from '../util/fetchpost';

@Component
class LivePage extends Vue {
    roomname = "Room Title";
    uname = "username";
    description = "Description";
    is_loading = true;
    mounted(){
        console.log(this.$route.params.uid);
        this.getPlayInfo();
        //this.readyPlayer();
    }
    async getPlayInfo(){
        let api = this.$gConst.apiRoot + "get-roominfo";
        let res = await fetchpost(api, {
            uid: this.$route.params.uid
        });
        let resjson = await res.json();

        if (resjson['error'] != 0) {
            this.$gConst.globalbus.$emit("send-info", resjson['info']);
            this.$router.push('/list');
            return;
        }

        this.roomname = resjson.roomname;
        this.uname = resjson.uname;
        this.description = resjson.description;
        this.is_loading = false;

        if(resjson.streaming == 1){
            await this.readyPlayer(resjson.streaming_uri);
        }
    }
    async readyPlayer(url){
        let playerSlot = document.getElementById("playerSlot");
        //清空
        playerSlot.innerHTML = "";

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
export default LivePage;
</script>