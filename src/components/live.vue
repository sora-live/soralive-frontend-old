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
        <div class="container-fluid">
            <div class="col-md-9">
                <div v-if="is_streaming" class="player-slot">
                    <Player :url="streaming_uri"></Player>
                </div>
                <div id="playerSlot" class="player-slot" v-else>
                    <div v-if="is_loading">{{$t("info.loading")}}</div>
                    <div v-else class="player-area">未开播</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="row">
                    <h4 class="col-md-6">实时评论</h4>
                    <div class="col-md-6 text-right"><span class="material-icons" title="在线人数">remove_red_eye</span><span class="online-person">{{online}}</span></div>
                </div>
                <div class="comment-area" id="commentarea">
                    <div class="comment-line" v-for="comment in commentList" :key="comment.cmtId">
                        <span class="comment-user">{{comment.uname}}：</span>
                        <span>{{comment.content}}</span>
                    </div>
                </div>
                <div class="comment-input-area">
                    <form autocomplete="off" @submit.prevent="sendComment">
                        <div class="form-group">
                            <div class="input-group">
                                <label for="comment-input" class="sr-only">评论输入：</label>
                                <input type="text" class="form-control" id="comment-input" v-model="input_comment" :disabled="!is_readyForChat">
                                <span class="input-group-btn">
                                    <button type="submit" class="btn btn-default" :disabled="!is_readyForChat">发送</button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div>
            <h3>{{$t("info.description")}}</h3>
            <div>{{ description }}</div>
        </div>
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
  font-size: 20px;
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
}
.online-person{
    font-size: 18px;
    padding-left: 15px;
}
.player-slot{
    background-color: black;
    height: 480px;
    @media screen and (min-width: 1200px) and (max-width: 1800px) {
        height: 600px;
    }
    @media screen and (min-width: 1800px) {
        height: 720px;
    }
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
.comment-area{
    height: 397px;
    @media screen and (min-width: 1200px) and (max-width: 1800px) {
        height: 517px;
    }
    @media screen and (min-width: 1800px) {
        height: 637px;
    }
    overflow-y: scroll;
}
.comment-header{
    height: 10px;
}
.comment-input-area{
    margin-top: 10px;
}
.comment-line{
    margin: 5px;
}
.comment-user{
    color: rgb(111, 159, 173);
    font-weight: bold;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fetchpost, { fetchPostWithSign } from '../util/fetchpost';
import sleep from '../util/sleep'
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
    online = 0;
    input_comment = "";
    chatroom_ws;
    is_readyForChat = false;
    commentList = [];
    mounted(){
        this.getPlayInfo();
        this.connectChatRoom();
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
    async connectChatRoom(){
        let ws_api = this.$gConst.wsHost;
        this.chatroom_ws = new WebSocket(ws_api);
        this.chatroom_ws.addEventListener('open', () => {
            this.wsSend({
                token: localStorage.getItem('token') || "",
                roomid: this.$route.params.uid,
                cmd: 1
            });
            this.wsStartHeartbeat();
        });

        this.chatroom_ws.addEventListener('message', e => {
            let msg = JSON.parse(e.data);
            switch (msg.cmd) {
                case 1:
                    {
                        if(msg.error == 0){
                            this.is_readyForChat = true;
                        }
                    }
                    break
                case 2:
                    {
                        this.online = msg.online;
                    }
                    break;
                case 3:
                    {
                        this.commentList.splice(0, this.commentList.length - 999);
                        this.commentList.push(msg.comment);
                        //自动滚动到底部
                        this.$nextTick(() => {
                            let commentarea = document.getElementById('commentarea');
                            commentarea.scrollTop = commentarea.scrollHeight + 50;
                        });
                    }
                    break;
                default:
                    break;
            }
        });
    }
    async wsStartHeartbeat(){
        while(this.chatroom_ws !== undefined && this.chatroom_ws !== null && this.chatroom_ws.readyState == 1){
            this.wsSend({
                cmd: 2
            });
            await sleep(30000);
        }
    }
    async wsSend(msg){
        if(this.chatroom_ws !== undefined && this.chatroom_ws !== null && this.chatroom_ws.readyState == 1){
            this.chatroom_ws.send(JSON.stringify(msg));
        }else{
            console.log("ws 连接已关闭或未成功建立");
        }
    }
    async sendComment(){
        if(this.input_comment !== ""){
            this.wsSend({
                cmd: 3,
                comment: {
                    content: this.input_comment
                }
            })
            this.input_comment = "";
        }

    }
}
export default LivePage;
</script>