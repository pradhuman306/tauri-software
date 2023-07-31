import { React, useContext, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  TextField,
  Page,
  Select,
  LegacyCard,
  Icon,
  DataTable,
  ButtonGroup,
  Card,
  Text,
} from "@shopify/polaris";
import { EditMinor, DeleteMinor, PlusMinor } from "@shopify/polaris-icons";
import { MyContext } from "./App";

export default function Cashbook() {
  document.onkeydown = keydown;
  const navigate = useNavigate();
  const { setMessage, setErrorMessage } = useContext(MyContext);
  const [addFormData, setAddFormData] = useState({});
  const [editSet, setEditSet] = useState({});
  const [deleteSetID, setDeleteSetID] = useState("");
  const [setName, updateSetName] = useState("");
  const [customers, setcustomers] = useState([]);
  const [customersOptions, setcustomersOptions] = useState([]);

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
    if (!addFormData.cid) {
      isSubmit = false;
    } else {
      validationErr.cid = false;
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
      { path: "cashbook.json", contents: JSON.stringify(tmp) },
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
      validationErr.set = "Please enter set";
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
  const [deleteCustomerID, setDeleteCustomerID] = useState("");
  const [customerName, setDeleteCustomerName] = useState("");

  const deleteCashbookData = async (id) => {
    console.log(id);
    var newdata = setData.filter(function (a) {
      return a.cid != id;
    });
    await writeTextFile(
      { path: "cashbook.json", contents: JSON.stringify(newdata) },
      { dir: BaseDirectory.Resource }
    );
    getdataFromFile();
    setMessage("Data deleted successfully");
    modalOpen("deleteCustomer");
  };

  const [isVisible, setIsVisible] = useState({
    addSet: false,
    editSet: false,
    deleteSet: false,
    deleteCustomer: false,
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
      { path: "cashbook.json", contents: JSON.stringify(data) },
      { dir: BaseDirectory.Resource }
    );
  };

  const deletehandler = async (id) => {
    let tmp = setData.filter(function (a) {
      return a.id != id;
    });
    await writeTextFile(
      { path: "cashbook.json", contents: JSON.stringify(tmp) },
      { dir: BaseDirectory.Resource }
    );
    getdataFromFile();
    setMessage("Set deleted successfully");
    modalOpen("deleteSet");
  };

  const addNote = async () => {
    var todaydate = new Date();
    let day = todaydate.getDate();
    let month = todaydate.getMonth() + 1;
    let year = todaydate.getFullYear();
    if (month.toString().length <= 1) {
      month = '0' + month;
    }
    if (day.toString().length <= 1) {
      day = '0' + day;
    }
    var DATE = year + '-' + month + '-' + day;
    addFormData.date = DATE;
    addFormData.credit = addFormData.credit?addFormData.credit:0;
    addFormData.debit = addFormData.debit?addFormData.debit:0;
    addFormData.id = Date.now();
    updateData([{ ...addFormData }, ...setData]);
  };
  const getdataFromFile = async () => {

    // customers 
    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycust = JSON.parse(myfiledata);
      setcustomers(mycust);
      let custOpt = [{ label: "Select Customer", value: "" }];
      mycust.map((data) => {
        custOpt.push({ label: data.name + " (" + data.customer_id + ")", value: data.customer_id });
      })
      setcustomersOptions(custOpt);
    } catch (error) {
      console.log(error);
    }

    try {
      const myfiledata = await readTextFile("cashbook.json", {
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
  var result = setData.reduce((acc, {cid, credit, debit}) => ({...acc, [cid]: {cid, credit: acc[cid] ? Number(acc[cid].credit) + Number(credit): Number(credit), debit: acc[cid] ? Number(acc[cid].debit) + Number(debit): Number(debit)}}), {});
  result = Object.values(result);
  result.map((data, index) => {
    let newArray = [];
    var found = customers.find(obj => {
      return obj.customer_id === data.cid;
    });
    newArray.push(
      data.cid,
      // data.date,
      found.name,
      data.credit?'₹'+data.credit:'',
      data.debit?'₹'+data.debit:'',
      <b>₹{Number(data.credit)-Number(data.debit)+''+((Number(data.credit)-Number(data.debit))>0?' CR':' DR')}</b>,
      <ButtonGroup>
        <Button
          size="micro"
          destructive
          outline
          onClick={() => {
            modalOpen("deleteCustomer");
            setDeleteCustomerID(data.cid);
            setDeleteCustomerName(found.name);
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
        title="CashBook"
        primaryAction={{
          content: "Add Payment",
          icon: PlusMinor,
          onAction: () => modalOpen("addSet"),
        }}
      >
        {rows.length ? 
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              "text",
              "text",
              "text",
              "text",
              "text",
              "text"
            ]}
            headings={[
              "CID",
              "Name",
              "Credit",
              "Debit",
              "Total",
              "Action",
            ]}
            rows={rows}
            hasZebraStripingOnData
            increasedTableDensity
            defaultSortDirection="descending"
          />
        </LegacyCard>:<Card>
          <Text alignment="center" variant="headingMd" as="h3">No record found</Text>
        </Card>}
        

        {/* Add set popup */}
        <Modal
          small
          open={isVisible.addSet}
          onClose={() => modalOpen("addSet")}
          title="Add"
          primaryAction={{
            content: "Add",
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

                <Select
                  label="Customer"
                  name="name"
                  id="name"
                  options={customersOptions}
                  value={addFormData ? addFormData.cid : ""}
                  requiredIndicator={true}
                  onChange={(e) => addFormHandler(e, "cid")}
                />
                </div>
                <div className="col">
                  <TextField
                    label="Credit"
                    type="number"
                    step="any"
                    name="credit"
                    value={addFormData ? addFormData.credit : 0}
                    onChange={(e) => addFormHandler(e, "credit")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Debit"
                    type="number"
                    step="any"
                    name="debit"
                    value={addFormData ? addFormData.debit : 0}
                    onChange={(e) => addFormHandler(e, "debit")}
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
                    label="Customer"
                    type="number"
                    step="any"
                    name="cid"
                    value={editSet ? editSet.cid : ""}
                    error={validationError.cid}
                    requiredIndicator={true}
                    onChange={(e) => editFormHandler(e, "cid")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Credit"
                    type="number"
                    step="any"
                    name="credit"
                    value={editSet ? editSet.credit : ""}
                    onChange={(e) => editFormHandler(e, "credit")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Debit"
                    type="number"
                    step="any"
                    name="debit"
                    value={editSet ? editSet.pana : ""}
                    onChange={(e) => editFormHandler(e, "debit")}
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
          title="Delete"
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
            <div className="">Are you sure you want to delete {setName}!</div>
          </Modal.Section>
        </Modal>

         {/* Delete customer popup */}
         <Modal
          small
          open={isVisible.deleteCustomer}
          onClose={() => modalOpen("deleteCustomer")}
          title="Delete Customer"
          primaryAction={{
            content: "Yes",
            onAction: () => deleteCashbookData(deleteCustomerID),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("deleteCustomer"),
            },
          ]}
        >
          <Modal.Section>
            <div className="">
              Are you sure you want to delete <b>{customerName}</b>?
            </div>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}
