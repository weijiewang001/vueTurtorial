export default{
  formatTime(time){
    const minutes = Math.floor( time / 60) || 0;
    const seconds = Math.round((time - minutes * 60) || 0);

    // 00:00
    // 如果秒针那里不满足十位时，需要在十位补一个0，满足时取消
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};