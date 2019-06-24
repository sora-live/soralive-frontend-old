<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{$t(alertInfo)}}</span>
        </div>
        <form class="form-horizontal" @submit.prevent="dologin">
            <div class="form-group">
                <label for="inputUname" class="col-sm-2 control-label">{{$t("info.uname")}}</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="inputUname" :placeholder="$t('info.uname')" v-model="uname">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword" class="col-sm-2 control-label">{{$t("info.password")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="$t('info.password')" v-model="password">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">{{$t("info.login")}}</button>
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
import fetchpost from '../util/fetchpost'

import { JSEncrypt } from 'jsencrypt'

@Component
class LoginPage extends Vue {
    isAlert = false;
    alertInfo = "info.null";
    uname = "";
    password = "";
    created(){
        if(localStorage.getItem("token") != null){
            this.$gConst.globalbus.$emit("send-info", "tips.alreadyLogin");
            this.$router.push('/');
        }
    }
    async dologin(){
        let res = await fetchpost(this.$gConst.apiRoot + 'user/prelogin', {});
        let json = await res.json();
        
        let publicKey = json['key'];
        let token = json['token'];

        let jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(publicKey);
        let encryptedPassword = jsEncrypt.encrypt(this.password);
        if(!encryptedPassword){
            this.isAlert = true;
            this.alertInfo = "tips.loginencryptfailed";
            return;
        }
        
        let res2 = await fetchpost(this.$gConst.apiRoot + "user/login", {
            token,
            uname: this.uname,
            pass: encryptedPassword
        });
        let loginRes = await res2.json();

        if(loginRes['error'] != 0){
            this.isAlert = true;
            this.alertInfo = loginRes['info'];
            return;
        }

        localStorage.setItem('token', loginRes['token']);
        localStorage.setItem('sk', loginRes['user']['sk']);
        localStorage.setItem('uname', loginRes['user']['uname']);
        localStorage.setItem('uid', loginRes['user']['uid']);
        localStorage.setItem('user-type', loginRes['user']['type']);
        
        this.$gConst.globalbus.$emit("send-info", "tips.loginSucceed");
        this.$router.push('/');
        location.reload();

    }
}
export default LoginPage;
</script>