import {sutraActions} from "./sutra-slice.js";
import {invoke} from "@tauri-apps/api";
import {resourceDir} from "@tauri-apps/api/path";
import {readDir, readTextFile} from "@tauri-apps/api/fs";

export const fetchSutras = () => {
  console.log("FetchSutras method started")
  return async (dispatch) => {
    const fetchData = async () => {
      const resourceDirectory = await resourceDir();
      console.log("The resource dir is:", resourceDirectory);
      const files = await readDir(`${resourceDirectory}sutras`).catch((e) => console.error("An error has occurred", e));
      if (!files) {
        console.error("Sutra file fetch error");
      }
      console.log("Files are", files);
      let sutraTitles = [];
      let sutras = [];
      for (const file of files) {
        const filePath = file.path;
        console.log("File path is: ", file.path);
        const fileData = await readTextFile(filePath);
        console.log("raw file data is", fileData)
        const sutra = JSON.parse(fileData);
        console.log("Sutra is ", sutra);
        sutraTitles.push(sutra.title);
        sutras.push(sutra);
      }
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
      } catch (error) {
        console.error("Error reading sutra files:", error);
      }
    }
  }

