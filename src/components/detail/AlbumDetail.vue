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
            type: '专辑'
        }
    },
    methods: {
        // 获取歌手热门歌曲
        async fetchAlbum() {
            if (!this.album.id) {
                // 解决刷新时候让他返回
                this.$router.back()
                return
            }
            this.songs = []
            const { data: res}= await request({
                url: '/album?id=' + this.album.id
            })
            this.songs = res.songs
        }
    },
    computed: {
        ...mapState({
            album: 'album'
        }),
        title() {
            return this.album.name
        },
        bgImage() {
            return this.album.picUrl
        }
    },
    mounted() {
        this.fetchAlbum()
    },
    watch: {
        album() {
            this.fetchAlbum()
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