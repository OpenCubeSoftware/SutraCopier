import './App.css';
import {useEffect, useState} from 'react';
import {useEffectOnce} from "usehooks-ts";
import {Box, Grid} from "@mui/material";
import {invoke} from "@tauri-apps/api";
import IndexScreen from "./screens/IndexScreen";
import SecondScreen from "./screens/SecondScreen";

function App() {
  const [data, setData ] = useState(0);
  const [page, setPage] = useState("index");

  useEffectOnce(() => {
    invoke('get_files').then((files) => setData(files));
  })

  return (
    <>
      <button onClick={() => {
        if (page === 'index') {
          setPage('second');
        } else if (page === 'second') {
          setPage('index');
        }
      }}>Change screen</button>
      {page === 'index' &&
        <IndexScreen val={data} />
      }
      {page === 'second' &&
        <SecondScreen />
      }
    </>
  );
}

export default App;
