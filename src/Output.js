import React, { useState } from "react";
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";

const Output = (props) => {
  let rows = [...props.updatedRows];
  let cols = [...props.updatedCols];
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  console.log("state received here is");
  console.log(rows);
  console.log(cols);

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
        onGridReady={onGridReady}
        domLayout={"autoHeight"}
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
