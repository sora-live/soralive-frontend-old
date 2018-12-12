<template>
    <div>
        <h1>{{ roomname }}</h1>
        <p>@{{ uname}}</p>
        <div v-if="is_streaming" class="player-slot">
            <Player :url="streaming_uri"></Player>
        </div>
        <div id="playerSlot" class="player-slot" v-else>
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
.player-slot{
    background-color: black;
    height: 75vh;
}
.player-area{
    color: white;
    font-size: 40px;
    text-align: center;
    padding-top: 20%;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Hls from 'hls.js'
import fetchpost from '../util/fetchpost';
import Player from './player.vue';

@Component({
    components: {
        Player
    }
})
class LivePage extends Vue {
    roomname = "Room Title";
    uname = "username";
    description = "Description";
    is_loading = true;
    is_streaming = false;
    streaming_uri = "";
    mounted(){
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
            this.is_streaming = true;
            this.streaming_uri = resjson.streaming_uri;
        }
    }
}
export default LivePage;
</script>