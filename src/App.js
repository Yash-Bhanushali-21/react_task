import React, { useState } from "react";
import "./styles.css";
import Grid from "./Grid.js";
import Output from "./Output.js";

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
