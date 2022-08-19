const plugin = {
    begin: 0,
    install(Vue) {
        Vue.prototype.briefMyAddress = function (value) {
            let startMyAddress = value?.substr(0, 10);
            let midMyAddress = ".".repeat(3);
            let endMyAddress = value?.substr(-10, 10);
            return startMyAddress + midMyAddress + endMyAddress;
        };
        Vue.prototype.throttle = function (fn, delay) {
                let curTime = Date.now();
                if (curTime - plugin.begin > delay) {
                    fn.call(this);
                    plugin.begin = curTime;
                }
        };
        Vue.prototype.copyContent = function (message, tips) {
            this.$toast.clear();
            this.$copyText(message).then(
                (e) => {
                    this.$toast.success(tips, {
                        position: "bottom-right",
                    });
                },
                (e) => {
                    this.$toast.error("复制失败，请稍后重试");
                }
            );
        };
        Vue.prototype.ThousandSeparator = function (value) {
            if (!value) return "";
            return (
                value &&
                value
                    .toString()
                    .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
            );
        };
    },
};
export default plugin;
