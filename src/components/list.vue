<template>
    <div class="container-fluid">
        <h1>{{$t('info.broadcasting')}}</h1>
        <div class="room-list" v-if="roomlist.length != 0">
            <div class="room-item" v-for="roomitem in roomlist" :key="roomitem.uid" @click="openRoom(roomitem.uid)">
                <div class="room-name">{{roomitem.roomname}}</div>
                <div class="room-user">@{{roomitem.uname}}</div>
            </div>
        </div>
        <div v-else class="room-empty">
            <p>{{$t('tips.liveRoomEmpty')}}</p>
            <p><router-link to="/user" class="btn btn-primary btn-lg" role="button">{{$t('info.imcomming')}}</router-link></p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.room-list{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
}
.room-item{
    height: 250px;
    width: 30%;
    border: 1px solid black;
    border-radius: 30px;
    margin: 10px;
    font-size: 20px;
    overflow: hidden;
    position: relative;
    transition: 0.3s all linear;
    cursor: pointer;
}
.room-item:hover{
    border: 1px solid rgb(238, 238, 238);
    background-color: rgb(238, 238, 238);
}
.room-name{
    font-size: 28px;
    font-weight: bold;
    margin-top: 50px;
    width: 100%;
    text-align: center;
}
.room-user{
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    z-index: 2;
    background-color: rgb(238, 238, 238);
}
.room-empty{
    margin-top: 50px;
    font-size: 50px;
    color: #999;
}
</style>


<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
class ListPage extends Vue{
    roomlist = [];
    mounted(){
        this.refresh();
    }
    async refresh(){
        let api = this.$gConst.apiRoot + "list-streaming";
        let res = await fetch(api);
        let roomlist = await res.json();
        this.roomlist = roomlist;
    }
    async openRoom(uid){
        this.$router.push('/live/' + uid);
    }
}
export default ListPage;
</script>

