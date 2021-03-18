<template>
    <div class="search-result">
        <!-- 搜索框 -->
        <div class="search-box-wrapper">
            <i class="icon-back" @click="back"></i>
            <input class="box" v-model="query" placeholder="搜索歌曲、歌手" ref="query"/>
            <i class="icon-dismiss" v-show="query" @click="clear"></i>
        </div>
        <!-- tab -->
        <div class="tab-t">
            <span v-for="item of tabList" :key="item.type" v-html="item.name" class="item"
                  @click="changeT(item.type)" :class="type == item.type ?'active':''"
            ></span>
        </div>
        <div class="result" ref="result">
            <!-- 歌曲 -->
            <scroll :list="resultMusic" v-show="type==1" class="music-scroll" ref="songScroll">
                <div>
                    <music-item :songs="resultMusic" class="result-music"></music-item>
                    <div class="loading-container">
                        <loading v-show="!resultMusic.length && !showNoResult"/>
                        <no-result v-show="showNoResult"></no-result>
                    </div>
                </div>
            </scroll>
            <!-- 专辑 -->
            <scroll :list="resultMusic" v-show="type==10" class="music-scroll" ref="albumScroll">
                <div>
                    <disc :DiscList="resultAlbum"/>
                    <div class="loading-container">
                        <loading v-show="!resultAlbum.length && !showNoResult"/>
                        <no-result v-show="showNoResult"></no-result>
                    </div>
                </div>
            </scroll>
            <!-- 歌手 -->
            <scroll :list="resultMusic" v-show="type==100" class="music-scroll" ref="singerScroll">
                <div>
                    <singer-list :singerList="resultSinger"></singer-list>
                </div>
                <div class="loading-container">
                        <loading v-show="!resultSinger.length && !showNoResult"/>
                        <no-result v-show="showNoResult"></no-result>
                </div>
            </scroll>
            <!-- 歌单 -->
            <scroll :list="resultSongList" v-show="type==1000" class="music-scroll" ref="listscroll">
                <div>
                    <disc :DiscList="resultSongList"/>
                    <div class="loading-container">
                        <loading v-show="!resultSongList.length && !showNoResult"/>
                        <no-result v-show="showNoResult"></no-result>
                    </div>
                </div>
            </scroll>
            <!-- mv -->
            <scroll :list="resultMusic" v-show="type==1004" class="music-scroll">
                <div class="mv_scroll">
                    <div class="item_mv" v-for="item of resultMv" :key="item.docid" @click="playMv(item.id)">
                        <img v-lazy="item.cover" alt="">
                        <div class="name">{{item.name}}</div>
                        <div class="singer">{{item.artistName}}</div>
                        <div class="count">播放次数： {{item.playCount}}</div>
                    </div>
                    <div class="loading-container">
                        <loading v-show="!resultMv.length && !showNoResult"/>
                        <no-result v-show="showNoResult"></no-result>
                    </div>
                </div>
            </scroll>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import scroll from '../base/Scroll'
import Disc from '../base/Disc'
import loading from '../base/Load'
import singerList from '../singer/SingerList'
import MusicItem from '../list/MusicItem'
import NoResult from './NoResult'
import { playListMixin } from '../../common/js/mixin'
import {request} from '../../common/js/request'
export default {
    mixins: [ playListMixin ],
    components: {
        scroll,
        Disc,
        loading,
        singerList,
        MusicItem,
        NoResult
    },
    data() {
        return {
            query: '',
            resultMusic: [], // 歌曲列表
            resultSongList: [], // 歌单列表
            resultLyric: [],  // 歌词列表
            resultAlbum: [], // 专辑列表
            resultSinger: [], // 歌手列表
            resultMv: [], // MV列表
            type: 1, // 搜索参数
            tabList: [
                { 'type': 1, 'name': '单曲' },
                { 'type': 10, 'name': '专辑' },
                { 'type': 100, 'name': '歌手' },
                { 'type': 1000, 'name': '歌单' },
                // { 'ttype': 1002, 'name': '用户' },
                { 'type': 1004, 'name': 'mv' }
            ],
            showNoResult: false // 如果没有搜索结果
        }
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.result.style.bottom = bottom
            this.$refs.songScroll.refresh()
        },
        back() {
            this.$router.back()
        },
        clear() {
            this.query = ''
            this.$refs.query.focus()
        },
        changeT(type) {
            this.type = type
            this.fetchSearch()
        },
         async fetchSearch() {
            this.showNoResult = false
            // 进行以下判断，如果每个数组已经存在了，就不需要在发送请求了
            if (this.type == 1 && this.resultMusic.length != 0) return
            if (this.type == 10 && this.resultAlbum.length !=0) return 
            if (this.type == 100 && this.resultSinger.length !=0) return
            if (this.type == 1000 && this.resultSongList.length !=0) return
            if (this.type == 1004 && this.resultMv.length !=0) return
            if(!this.query) return
            const { data:res } = await request({
                url:`/search?type=${this.type}&keywords=${this.query}`,
            })
            if(this.type == 1){
                if(res.result.songCount == 0){
                    this.showNoResult = true
                    return
                }
                this.resultMusic = res.result.songs
            }
            if(this.type == 10){
                if(res.result.albumCount == 0){
                    this.showNoResult = true
                    return
                }
                this.resultAlbum = res.result.albums
            }
            if(this.type == 100){
                if(res.result.artistCount == 0){
                    this.showNoResult = true
                    return
                }
                this.resultSinger = res.result.artists
            }
            if(this.type == 1000){
                if(res.result.playlistCount == 0){
                    this.showNoResult = true
                    return
                }
                this.resultSongList = res.result.playlists
            }
            if(this.type == 1004){
                if(res.result.mvCount == 0){
                    this.showNoResult = true
                    return
                }
                this.resultMv = res.result.mvs
            }
        },
        playMv(id){
            this.$router.push('/mv/'+id)
        }
    },
    activated() {
        this.query = this.$route.params.query
    },
    watch: {
        query() {
            if(this.query =='') {
                return
            }
            this.resultMusic = [] // 歌曲列表
            this.resultSongList = [] // 歌单列表
            this.resultAlbum = [] // 专辑列表
            this.resultSinger = [] // 歌手列表
            this.resultMv = [] // MV列表
            this.fetchSearch()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.search-result
    position fixed
    top 0
    bottom 0
    width 100%
    background-color $color-background
    .search-box-wrapper
        margin 20px
        display flex
        height 40px
        background: $color-highlight-background
        align-items center
        .icon-back
            font-size: 24px
            color: $color-theme
        .box
            flex: 1
            outline none
            line-height 18px
            padding 0 15px
            background: $color-highlight-background
            color: $color-text
            font-size: $font-size-medium
            &::placeholder
                color: $color-text-d
        .icon-dismiss
            font-size: 16px
            padding-right 10px
            color: $color-background
    .tab-t
        display flex
        padding 0 10px
        justify-content center
        .item 
            flex 1
            text-align center
            padding-bottom 10px
        .active 
            color $color-theme
            border-bottom: 2px solid $color-theme
    .result
        position fixed
        width 100%
        top 118px
        bottom 0
        .music-scroll
            height 100%
            overflow hidden
            .result-music
                padding 0 20px
            
            .item_mv
                padding 0 10px 20px
                position relative
                img 
                    width 100%
                    height 200px
                    border-radius 5px
                .name,.singer,.count
                    position absolute
                    left 20px
                .name
                    top 10px
                    width calc(100% - 20px)
                    display -webkit-box
                    -webkit-box-orient vertical
                    -webkit-line-clamp 2
                    text-overflow ellipsis
                    overflow hidden
                .singer
                    top 55px
                    font-size 12px
                .count
                    bottom 30px

.loading-container
    position fixed
    bottom 50%
    left 50%
    transform translate(-50%,-30%)
</style>