export const parseLyric = (lyric) => {
    let lines = lyric.split('\n'), //将文本按行分隔，存入数组
      pattern = /\[\d*:\d*((\.|:)\d*)*\]/g, //正则表达式
        result = []; //保存最终结果的数组
    lines.forEach(item => {
      let time = item.match(pattern), //返回与正则匹配的字符串的数组，正则中有/g，为全部
        value = item.replace(pattern, ''); //提取歌词
      if (time) {
        let t = time[0].slice(1, -1).split(':'); //去掉时间里的中括号并分割
        if (t.length === 3) {
          //[00:00:00]
          result.push({
            time:
              parseInt(t[0], 10) * 60 + parseInt(t[1]) + parseFloat('0.' + t[2]),
            line: value,
            currentLine: false,
          }); //最终数组
        } else {
          result.push({
            time: parseInt(t[0], 10) * 60 + parseFloat(t[1]),
            line: value,
            currentLine: false,
          });
        }
      }
    });
    return result;
  };