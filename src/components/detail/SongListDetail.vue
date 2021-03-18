<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :type="type"></music-list> 
    </transition>
</template>
<script>
import musicList from '../list/musicList'
import { mapState} from 'vuex'
import {request} from '../../common/js/request'
export default {
    components: {
        musicList
    },
    data() {
        return {
            songs: [],
            type: '歌单'
        }
    },
    methods: {
        // 获取歌手热门歌曲
        async fetchSongListDetail() {
            if (!this.songList.id) { 
                // 解决刷新时候让他返回
                this.$router.back()
            }
            this.songs = []
            const { data: res}= await request({
                url: '/playlist/detail?id='+ this.songList.id
            })
            this.songs = res.playlist.tracks
        }
    },
    computed: {
        ...mapState({
            songList: 'songList'
        }),
        title() {
            return this.songList.name
        },
        bgImage() {
            return this.songList.picUrl || this.songList.coverImgUrl
        }
    },
    mounted() {
        this.fetchSongListDetail();
    },
    watch: {
        songList() {
            if(this.songList == undefined){
                return
            }
            this.fetchSongListDetail()
        }
    },
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable.styl'
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>