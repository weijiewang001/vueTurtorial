// object对象传值
export default{
  beforeMount(el, binding){
    // binding.value是绑定v-icon后面的icon type
    let iconClass = `fa fa-${binding.value.icon} text-green-400 text-2xl`;

    if(binding.value.right) {
      iconClass += ' float-right';
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
};
