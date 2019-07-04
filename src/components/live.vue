<template>
    <div v-if="require_password">
        <div class="password-center">
            <h1>该房间需要输入密码</h1>
            <div class="password-enterarea">
                <form @submit.prevent="getPlayInfo">
                    <div class="form-group">
                        <div class="col-sm-offset-3 col-sm-5">
                            <input type="text" class="form-control" id="inputpass" :placeholder="$t('info.password')" v-model="password">
                        </div>
                        <div class="col-sm-2">
                            <button type="submit" class="btn btn-success btn-lg">{{$t("info.open")}}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-else>
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
.password-center{
    text-align: center;
}
.password-enterarea{
    margin-top: 300px;
}
.password-area-submit{
    margin-top: 100px;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fetchpost, { fetchPostWithSign } from '../util/fetchpost';
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
    require_password = false;
    password = "";
    mounted(){
        this.getPlayInfo();
        //this.readyPlayer();
    }
    async getPlayInfo(){
        let api = this.$gConst.apiRoot + "index/roominfo";
        let res;
        if(localStorage.getItem('token') == null){
            res = await fetchpost(api, {
                uid: this.$route.params.uid
            });
        }else if(this.password == ""){
            res = await fetchPostWithSign(api, {
                uid: this.$route.params.uid,
                token: localStorage.getItem('token') || ""
            });
        }else{
            res = await fetchPostWithSign(api, {
                uid: this.$route.params.uid,
                token: localStorage.getItem('token') || "",
                password: this.password
            });
        }
        
        let resjson = await res.json();

        if (resjson['error'] == 16) {
            this.require_password = true;
            return;
        }

        if (resjson['error'] == 17) {
            this.$gConst.globalbus.$emit("send-info", "tips.wrongPassword");
            return;
        }

        if (resjson['error'] != 0) {
            this.$gConst.globalbus.$emit("send-info", resjson['info']);
            this.$router.push('/list');
            return;
        }

        this.roomname = resjson.roomname;
        this.uname = resjson.uname;
        this.description = resjson.description;
        this.is_loading = false;
        this.require_password = false;

        if(resjson.streaming == 1){
            this.is_streaming = true;
            this.streaming_uri = resjson.streaming_uri;
        }
    }
}
export default LivePage;
</script>