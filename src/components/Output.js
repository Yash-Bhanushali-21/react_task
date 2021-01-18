import React, { useState } from "react";
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import "../style/style.css";

const Output = ({ updatedRows, updatedCols }) => {
  let rows = [...updatedRows];
  let cols = [...updatedCols];

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  console.log("state received here is");
  console.log(rows);
  console.log(cols);
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const valid = { borderColor: "white" }; //if all set, cell color as it is.
  const inValid = { borderColor: "red" }; //else make borderColor red.

  return (
    <div id="myOutput" style={{ width: "100%" }} className="ag-theme-alpine">
      <AgGridReact
        modules={[
          ClientSideRowModelModule,
          MenuModule,
          ColumnsToolPanelModule,
          AllCommunityModules
        ]}
        rowMultiSelectWithClick={true}
        domLayout={"autoHeight"}
        onGridReady={onGridReady}
        defaultColDef={{
          flex: 1,
          minWidth: 150
        }}
        rowSelection={"single"}
        rowData={rows}
      >
        {cols.map((column) => (
          <AgGridColumn {...column}></AgGridColumn>
        ))}
      </AgGridReact>
    </div>
  );
};

export default Output;
