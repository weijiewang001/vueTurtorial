//变量传值
export default{
  beforeMount(el, binding){
    // binding.value是绑定v-icon后面的icon type
    let iconClass = `fa fa-${binding.value} text-2xl`;

    // 绑定变量之后可以覆盖class
    if(binding.arg === 'full'){
      iconClass = binding.value;
    }

    if(binding.modifiers.right) {
      iconClass += ' float-right';
    }

    if(binding.modifiers.yellow){
      iconClass += ' text-yellow-400';
    }else{
      iconClass += ' text-green-400';
    }

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
};
