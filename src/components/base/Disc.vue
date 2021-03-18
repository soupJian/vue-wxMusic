<template>
	<div class="disc">
      <ul>
        <li v-for="item of DiscList" :key="item.id" @click="selectAblum(item)">
          <div class="icon">
            <img width="60" height="60" v-lazy="item.picUrl || item.coverImgUrl"/>
          </div>
          <div class="text">
            <h2 class="name" v-html="item.name"></h2>
            <p class="desc" v-html="item.copywriter || item.description"></p>
          </div>
        </li>
      </ul>
  </div>
</template>

<script>
export default {
	props:{
		DiscList:{
			type:Array,
			required:true
		}
  },
    methods: {
        selectAblum(item) {
          if(item.type =='专辑') { // 区别专辑和歌单，存在则表示专辑
            this.$store.commit('setAlbum',item)
            this.$store.commit("setValue",'专辑')
            this.$router.push('/album/'+ item.id)
          } else { // 如果是歌单
            this.$store.commit('setSongList',item)
            this.$store.commit("setValue",'歌单')
            this.$router.push('/songList/'+ item.id)
          }
        }
    }
}
</script>

<style scoped="scoped" lang="stylus">
@import "../../common/stylus/variable.styl"
 .disc
    padding 0 20px
    li
        display flex
        box-sizing: border-box
        align-items: center
        padding-bottom 15px
      .text 
            display: flex
            min-width: 0; /* 使得后面的文字有省略号 */
            padding-left 20px
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            font-size: $font-size-medium
            .name
                margin-bottom: 10px
                color: $color-text
                overflow: hidden
                text-overflow ellipsis
                white-space nowrap
            .desc
                color: $color-text-d
                overflow: hidden
                text-overflow ellipsis
                white-space nowrap
</style>
