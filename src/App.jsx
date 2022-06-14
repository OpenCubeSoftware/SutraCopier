import './App.css';
import {useCallback, useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import IndexScreen from "./screens/IndexScreen/IndexScreen.jsx";
import SutraScreen from "./screens/SutraScreen/SutraScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {BaseDirectory, readTextFile, readDir, createDir} from "@tauri-apps/api/fs";
import {sutraActions} from './store/sutra-slice.js';
import {sutras} from "./data/sutras.js";
import {useEffectOnce, useUnmount} from "react-use";
import {appWindow} from '@tauri-apps/api/window';
import {dialog} from '@tauri-apps/api';
import {invoke} from "@tauri-apps/api";

function App(callback, deps) {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.currentPage);
  const [currentSutra, setCurrentSutra] = useState('');
  const [currentSutraIndex, setCurrentSutraIndex] = useState(0);
  const sutraSettings = useSelector((state) => ({title: state.selectedSutra, index: state.sutraIndex}));



  const readSettingsFile = async () => {
    try {
      const settingsData = await readTextFile(`sutracopy/sutrasettings.json`,
        {
          dir: BaseDirectory.Data
        }
      );
      return JSON.parse(settingsData);
    } catch (e) {
      console.error(e);
    }
  }

  const createDataFolder = async () => {
    try {
      await createDir("sutracopy", {
        dir: BaseDirectory.Data,
        recursive: true,
      });
    } catch (e) {
      console.error("error creating folder: ", e);
    }
  }

  const createSutraArrays = () => {
    const sutraTitles = [];
    const sutraArray = [];
    sutras.forEach(s => {
      sutraTitles.push(s.title);
      sutraArray.push(s);
    })
    return {sutraTitles: sutraTitles, sutras: sutraArray};
  }

  useEffectOnce(() => {


    const sutraArrays = createSutraArrays();
    console.log("Sutra arrays", sutraArrays);
    dispatch(sutraActions.setSutraData({
      sutras: sutraArrays.sutras,
      sutraTitles: sutraArrays.sutraTitles
    }))
    const getSetSettings = async () => {
      // console.log(files);
      const settings = await readSettingsFile();

      console.log("settings read from file are ", settings);
      dispatch(sutraActions.setSutraSettings({settings: settings}));
    }
    getSetSettings();
    createDataFolder();
  })

  return (
    <>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          {page === 'index' &&
            <IndexScreen currentSutra={currentSutra} currentIndex={currentSutraIndex}/>
          }
          {page === 'sutra' &&
            <SutraScreen/>
          }
        </Grid>
      </Grid>
    </>
  );
}

export default App;
