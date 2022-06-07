import './App.css';
import {useEffect, useMemo, useState} from 'react';
import {Box, Button, Grid} from "@mui/material";
import IndexScreen from "./screens/IndexScreen/IndexScreen.jsx";
import SutraScreen from "./screens/SutraScreen/SutraScreen.jsx";
import {useDispatch, useSelector} from "react-redux";
import {sutraActions} from './store/sutra-slice.js';
import {fetchSutras} from "./store/sutra-actions.js";
import {Store} from 'tauri-plugin-store-api';
import {uiActions} from "./store/ui-slice.js";
import {isEmpty} from "lodash";

function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.currentPage);
  const sutraTitles = useSelector((state) => state.sutra.sutraTitles);
  const store = new Store('.settings.dat');
  const [sutraIndex, setSutraIndex] = useState(null);

  useEffect( () => {
    dispatch(fetchSutras());
  },[dispatch])

  useEffect(() => {
    const getSutraIndex = async () => {
      const index = await store.get('sutra-index');
      console.log("Sutra index fetched in app is", index);
      if (!isEmpty(index)) {
        setSutraIndex(index);
      }
    }
    getSutraIndex().catch(console.error);
  }, []);

  return (
    <>
      <Grid container spacing={2}>

        <Grid item xs={12}>
        {page === 'index' &&
          <IndexScreen />
        }
        {page === 'sutra' &&
            <SutraScreen dataStore={store} initialIndex={sutraIndex.value} />
        }
        </Grid>
      </Grid>
    </>
  );
}

export default App;
