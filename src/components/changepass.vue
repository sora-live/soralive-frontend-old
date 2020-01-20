<template>
    <div class="login-area">
        <div class="alert alert-danger" role="alert" v-if="isAlert">
            <span>{{$t(alertInfo)}}</span>
        </div>
        <form class="form-horizontal" @submit.prevent="dochangepass">
            <div class="form-group">
                <label for="oldPassword" class="col-sm-2 control-label">{{$t("info.oldPassword")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="oldPassword" :placeholder="$t('info.oldPassword')" v-model="oldpass">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword" class="col-sm-2 control-label">{{$t("info.newPassword")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword" :placeholder="$t('info.newPassword')" v-model="password">
                </div>
            </div>
            <div class="form-group">
                <label for="inputPassword2" class="col-sm-2 control-label">{{$t("info.repass")}}</label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" id="inputPassword2" :placeholder="$t('info.repass')" v-model="repass">
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-default">{{$t("info.updatePassword")}}</button>
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
import { fetchPostWithSign } from '../util/fetchpost'

@Component
class ChangePassPage extends Vue {
    oldpass = "";
    password = "";
    repass = "";
    isAlert = false;
    alertInfo = "info.null";
    async dochangepass(){
        if(this.password!=this.repass){
            this.alertInfo = "tips.repassDifferent";
            this.isAlert = true;
        }else{
            let api = this.$gConst.apiRoot + "user/changepass";
            let res = await fetchPostWithSign(api, {
                token: localStorage.getItem('token') || "",
                oldpass: this.oldpass,
                pass: this.password,
            });
            let data = await res.json();
            if(data['error'] == 1){
                this.isAlert = true;
                this.alertInfo = data['info']
            }else{
                this.$gConst.globalbus.$emit("send-info", "tips.changePassSuccess");
                localStorage.removeItem('token');
                localStorage.removeItem('uname');
                localStorage.removeItem('sk');
                localStorage.removeItem('uid');
                localStorage.removeItem('user-type');
                this.$router.push('/login');
            }
        }
        
    }
}
export default ChangePassPage;
</script>