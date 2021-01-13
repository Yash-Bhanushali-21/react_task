import React, { useState } from "react";
import "./style/style.css";
import Grid from "./components/Grid.js";
import Output from "./components/Output.js";

export default function App() {
  let [isReady, setIsReady] = useState(false);
  let [rData, setRData] = useState([]);
  let [cData, setCData] = useState([]);
  return (
    <div>
      <Grid rSetter={setRData} cSetter={setCData} setVisible={setIsReady} />)
      {isReady && <Output updatedRows={rData} updatedCols={cData} />}
    </div>
  );
}
