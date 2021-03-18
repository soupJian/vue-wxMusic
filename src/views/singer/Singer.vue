<template>
	<div class="Singer" ref="singer">
        <singer-category 
        :areaList="areaList" 
        :typeList="typeList"
        :area="area"
        :type="type"
        @changeType="changeType"
        @changeArea="changeArea"
        />
        <scroll :list="singerList" class="singer-scroll" ref="scroll">
            <div>
                <singer-list :singerList="singerList"/>
            </div>
        </scroll>
        <div class="loading-container" v-show="!singerList.length">
            <Loading/>
        </div>
	</div>
</template>

<script>
import SingerCategory from '../../components/singer/SingerCategory'
import SingerList from '../../components/singer/SingerList'
import Loading from '../../components/base/Load'
import Scroll from '../../components/base/Scroll'
import { playListMixin } from '../../common/js/mixin'
import {request} from '../../common/js/request'
export default {
    mixins: [ playListMixin ], // 组件同名方法可以覆盖mixin方法
	components:{
		SingerCategory,
        SingerList,
        Loading,
        Scroll
    },
    data(){
        return {
            type: -1,
            area: -1,
            areaList: [
                { title: '全部', key: -1 },
                { title: '华语', key: 7 },
                { title: '欧美', key: 96 },
                { title: '日本', key: 8 },
                { title: '韩国', key: 16 },
                { title: '其他', key: 0 }
            ],
            typeList: [
                { title: '全部', key: -1 },
                { title: '男', key: 1 },
                { title: '女', key: 2 },
                { title: '乐队', key: 3 }
            ],
            singerList: [], // 获取歌手列表
        }
    },
    methods: {
        // 底部留白
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.singer.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
         /* 获取歌手列表*/
        async fetchSingerlist () {
            /* 利用params将点击的属性传给接口*/
            this.singerList = []
            const result = await request({
                url: `/artist/list?type=${this.type}&area=${this.area}`,
            })
            this.singerList = result.data.artists
        },
        changeType(key){
            this.type = key
            this.fetchSingerlist()
        },
        changeArea(key){
            this.area = key
            this.fetchSingerlist()
        }
    },
    created() {
        this.fetchSingerlist()
    }
}
</script>

<style scoped lang="stylus"> 
.Singer
  position: fixed
  width: 100%
  top: 88px
  bottom: 0
  .singer-scroll
    margin-top 10px
    height calc(100% - 78px) // 减去上面category高度
    overflow: hidden
  .loading-container
    position absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
