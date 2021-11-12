import { ref, computed } from "vue";

export default function useMode() {
  const defaultIsDark = computed(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const store = ref("auto");
  const isDark = computed({
    get: () => (store.value == "auto" ? defaultIsDark : store.value),
    set: (val) => {
      store.value = val;
      document.documentElement.setAttribute(
        "data-theme",
        val ? "dark" : "light"
      );
    },
  });

  const onChangeMode = () => {
    isDark.value = !isDark.value;
  };

  return {
    isDark,
    onChangeMode,
  };
}
