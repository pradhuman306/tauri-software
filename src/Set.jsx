import { React, useContext, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  TextField,
  Page,
  LegacyCard,
  Icon,
  DataTable,
  ButtonGroup,
  Card,
  Text,
} from "@shopify/polaris";
import { EditMinor, DeleteMinor, PlusMinor } from "@shopify/polaris-icons";
import { MyContext } from "./App";

export default function Set() {
  document.onkeydown = keydown;
  const navigate = useNavigate();
  const { setMessage, setErrorMessage } = useContext(MyContext);
  const [addFormData, setAddFormData] = useState({});
  const [editSet, setEditSet] = useState({});
  const [deleteSetID, setDeleteSetID] = useState("");
  const [setName, updateSetName] = useState("");
  const [validationError, setValidationError] = useState({
    set: false,
  });
  const addFormHandler = (value, param) => {
    let validationErr = { ...validationError };
    if (value && param == "set") {
      validationErr.set = false;
    }
    setValidationError(validationErr);
    const fieldName = param;
    const fieldValue = value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const handleEditSet = (id, param) => {
    let tmp = setData.filter((item) => item.id === id);
    setEditSet(tmp[0]);
    modalOpen(param);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };
    let isSubmit = true;
    if (!addFormData.set) {
      validationErr.set = true;
      setErrorMessage("Please enter set");
      isSubmit = false;
    } else {
      validationErr.set = false;
    }
    let filteredSet = setData.filter((data)=>data.set == addFormData.set);
    if(filteredSet.length){
      isSubmit = false; 
      setErrorMessage("Set already exist");
    }
    if (isSubmit) {
      addNote();
      setAddFormData({});
      setMessage("Set added successfully");
      modalOpen("addSet");
    }
    setValidationError(validationErr);
  };

  const editFormHandler = (value, param) => {
    let validationErr = { ...validationError };
    if (value && param == "set") {
      validationErr.set = false;
    }
    setValidationError(validationErr);

    const fieldName = param;
    const fieldValue = value;
    const newFormData1 = { ...editSet };
    newFormData1[fieldName] = fieldValue;
    setEditSet(newFormData1);
  };

  const updateSet = async () => {
    let tmp = setData.map((obj) => {
      if (obj.id == editSet.id) {
        return {
          ...editSet,
        };
      }
      //else return the object
      return { ...obj };
    });
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(tmp) },
      { dir: BaseDirectory.Resource }
    );
    getdataFromFile();
    setMessage("Set updated successfully");
  };

  const updateHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };
    let isSubmit = true;
    if (!editSet.set) {
      validationErr.set = true;
      setErrorMessage("Please enter set");
      isSubmit = false;
    } else {
      validationErr.set = false;
    }
    if (isSubmit) {
      updateSet();
      modalOpen("editSet");
    }
    setValidationError(validationErr);
  };

  const [setData, updateSetdata] = useState([]);
  const [isVisible, setIsVisible] = useState({
    addSet: false,
    editSet: false,
    deleteSet: false,
  });
  const modalOpen = (id) => {
    let isVisibleTemp = { ...isVisible };
    if (isVisibleTemp[id]) {
      isVisibleTemp[id] = false;
      setIsVisible(isVisibleTemp);
    } else {
      isVisibleTemp[id] = true;
      setIsVisible(isVisibleTemp);
    }
    setValidationError({});
  };

  const modalAction = () => {
    setIsVisible(false);
  };
  const updateData = async (data) => {
    updateSetdata([...data]);
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(data) },
      { dir: BaseDirectory.Resource }
    );
  };

  const deletehandler = async (id) => {
    let tmp = setData.filter(function (a) {
      return a.id != id;
    });
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(tmp) },
      { dir: BaseDirectory.Resource }
    );
    getdataFromFile();
    setMessage("Set deleted successfully");
    modalOpen("deleteSet");
  };

  const addNote = async () => {
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    // addFormData.date = datetime;
    addFormData.date = new Date(Date.now());
    addFormData.id = Date.now();
    updateData([{ ...addFormData }, ...setData]);
  };
  const getdataFromFile = async () => {
    try {
      const myfiledata = await readTextFile("set.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      updateSetdata(mydata);
    } catch (error) {
     
      getdataFromFile();
      console.log(error);
    }
  };
  useEffect(() => {
    getdataFromFile();
  }, []);

  const rows = [];

  setData.map((data, index) => {
    let newArray = [];
    newArray.push(
      <b>{data.set}</b>,
      data.commission,
      data.pana,
      data.partnership,
      data.partnership2,
      data.multiple,
      data.sp,
      data.dp,
      data.jodi,
      data.tp,
      <ButtonGroup>
        <Button size="micro" onClick={() => handleEditSet(data.id, "editSet")}>
          <Icon source={EditMinor} color="base" />
        </Button>
        <Button
          destructive
          outline 
          size="micro"
          onClick={() => {
            modalOpen("deleteSet");
            setDeleteSetID(data.id);
            updateSetName(data.set);
          }}
        >
          <Icon source={DeleteMinor} color="base" />
        </Button>
      </ButtonGroup>
    );
    rows.push(newArray);
  });

  function keydown(evt){
    if (!evt) evt = event;
   
    if(evt.keyCode==115 && isVisible.addSet ){
      document.getElementById("addSetBtn").click();
    }else if(evt.keyCode==115 && isVisible.editSet){
      document.getElementById("editSetBtn").click();
    }
  
  }

  return (
    <>
      <Page
      fullWidth
        title="Customer Set"
        primaryAction={{
          content: "Add New Set",
          icon: PlusMinor,
          onAction: () => modalOpen("addSet"),
        }}
      >
        <div className="no-border">
        {rows.length ? 
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
              "text",
            ]}
            headings={[
              "Set",
              "Commission",
              "Pana",
              "Partnership",
              "Partnership2",
              "Multiple",
              "SP",
              "DP",
              "JODI",
              "TP",
              "Action",
            ]}
            rows={rows}
            hasZebraStripingOnData
            increasedTableDensity
            defaultSortDirection="descending"
          />
        </LegacyCard>:<Card>
          <Text alignment="center" variant="headingMd" as="h3">No set found</Text>
        </Card>}
        
        </div>

        {/* Add set popup */}
        <Modal
          small
          open={isVisible.addSet}
          onClose={() => modalOpen("addSet")}
          title="Add New Set"
          primaryAction={{
            content: "Add Set",
            onAction: () => document.getElementById("addSetBtn").click(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("addSet"),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={submitHandler}>
              <div className="row">
                <div className="col">
                  <TextField
                    label="Set"
                    type="number"
                    step="any"
                    name="set"
                    value={addFormData ? addFormData.set : ""}
                    requiredIndicator={true}
                    error={validationError.set}
                    onChange={(e) => addFormHandler(e, "set")}
                    required
                    // error={setError}
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Commision"
                    type="number"
                    step="any"
                    name="commission"
                    value={addFormData ? addFormData.commission : ""}
                    onChange={(e) => addFormHandler(e, "commission")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Pana"
                    type="number"
                    step="any"
                    name="pana"
                    value={addFormData ? addFormData.pana : ""}
                    onChange={(e) => addFormHandler(e, "pana")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Partnership"
                    type="number"
                    step="any"
                    name="partnership"
                    value={addFormData ? addFormData.partnership : ""}
                    onChange={(e) => addFormHandler(e, "partnership")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Partnership2"
                    type="number"
                    step="any"
                    name="partnership2"
                    value={addFormData ? addFormData.partnership2 : ""}
                    onChange={(e) => addFormHandler(e, "partnership2")}
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Multiple"
                    type="number"
                    step="any"
                    name="multiple"
                    value={addFormData ? addFormData.multiple : ""}
                    onChange={(e) => addFormHandler(e, "multiple")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="SP"
                    type="number"
                    step="any"
                    name="sp"
                    value={addFormData ? addFormData.sp : ""}
                    onChange={(e) => addFormHandler(e, "sp")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="DP"
                    type="number"
                    step="any"
                    name="dp"
                    value={addFormData ? addFormData.dp : ""}
                    onChange={(e) => addFormHandler(e, "dp")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="JODI"
                    type="number"
                    step="any"
                    name="jodi"
                    value={addFormData ? addFormData.jodi : ""}
                    onChange={(e) => addFormHandler(e, "jodi")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="TP"
                    type="number"
                    step="any"
                    name="tp"
                    value={addFormData ? addFormData.tp : ""}
                    onChange={(e) => addFormHandler(e, "tp")}
                    required
                  />
                </div>
              </div>

              <Button id="addSetBtn" submit>
                Submit
              </Button>
            </Form>
          </Modal.Section>
        </Modal>

        {/* Edit set popup */}
        <Modal
          small
          open={isVisible.editSet}
          onClose={() => modalOpen("editSet")}
          title="Edit Set"
          primaryAction={{
            content: "Update Set",
            onAction: () => document.getElementById("editSetBtn").click(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("editSet"),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={updateHandler}>
              <div className="row">
                <div className="col">
                  <TextField
                    label="Set"
                    type="number"
                    step="any"
                    name="set"
                    value={editSet ? editSet.set : ""}
                    error={validationError.set}
                    requiredIndicator={true}
                    onChange={(e) => editFormHandler(e, "set")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Commision"
                    type="number"
                    step="any"
                    name="commission"
                    value={editSet ? editSet.commission : ""}
                    onChange={(e) => editFormHandler(e, "commission")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Pana"
                    type="number"
                    step="any"
                    name="pana"
                    value={editSet ? editSet.pana : ""}
                    onChange={(e) => editFormHandler(e, "pana")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Partnership"
                    type="number"
                    step="any"
                    name="partnership"
                    value={editSet ? editSet.partnership : ""}
                    onChange={(e) => editFormHandler(e, "partnership")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Partnership2"
                    type="number"
                    step="any"
                    name="partnership2"
                    value={editSet ? editSet.partnership2 : ""}
                    onChange={(e) => editFormHandler(e, "partnership2")}
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Multiple"
                    type="number"
                    step="any"
                    name="multiple"
                    value={editSet ? editSet.multiple : ""}
                    onChange={(e) => editFormHandler(e, "multiple")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="SP"
                    type="number"
                    step="any"
                    name="sp"
                    value={editSet ? editSet.sp : ""}
                    onChange={(e) => editFormHandler(e, "sp")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="DP"
                    type="number"
                    step="any"
                    name="dp"
                    value={editSet ? editSet.dp : ""}
                    onChange={(e) => editFormHandler(e, "dp")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="JODI"
                    type="number"
                    step="any"
                    name="jodi"
                    value={editSet ? editSet.jodi : ""}
                    onChange={(e) => editFormHandler(e, "jodi")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="TP"
                    type="number"
                    step="any"
                    name="tp"
                    value={editSet ? editSet.tp : ""}
                    onChange={(e) => editFormHandler(e, "tp")}
                    required
                  />
                </div>
              </div>
              <Button id="editSetBtn" submit>
                Submit
              </Button>
            </Form>
          </Modal.Section>
        </Modal>

        {/* Delete set popup */}
        <Modal
          small
          // activator={activator}
          open={isVisible.deleteSet}
          onClose={() => modalOpen("deleteSet")}
          title="Delete Set"
          primaryAction={{
            content: "Yes",
            onAction: () => deletehandler(deleteSetID),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("deleteSet"),
            },
          ]}
        >
          <Modal.Section>
            <div className="">Are you sure you want to delete set <b>{setName}</b>!</div>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}
