import './App.css';
import {useEffect, useMemo, useState} from 'react';
import {useEffectOnce} from "usehooks-ts";
import {Box, Button, Grid} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import IndexScreen from "./screens/IndexScreen";
import SecondScreen from "./screens/SecondScreen";

function App() {
  const [data, setData ] = useState([]);
  const [page, setPage] = useState("index");

  useEffectOnce(() => {
    invoke('get_files').then((files) => setData(files));
  })

  const sutras = useMemo(() => {
    const sutraArray = [];
    const titles = [];
    data.forEach(s => {
      const sutra = JSON.parse(s);
      titles.push(sutra.title);
      sutraArray.push({title: sutra.title, characters: sutra.data});
    })
    return {titles, sutraArray};
  }, [data])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={() => {
            if (page === 'index') {
              setPage('second');
            } else if (page === 'second') {
              setPage('index');
            }
          }}>Change screen</Button>
        </Grid>
        <Grid item xs={6}>
          <Button color="primary" onClick={() => console.log(sutras)}>Show sutra data</Button>
        </Grid>
        <Grid item xs={12}>{page === 'index' &&
          <IndexScreen val={data}/>
        }
          {page === 'second' &&
            <SecondScreen/>
          }</Grid>
      </Grid>
    </>
  );
}

export default App;
