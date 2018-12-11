<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{$t(alertInfo)}}</span>
        </div>
        <form class="form-horizontal" @submit.prevent="doreg">
            <div class="form-group">
                <label for="inputUname" class="col-sm-2 control-label">{{$t("info.uname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUname" :placeholder="$t('info.uname')" v-model="uname">
                </div>
            </div>
            <div class="form-group">
                <label for="inputEmail" class="col-sm-2 control-label">{{$t("info.email")}}</label>
                <div class="col-sm-10">
                    <input type="email" class="form-control" id="inputEmail" :placeholder="$t('info.email')" v-model="email">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword" class="col-sm-2 control-label">{{$t("info.password")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="$t('info.password')" v-model="password">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword2" class="col-sm-2 control-label">{{$t("info.repass")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword2" :placeholder="$t('info.repass')" v-model="repass">
                </div>
            </div>
            <div class="form-group">
                <label for="inputRoomname" class="col-sm-2 control-label">{{$t("info.roomname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputRoomname" :placeholder="$t('info.roomname')" v-model="roomname">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">{{$t("info.reg")}}</button>
                </div>
            </div>
        </form>
    </div>
</template>

<style lang="scss">
.login-area{
    min-width: 300px;
    max-width: 600px;
    width: 50%;
    margin: auto;
    padding-top: 50px;
}
</style>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import fetchPost from '../util/fetchpost'

@Component
class RegPage extends Vue {
    uname = "";
    email = "";
    password = "";
    repass = "";
    roomname = "";
    isAlert = false;
    alertInfo = "info.null";
    created(){
        if(localStorage.getItem("token") != null){
            this.$gConst.globalbus.$emit("send-info", "tips.alreadyLogin");
            this.$router.push('/');
        }
    }
    async doreg(){
        if(this.password!=this.repass){
            this.alertInfo = "tips.repassDifferent";
            this.isAlert = true;
        }else{
            let api = this.$gConst.apiRoot + "user-reg";
            let res = await fetchPost(api, {
                uname: this.uname,
                email: this.email,
                pass: this.password,
                roomname: this.roomname
            });
            let data = await res.json();
            if(data['error'] == 1){
                this.isAlert = true;
                this.alertInfo = data['info']
            }else{
                this.$gConst.globalbus.$emit("send-info", "tips.registerSuccess");
                this.$router.push('/login');
            }
        }
        
    }
}
export default RegPage;
</script>