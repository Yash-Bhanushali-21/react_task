"use strict";
import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { AllCommunityModules } from "@ag-grid-community/all-modules";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import $ from "jquery";

//JSON data that will be used for dropdown
var country = {
  Countries: [
    {
      Country: "India",
      states: [
        {
          state: "Maharashtra",
          city: ["Mumbai", "Pune"]
        },
        {
          state: "Gujarat",
          city: ["Surat", "Rajkot"]
        }
      ]
    },
    {
      Country: "United States",
      states: [
        {
          state: "Albama",
          city: ["Anniston", "Alexander City"]
        },
        {
          state: "Delaware",
          city: ["Dover", "Lewes"]
        }
      ]
    }
  ]
};

var country_array = [];
var city_array = [];

//doing this only once, cause its exhaustive.
//basic flow: node_id,
var obj_country = country["Countries"];
for (var index in obj_country) {
  let each_country = obj_country[index];
  let states = each_country["states"];
  country_array.push(each_country["Country"]);
  let cities = [];
  for (var state in states) {
    let cities_arr = states[state]["city"];
    for (var city in cities_arr) {
      cities.push(cities_arr[city]);
    }
  }
  city_array.push(cities);
}
/*
console.log("recorded countires are ----");
console.log(country_array);
console.log("recorded cities are ---");
for(var i in city_array){
  console.log(country_array[i]);
  for(var j in city_array[i]){
    console.log(city_array[i][j]);
  }
}
*/
const Grid = (props) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [outputRowData, setOutputRowData] = useState([]);
  const [outputColData, setOutputColData] = useState([]);

  const [idCount, setIdCount] = useState(3);
  //gender Mapping for gender using object just to showoff xD.
  const gender = ["Male", "Female", "Other"];
  //for country using an array!
  const countryMapper = ["India", "Pakistan", "China"];
  const cityMapper = ["Amsterdam", "Beijing", "Mumbai"];

  const [colData, setColData] = useState([
    {
      field: "id",
      filter: "agNumberColumnFilter",
      maxWidth: "100",
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      field: "name",
      cellStyle: (params) => (params.value === "" ? inValid : valid)
    },
    { field: "email", cellStyle: (params) => validate(params.value) },
    {
      field: "gender",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: gender, useFormatter: true }
    },
    {
      field: "country",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: country_array, useFormatter: true }
    },
    {
      field: "city",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: function (params) {
        var selectedCountry = params.data.country;
        let index = country_array.indexOf(selectedCountry);
        return {
          values: city_array[index]
        };
      }
    },
    {
      field: "date",
      cellEditor: "datePicker",
      cellStyle: (params) => (params.value === "" ? inValid : valid)
    },
    {
      field: "DeleteAction",
      cellRendererFramework: (params) => (
        <div>
          <i
            className="material-icons w3-large"
            onClick={() => {
              //console.log(params.node.data.id);
              handleColDelete(params.node.data.id);
            }}
          >
            delete
          </i>
        </div>
      )
    }
  ]);
  const [rowData, setRowData] = useState([
    {
      id: 1,
      name: "yash",
      email: "yashbhadra1@gmail.com",
      gender: "M",
      country: "India",
      city: "Mumbai",
      date: "12/08/1999"
    },
    {
      id: 2,
      name: "harsh",
      email: "hardshbhadra1@gmail.com",
      gender: "M",
      country: "India",
      city: "Mumbai",
      date: "12/04/1999"
    }
  ]);
  /* --- Event Handlers Section --- */

  const valid = { borderColor: "white" }; //if all set, cell color as it is.
  const inValid = { borderColor: "red" }; //else make borderColor red.

  //email Validation function.
  const validate = (text) => {
    if (text.length === 0) {
      return { borderColor: "red" };
    }
    let first = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
      text
    );
    if (text.length <= 2 || !first) {
      return { borderColor: "yellow" };
    }

    return { borderColor: "white" };
  };
  //handle col delete button
  const handleColDelete = (id) => {
    // const data = rowData;
    const update = (rowData) => rowData.filter((item) => item.id !== id);
    setRowData(update);
    if (update.length === 0) {
      setIdCount(1);
    } else {
      setIdCount(update.length + 1);
    }
  };

  //static body of new item
  //default new row data
  function createNewRowData() {
    var newData = {
      id: idCount,
      name: "yash",
      email: "yashbhadra1@gmail.com",
      gender: "M",
      country: "India",
      city: "Mumbai",
      date: "12/08/1999"
    };
    return newData;
  }
  //handle addnewItems
  const addRows = (addIndex) => {
    var newItemObject = createNewRowData();
    let data = rowData;
    data.push(newItemObject);
    idHandler(data);
    newItemObject.id = data.length;
    var newItems = [newItemObject];
    var res = gridApi.applyTransaction({
      add: newItems,
      addIndex: addIndex
    });
  };

  //handle submit after values are chosen.
  const handleSubmit = () => {
    /*let obj = [];
   for (const property in colData) {
     obj.push(colData[property]);
   }*/
    /// NOTE: not passing the state directly.
    /// JS tends to make a shallow copy. thus, deep copy
    ///using iteration for time being.

    const updatedCol = colData.filter((word) => word.field !== "DeleteAction");
    let prevRow = rowData;
    console.log(prevRow);
    let rowOp = [];
    for (var i = 0; i < rowData.length; i++) {
      rowOp.push(rowData[i]);
    }

    props.rSetter(rowOp);
    props.cSetter(updatedCol);
    props.setVisible(true);
    console.log("output states are changed");
  };

  //handle the onClick for selected.
  const onRemoveSelected = () => {
    var selectedData = gridApi.getSelectedRows();
    console.log(selectedData);
    var res = gridApi.applyTransaction({ remove: selectedData });
    let deselData = [];
    let selData = [];
    gridApi.forEachNode((node) => {
      if (!node.isSelected()) {
        deselData.push(node.data);
      } else {
        selData.push(node.data);
      }
    });

    idHandler(deselData);
  };

  const idHandler = (data) => {
    //handling unique Id so no mismatches.
    let count = 1;
    if (data.length === 0) {
      setIdCount(1);
      setRowData(data);
    } else {
      for (var index in data) {
        data[index].id = count;
        count++;
      }
      setIdCount(count);
      setRowData(data);
    }
  };

  //handle the onClick for deSelected
  //we use node.isSelected() for check state.
  const onRemoveDeselected = () => {
    let deselData = [];
    let selData = [];
    gridApi.forEachNode((node) => {
      if (!node.isSelected()) {
        deselData.push(node.data);
      } else {
        selData.push(node.data);
      }
    });

    var res = gridApi.applyTransaction({ remove: deselData });
    idHandler(selData);
  };
  //handle insertRow
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  //leveraging jquery-ui date-picker.
  function getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function (params) {
      this.eInput = document.createElement("input");
      this.eInput.value = params.value;
      this.eInput.classList.add("ag-input");
      this.eInput.style.height = "100%";
      $(this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
    };
    Datepicker.prototype.getGui = function () {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function () {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function () {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function () {};
    Datepicker.prototype.isPopup = function () {
      return false;
    };
    return Datepicker;
  }

  //row selection
  const rowSelectionType = "multiple";
  //trigger function to handle selection change.
  //console logging when selected. => c.l(event)
  //for getting row(s) c.l(event.api.getSelectedRows())

  const onSelectionChanged = (event) => {
    console.log(event.api.getSelectedRows());
  };

  var genderMapping = extractValues(gender);
  // var contryMapping =
  function extractValues(mappings) {
    return Object.keys(mappings);
  }

  /*----event handler section close --- */
  return (
    <div style={{ width: "100%" }}>
      <div
        id="myGrid"
        style={{
          width: "100%"
        }}
        className="ag-theme-alpine"
      >
        <div className="buttonSection">
          <button className="btn" onClick={() => onRemoveSelected()}>
            Delete Selected
          </button>
          <button className="btn" onClick={() => onRemoveDeselected()}>
            Delete Unselected
          </button>
          <button className="btn" onClick={() => addRows()}>
            Add Row
          </button>
          <button className="btn" onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
        <AgGridReact
          modules={[
            ClientSideRowModelModule,
            MenuModule,
            ColumnsToolPanelModule,
            AllCommunityModules
          ]}
          rowSelection={rowSelectionType}
          onSelectionChanged={onSelectionChanged}
          rowMultiSelectWithClick={true}
          onGridReady={onGridReady}
          domLayout={"autoHeight"}
          defaultColDef={{
            flex: 1,
            minWidth: 150
          }}
          components={{ datePicker: getDatePicker() }}
          rowData={rowData}
        >
          {colData.map((column) => (
            <AgGridColumn {...column} editable={true}></AgGridColumn>
          ))}
        </AgGridReact>
      </div>
      <br />
    </div>
  );
};
export default Grid;
