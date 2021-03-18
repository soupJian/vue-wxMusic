<template>
    <div class="quickSearch" v-show="query != ''">
        <div class="quick">
            <div class="search_query"  @click="querySearch">
                <span>详细搜索</span>
                <span class="span_query">{{query}}</span>
            </div>
            <div v-show="quickObj.artists && quickObj.artists.length > 0" class="quick_singer_wrap" >
                <div class="quick_singer_title">歌手</div>
                <div class="quick_singer_item" 
                    v-for="item of quickObj.artists" :key="item.id" 
                    @click="selectSinger(item)"
                >
                    <img v-lazy="item.picUrl">
                    <p> {{item.name}}</p>
                </div>
            </div>
            <div v-show="quickObj.songs && quickObj.songs.length > 0" class="quick_singer_wrap">
                <div class="quick_singer_title">单曲</div>
                <div class="quick_singer_item" 
                    v-for="item of quickObj.songs" :key="item.id" 
                    @click="selectMusic(item)"
                >
                    <p> {{item.name}}</p>
                </div>
            </div>
            <div v-show="quickObj.albums && quickObj.albums.length > 0" class="quick_singer_wrap">
                <div class="quick_singer_title">专辑</div>
                <div class="quick_singer_item"
                    v-for="item of quickObj.albums" :key="item.id" 
                    @click="selectAlbum(item)"
                >
                    <img v-lazy="item.artist.picUrl">
                    <p> {{item.name}}</p>
                </div>
            </div>
            <div v-show="quickObj.playlists && quickObj.playlists.length > 0" class="quick_singer_wrap">
                <div class="quick_singer_title">歌单</div>
                <div class="quick_singer_item" 
                    v-for="item of quickObj.playlists" :key="item.id" 
                    @click="selectSongs(item)"
                >
                    <img v-lazy="item.coverImgUrl">
                    <p> {{item.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {request} from '../../common/js/request'
export default {
    props: {
        query: {
            type: String,
            default: ''   
        }
    },
    data() {
        return{
            quickObj: {},
            historyQuery: []
        }
    },
    watch: {
        query() {
            if(this.query == '') {
                this.quickObj = []
                return
            }
            this.quickSearch()
        }
    },
    methods: {
        async quickSearch() {
            const { data: res } = await request({
                url:'/search/suggest?keywords='+this.query
            })
            this.quickObj = res.result
        },
        selectSinger(item){
            this.$store.commit('setSinger', item)
            this.$router.push('/singer/'+item.id)
            this.local()
        },
        selectMusic(item){
            item.dt = item.duration
            item.ar = item.artists
            item.al = item.album
            this.$store.commit('setPlayList', [item]) //传递当前播放歌曲列表
            this.$store.commit('setRandomList',[item]) //传递顺序播放列表
            this.$store.commit('setCurrentIndex', 0) // 传递当前播放歌曲索引
            this.$store.commit('setFullScreen',true) //传递当前播放歌曲列表
            this.local()
        },
        selectAlbum(item){
            item.picUrl = item.artist.picUrl
            this.$store.commit('setAlbum',item)
            this.$router.push('/album/'+ item.id)
            this.local()
        },
        selectSongs(item){
            item.picUrl = item.coverImgUrl
            this.$store.commit('setSongList',item)
            this.$router.push('/songList/'+ item.id)
            this.local()
        },
        async getSongDetail(item){
            const { data: res } = await request({
                url:'/song/detail?ids='+item.id
            })
            if(res.songs.length == 0){
                return item
            }else{
                return res.songs[0]
            }
        },
        // 封装存储的方法
        local() {
            this. historyQuery = JSON.parse(localStorage.getItem('historyQuery')) || []
            // 进行本地存储
            this.historyQuery.forEach((item,index)=> {
                if(item === this.query) {
                    this.historyQuery.splice(index,1)
                }
            })
            this.historyQuery.unshift(this.query)
            localStorage.setItem("historyQuery", JSON.stringify(this.historyQuery))
        },
        querySearch() {
            this.$router.push('/search/'+this.query)
            this.local()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable.styl"
.quickSearch
    position fixed
    margin 0 20px
    padding-bottom 10px
    width calc( 100% - 40px)
    color $color-text-d
    z-index 2
    background-color $color-highlight-background
    .quick
        .search_query
            padding 10px
            .span_query
                font-size 16px
                padding-left 10px
                color $color-theme
        .quick_singer_wrap
            .quick_singer_title
                font-size 16px
                padding 10px 10px
                color $color-theme
            .quick_singer_item
                display flex
                padding 5px 20px 0
                img
                    width 40px
                    height 40px
                    margin-right 10px
                p
                    color $color-text-d
                    font-size 14px
                    align-self center
</style>