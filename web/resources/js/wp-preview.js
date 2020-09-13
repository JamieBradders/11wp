import Vue from "vue";

import Preview from "./wp/Preview.vue";

function init() {
  new Vue({
    el: "#preview",
    components: { Preview },
  });
}

init();
