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
        <div class="modal fade" tabindex="-1" role="dialog" id="confirmDialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">{{$t('info.operationConfirmation')}}</h4>
                    </div>
                    <div class="modal-body">
                        <p>{{ confirmDialogInfo }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="confirmOk">{{$t('info.confirm')}}</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{$t('info.cancel')}}</button>
                    </div>
                </div>
            </div>
        </div>
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
                    <div class="comment-line" v-for="comment in commentList" :key="comment.cmtId" :class="{'bg-info': comment.author.uid === 0}">
                        <span class="comment-user">{{comment.author.uname}}：</span>
                        <span v-if="comment.isDeleted" class="comment-deleted">[{{$t('info.deletedMessage')}}]</span>
                        <span v-else>{{comment.comment.content}}</span>
                        <ul class="comment-op" v-if="isAdmin">
                            <li><a href="javascript:;" @click="retractComment(comment.cmtId)">删除</a></li>
                            <li><a href="javascript:;" @click="userban(comment.author)">封禁</a></li>
                        </ul>
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
        <div v-if="isAdmin">
            <h3>在线用户列表：</h3>
            <p><a href="javascript:;" @click="getOnline">刷新</a></p>
            <div v-for="u in onlineList" :key="u.uid" class="online-list">
                <span>{{ u.uname }}</span>
                <span class="online-b"><a href="javascript:;" @click="userban(u)">封禁</a></span>
            </div>
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
    cursor: pointer;
}
.comment-line:hover>.comment-op{
    display: inline;
}
.comment-op{
    display: none;
}
.comment-op li{
    display: inline;
    padding-left: 5px;
}
.comment-deleted{
    font-style: italic;
}
.online-b{
    padding-left: 200px;
}
.online-list{
    margin: 25px;
}
</style>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fetchpost, { fetchPostWithSign } from '../util/fetchpost';
import sleep from '../util/sleep'
import Player from './player.vue';
import $ from 'jquery'

@Component({
    components: {
        Player
    }
})
class LivePage extends Vue {
    roomid = 0;
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
    confirmDialogInfo = "";
    confirmDialogCallback = null;
    onlineList = [];
    mounted(){
        this.getPlayInfo();
        this.connectChatRoom();
    }
    beforeDestroy(){
        if(this.chatroom_ws !== undefined && this.chatroom_ws !== null){
            console.log("关闭ws");
            this.chatroom_ws.close();
        }
    }
    get isAdmin() {
        let type = parseInt(localStorage.getItem('user-type') || "0");
        return (type >> 4 & 1) == 1;
    }
    async getPlayInfo(){
        this.roomid = this.$route.params.uid;
        let api = this.$gConst.apiRoot + "index/roominfo";
        let res;
        if(localStorage.getItem('token') == null){
            res = await fetchpost(api, {
                uid: this.roomid
            });
        }else if(this.password == ""){
            res = await fetchPostWithSign(api, {
                uid: this.roomid,
                token: localStorage.getItem('token') || ""
            });
        }else{
            res = await fetchPostWithSign(api, {
                uid: this.roomid,
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
                roomid: this.roomid,
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
                        this.online = msg.online;
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
                        this.commentList.push(msg);
                        //自动滚动到底部
                        this.$nextTick(() => {
                            let commentarea = document.getElementById('commentarea');
                            commentarea.scrollTop = commentarea.scrollHeight + 50;
                        });
                    }
                    break;
                case 4:
                    {
                        switch(msg.subCmd) {
                            case 3:
                                {
                                    this.$router.push('/');
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('uname');
                                    localStorage.removeItem('sk');
                                    localStorage.removeItem('uid');
                                    localStorage.removeItem('user-type');
                                    this.$gConst.globalbus.$emit("send-info", "tips.youHaveBanned");
                                }
                                break;
                            case 4:
                                {
                                    for(let i in this.commentList){
                                        let cmt = this.commentList[i];
                                        if(cmt.cmtId == msg.extraInfo){
                                            cmt.isDeleted = true;
                                            this.commentList.splice(i, 1, cmt);
                                            break;
                                        }
                                    }
                                }
                                break;
                            default:
                                break;
                        }
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
    async retractComment(cmtId){
        if(this.isAdmin){
            let api = this.$gConst.apiRoot + "chatadmin/retractcomment";
            await fetchPostWithSign(api, {
                token: localStorage.getItem('token') || "",
                roomId: this.roomid,
                cmtId: cmtId
            });
        }
    }
    async userban(user){
        this.confirmDialogInfo = this.$t('tips.banConfirm', { uname: user.uname });
        this.confirmDialogCallback = async function(){
            let api = this.$gConst.apiRoot + "chatadmin/userban";
            await fetchPostWithSign(api, {
                token: localStorage.getItem('token') || "",
                roomId: this.roomid,
                uid: user.uid
            });
        }
        $("#confirmDialog").modal('show');
    }
    async confirmOk(){
        if (this.confirmDialogCallback){
            this.confirmDialogCallback();
        }
        $("#confirmDialog").modal('hide');
    }
    async getOnline(){
        if(this.isAdmin){
            let api = this.$gConst.apiRoot + "chatadmin/online";
            let res = await fetchPostWithSign(api, {
                token: localStorage.getItem('token') || "",
                roomId: this.roomid,
            });

            let resjson = await res.json();
            if(resjson["error"] != 0){
                this.$gConst.globalbus.$emit("send-info", resjson['info']);
            }

            this.onlineList = resjson["online"];
        }
    }
}
export default LivePage;
</script>