import {sutraActions} from "./sutra-slice.js";
import {invoke} from "@tauri-apps/api";

export const fetchSutras = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const files = await invoke('get_files');
      if (!files) {
        console.log("Sutra file fetch error");
      }
      let sutraTitles = [];
      let sutras = [];
      files.forEach((s) => {
        const sutra = JSON.parse(s);
        sutraTitles.push(sutra.title);
        sutras.push(sutra);
      });
      return {sutraTitles: sutraTitles, sutras: sutras};
    }

    try {
      const sutraData = await fetchData();
      dispatch(
        sutraActions.setSutraData({
          sutras: sutraData.sutras,
          sutraTitles: sutraData.sutraTitles
        })
      )
    } catch(error) {
      console.log("Error reading sutra files");
    }
  }
}
