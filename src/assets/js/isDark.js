import { ref, computed } from "vue";

export default function useMode() {
  const mode = ref(false);
  const isDark = computed({
    get: () => mode.value,
    set: (val) => {
      mode.value = val;
      document.documentElement.setAttribute("data-theme", val ? "dark" : "light");
    },
  });
  // Initial
  isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
  return isDark
}
