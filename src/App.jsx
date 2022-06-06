import './App.css';
import {useEffect, useMemo, useState} from 'react';
import {useEffectOnce} from "usehooks-ts";
import {Box, Button, Grid} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import IndexScreen from "./screens/IndexScreen/IndexScreen.jsx";
import SutraScreen from "./screens/SutraScreen/SutraScreen.jsx";
import {isEmpty} from 'lodash';
import {useDispatch, useSelector} from "react-redux";
import {sutraActions} from './store/sutra-slice.js';
import {fetchSutras} from "./store/sutra-actions.js";

function App() {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.ui.currentPage);
  const sutraTitles = useSelector((state) => state.sutra.sutraTitles);

  useEffect( () => {
    dispatch(fetchSutras());
  },[dispatch])

/*  const sutras = useMemo(() => {
    const sutraArray = [];
    const titles = [];
    data.forEach(s => {
      const sutra = JSON.parse(s);
      titles.push(sutra.title);
      sutraArray.push({title: sutra.title, characters: sutra.data});
    })
    return {titles, sutraArray};
  }, [data])*/

/*  const selectedSutraData = useMemo(() => {
    if (isEmpty(selectedSutra)) {
      return [];
    }
    const selected = sutras.sutraArray.filter((s) => s.title === selectedSutra);
    return selected.sutraData;
  },[selectedSutra])

  console.log("selected sutra data is: ", selectedSutraData)*/

  // const changePage = (selectedSutra) => {
  //   setSelectedSutra(selectedSutra);
  //   setPage('second');
  // }

  return (
    <>
      <Grid container spacing={2}>

        <Grid item xs={12}>
        {page === 'index' &&
          <IndexScreen />
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

/*    async function getFiles() {
      const files = await invoke('get_files');
      console.log(files[0]);
      console.log(typeof(files));
      dispatch(sutraActions.setSutraData({}))
      console.log(files);
      setData(files);

    const files = getFiles();

    invoke('get_files').then((files) => {
      console.log(files)
      setData(files)
    });*/