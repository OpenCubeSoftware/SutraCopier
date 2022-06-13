import './App.css';
import { useState} from 'react';
import {Grid} from "@mui/material";
import IndexScreen from "./screens/IndexScreen/IndexScreen.jsx";
import SutraScreen from "./screens/SutraScreen/SutraScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {BaseDirectory, readTextFile, readDir} from "@tauri-apps/api/fs";
import {sutraActions} from './store/sutra-slice.js';
import {fetchSutras} from "./store/sutra-actions.js";
import {useEffectOnce, useUnmount} from "react-use";
/*import {uiActions} from "./store/ui-slice.js";
import {resourceDir} from "@tauri-apps/api/path";
import {isEmpty} from "lodash";
import {appWindow} from '@tauri-apps/api/window';*/

function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.currentPage);
  const [currentSutra, setCurrentSutra] = useState('');
  const [currentSutraIndex, setCurrentSutraIndex] = useState(0);
  const sutraSettings = useSelector((state) => ({title: state.selectedSutra, index: state.sutraIndex}));

  const readSettingsFile = async () => {
    try {
      const settingsData = await readTextFile(`./sutracopy/sutracopy.settings.json`,{dir: BaseDirectory.Data});
      return JSON.parse(settingsData);
    } catch (e) {
      console.error(e);
    }
  }



  useEffectOnce( () => {

    dispatch(fetchSutras());
    const getSetSettings = async () => {
      // console.log(files);
      const settings = await readSettingsFile();
      // console.log("settings read from file are ", settings);

      dispatch(sutraActions.setSutraSettings({sutraTitle: settings.title, sutraIndex: settings.sutraIndex}));
    }
    getSetSettings();
  })

  // console.log("sutra settings from app.jsx", sutraSettings);

  return (
    <>
      <Grid container spacing={2}>

        <Grid item xs={12}>
        {page === 'index' &&
          <IndexScreen currentSutra={currentSutra} currentIndex={currentSutraIndex} />
        }
        {page === 'sutra' &&
            <SutraScreen />
        }
        </Grid>
      </Grid>
    </>
  );
}

export default App;
