import './App.css';
import {useEffect, useMemo, useState} from 'react';
import {Grid} from "@mui/material";
import IndexScreen from "./screens/IndexScreen/IndexScreen.jsx";
import SutraScreen from "./screens/SutraScreen/SutraScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {BaseDirectory, createDir, readTextFile, writeFile} from "@tauri-apps/api/fs";
import {sutraActions} from './store/sutra-slice.js';
import {fetchSutras} from "./store/sutra-actions.js";
import {uiActions} from "./store/ui-slice.js";
import {isEmpty} from "lodash";
import {useEffectOnce, useUnmount} from "react-use";

function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.currentPage);
  const sutraTitles = useSelector((state) => state.sutra.sutraTitles);
  const [currentSutra, setCurrentSutra] = useState('');
  const [currentSutraIndex, setCurrentSutraIndex] = useState(0);
  const sutraSettings = useSelector((state) => ({title: state.settingsSutra, index: state.settingsSutraIndex}));

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
      const settings = await readSettingsFile();
      console.log("settings read from file are ", settings);

      dispatch(sutraActions.setSutraSettings({sutraTitle: settings.title, sutraIndex: settings.sutraIndex}));
    }
    getSetSettings();
  })

  console.log("sutra settings from app.jsx", sutraSettings);

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
