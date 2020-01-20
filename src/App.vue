<template>
  <div id="app">
        <Modal></Modal>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar-collapse" aria-expanded="false">
                        <span class="sr-only">{{ $t("action.toggleNavbar") }}</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <router-link class="navbar-brand" to="/">{{ $t("info.soralive") }}</router-link>
                </div>
                
                <div class="collapse navbar-collapse" id="bs-navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li><router-link to="/">{{ $t("info.home") }}</router-link></li>
                        <li><router-link to="/list">{{$t("info.allLive")}}</router-link></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{{$t("lang." + currentLang)}} <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><a href="javascript:;" @click="chlang('zh-CN')">{{$t("lang.zh-CN")}}</a></li>
                                <li><a href="javascript:;" @click="chlang('en-US')">{{$t("lang.en-US")}}</a></li>
                            </ul>
                        </li>
                        <template v-if="isLogin">
                        <li><router-link to="/reg">{{$t("info.reg")}}</router-link></li>
                        <li><router-link to="/login">{{$t("info.login")}}</router-link></li>
                        </template>
                        <template v-else>
                        <li class="dropdown">
                            <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aira-haspopup="true" aria-expanded="false">{{ uname }} <span class="caret"></span></a>
                            <ul class="dropdown-menu">
                                <li><router-link to="/user">{{$t("info.userCenter")}}</router-link></li>
                                <li><a href="javascript:;" @click="jumptomyroom">{{$t("info.myLiveRoom")}}</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="javascript:;" @click="logout">{{$t("info.logout")}}</a></li>
                            </ul>
                        </li>
                        </template>
                    </ul>
                </div>

            </div>
        </nav>
        <div class="container-fluid main-content">
            <router-view></router-view>
        </div>
        <footer class="footer">
            <div class="container-fluid footer-content">
                <div>©SoraLive 2018-2020.</div>
                <div>Special Thanks to MeowSound Idols and other supporters.</div>
            </div>
        </footer>
  </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/dist/css/bootstrap.css";
body{
    padding-top: 70px;
}
.main-content{
    min-height: 100vh;
}
.footer {
    width: 100%;
    height: 60px;
    background-color: #ebebeb;
}
.footer-content {
    padding-top: 10px;
    color: #666;
}
</style>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Modal from './components/modal.vue'
import {fetchPostWithSign} from './util/fetchpost'

@Component({
    components:{
        Modal
    }
})
class App extends Vue {
    get currentLang(){
        return this.$i18n.locale;
    }
    get isLogin(){
        return localStorage.getItem('token') == null;
    }
    get uname(){
        return localStorage.getItem('uname') || "[][NULL]";
    }
    created(){
        console.log("SoraLive 0.1.0 created by MoewSound Idols.");
        this.$i18n.locale = localStorage.getItem("lang") || "zh-CN";
    }
    chlang(v){
        this.$i18n.locale = v;
        localStorage.setItem("lang", v);
    }
    async logout(){
        let url = this.$gConst.apiRoot + "user/logout";
        let res = await fetchPostWithSign(url, {
            token: localStorage.getItem('token') || ""
        });
        let json = await res.json();
        if(json['error'] != 0){
            this.$gConst.globalbus.$emit("send-info", json['info']);
        }else{
            this.$gConst.globalbus.$emit("send-info", "tips.unloginSucceed");   
        }
        this.$router.push('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('uname');
        localStorage.removeItem('sk');
        localStorage.removeItem('uid');
        localStorage.removeItem('user-type');
        location.reload();
    }
    async jumptomyroom(){
        var type = parseInt(localStorage.getItem('user-type') || "0");
        if(type & 1 == 1){
            var uid = localStorage.getItem('uid') || "0";
            this.$router.push('/live/' + uid);
        }else{
            this.$router.push('/user');
        }
    }
}

export default App;
</script>

