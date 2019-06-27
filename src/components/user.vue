<template>
    <div class="container-fluid">
        <div class="col-sm-8">
            <section v-if="isOpen">
                <div>
                    <h3>{{$t("info.liveroomInfo")}}</h3>
                    <p>
                        {{$t("info.status")}}:
                        <button class="btn" :class="{'btn-default': streaming, 'btn-success': !streaming}" @click="setStreamClose">{{$t("info.close")}}</button>
                        <button class="btn" :class="{'btn-default': !streaming, 'btn-success': streaming}" @click="setStreamOpen">{{$t("info.open")}}</button>
                    </p>
                    <p>
                        {{$t("info.roomname")}}:
                        <input class="textbox" type="text" v-model="roomname" size="70">
                    </p>
                    <p>
                        {{$t("info.description")}}:
                        <textarea class="textarea" v-model="description" cols="70" rows="6"></textarea>
                    </p>
                    <p>
                        <button class="btn btn-primary" @click="updateRN">{{$t("info.updateRN")}}</button>
                    </p>
                </div>
                <div>
                    <h3>{{$t("info.streamParam")}}</h3>
                    <p>{{$t("info.streamServer")}}: {{streaming_address}} <button class="btn btn-info btn-sm" @click="copyStreamingURL">{{$t("action.copy")}}</button></p>
                    <p>{{$t("info.streamKey")}}: {{streamkey || $t("tips.clickButtonBelowToResetStreamKey")}} <button class="btn btn-info btn-sm" @click="copyStreamKey">{{$t("action.copy")}}</button></p>
                    <p>
                        <button class="btn btn-info" @click="resetSK">{{$t("info.resetStreamKey")}}</button>
                        <br>
                        <span style="color: #666">{{$t("tips.resetStreamKeyTips1")}}</span>
                        <br>
                        <span style="color: #666">{{$t("tips.resetStreamKeyTips2")}}</span>
                    </p>
                </div>
            </section>
            <section v-else>
                <div v-html="$t(loadingInfo)"></div>
            </section>
        </div>
        <div class="col-sm-4">
            <h3>{{$t("info.basicInfo")}}</h3>
            <p>UID: {{uid}}</p>
            <p>{{$t("info.email")}}: {{email}}</p>
            <p>{{$t("info.uname")}}: {{uname}}</p>
        </div>
    </div>
</template>

<style lang="scss">
.textbase {
    color: black;
    border-radius: 4px;
    border: 1px solid rgb(202, 202, 202);
    padding: 10px;
    font-size: 14px;
}

.textbox {
    @extend .textbase;
    height: 34px;
}

.textarea {
    @extend .textbase;
}
</style>


<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fetchpost, { fetchPostWithSign } from '../util/fetchpost'
import copyTextToClipboard from '../util/copytext'

@Component
class UserPage extends Vue {
    cover = '';
    description = '';
    email = '';
    roomname = '';
    streaming = false;
    streamkey = '';
    type = 0;
    uid = 0;
    uname = '';
    loadingInfo = 'info.loading';
    streaming_address = '';
    created() {
        this.refresh();
    }
    async refresh() {
        let api = this.$gConst.apiRoot + "user/detail";
        let res = await fetchPostWithSign(api, {
            token: localStorage.getItem('token') || ""
        });
        let json = await res.json();
        if (json['error'] != 0) {
            this.$gConst.globalbus.$emit("send-info", json['info']);
            return;
        } else {
            localStorage.setItem('user-type', json['user']['type']);
            localStorage.setItem('uid', json['user']['uid']);
            localStorage.setItem('uname', json['user']['uname']);
            this.uid = json['user']['uid'];
            this.uname = json['user']['uname'];
            this.type = json['user']['type'];
            this.streamkey = json['user']['streamkey'];
            this.roomname = json['user']['roomname'];
            this.email = json['user']['email'];
            this.description = json['user']['description'];
            this.cover = json['user']['cover'];
            this.streaming = json['user']['streaming'] == "1";
            this.streaming_address = json['streaming_address'];
            this.loadingInfo = "tips.needApprove";
        }
    }
    get isOpen() {
        return (this.type & 1) == 1;
    }
    get isAdmin() {
        return (this.type >> 4 & 1) == 1;
    }
    async setStreamOpen() {
        if (!this.streaming) {
            let api = this.$gConst.apiRoot + "set-roomstatus";
            let res = await fetchpost(api, {
                token: localStorage.getItem('token') || "",
                status: 1
            });
            let json = await res.json();
            if(json['error']==0){
                this.streaming = true;
            }else{
                this.$gConst.globalbus.$emit("send-info", json['info'])
            }
        } else {
            console.log("[BAKA INFO] Streaming is already OPEN.");
        }
    }
    async setStreamClose() {
        if (this.streaming) {
            let api = this.$gConst.apiRoot + "set-roomstatus";
            let res = await fetchpost(api, {
                token: localStorage.getItem('token') || "",
                status: 0
            });
            let json = await res.json();
            if(json['error']==0){
                this.streaming = false;
            }else{
                this.$gConst.globalbus.$emit("send-info", json['info'])
            }
        } else {
            console.log("[BAKA INFO] Streaming is already CLOSE.");
        }
    }
    async updateRN(){
        let rn = this.roomname || "";
        let desc = this.description || "";

        let api = this.$gConst.apiRoot + "update-rn";
        let res = await fetchpost(api, {
            token: localStorage.getItem('token') || "",
            roomname: rn,
            description: desc
        });
        let json = await res.json();
        if(json['error']==0){
            this.$gConst.globalbus.$emit("send-info", "tips.updateRnSucceed");
        }else{
            this.$gConst.globalbus.$emit("send-info", json['info'])
        }
    }
    async resetSK(){
        let api = this.$gConst.apiRoot + "reset-streamkey";
        let res = await fetchpost(api, {
            token: localStorage.getItem('token') || ""
        });
        let json = await res.json();
        if (json['error'] != 0) {
            this.$gConst.globalbus.$emit("send-info", json['info']);
            return;
        }else{
            location.reload();
        }
    }
    copyStreamingURL(){
        copyTextToClipboard(this.streaming_address);
    }
    copyStreamKey(){
        copyTextToClipboard(this.streamkey);
    }
}
export default UserPage;
</script>