import { React, useCallback, useContext, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Toast,
  Form,
  TextField,
  Page,
  LegacyCard,
  Grid,
  Icon,
  Select,
  DataTable,
  ButtonGroup,
  Card,
  Text,
} from "@shopify/polaris";
import { EditMinor, DeleteMinor, PlusMinor } from "@shopify/polaris-icons";
import { MyContext } from "./App";

export default function Customer() {
  document.onkeydown = keydown;

  const { message, setMessage, setErrorMessage } = useContext(MyContext);
  const [validationError, setValidationError] = useState({
    cid: false,
    name: false,
    set: false,
  });
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [selectedSet, setSelectedSet] = useState("");
  const [msg, setMsg] = useState("");
  const [customerName, setDeleteCustomerName] = useState("");
  
  const [addFormData, setAddFormData] = useState({
    customer_id: "",
    customer_id2: "",
    commission: "",
    dp: "",
    jodi: "",
    multiple: "",
    pana: "",
    partnership: "",
    partnership2: "",
    set: "",
    tp: "",
    sp: "",
  });
  const addFormHandler = (value, param) => {
    let validationErr = { ...validationError };
    if (value && param == "customer_id") {
      validationErr.cid = false;
    }
    if (value && param == "name") {
      validationErr.name = false;
    }
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

  const editFormHandler = (value, param) => {
    let validationErr = { ...validationError };
    if (value && param == "customer_id") {
      validationErr.cid = false;
    }
    if (value && param == "name") {
      validationErr.name = false;
    }
    if (value && param == "set") {
      validationErr.set = false;
    }
    setValidationError(validationErr);
    const fieldName = param;
    const fieldValue = value;
    const newFormData1 = { ...editCustomer };
    newFormData1[fieldName] = fieldValue;
    setEditCustomer(newFormData1);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };

    let isSubmit = true;
    if (!addFormData.customer_id) {
      isSubmit = false;
      setErrorMessage('Please enter CID')
      validationErr.customer_id = true;
    } else {
      validationErr.cid = false;
    }
    if (!addFormData.set) {
      isSubmit = false;
      setErrorMessage('Please enter set')
      validationErr.set = true;
    } else {
      validationErr.set = false;
    }
    if (!addFormData.name) {
      isSubmit = false;
      setErrorMessage('Please enter name')
      validationErr.name = true;
    } else {
      validationErr.name = false;
    }
    let filteredCustomer = customers.filter((data)=>data.customer_id == addFormData.customer_id);
    if(filteredCustomer.length){
      isSubmit = false; 
      setErrorMessage("Customer already exist");
    }
    if (isSubmit) {
      addNote();
      setAddFormData({});
      modalOpen("addCustomer");
    }
    setValidationError(validationErr);
  };
  const updateHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };

    let isSubmit = true;
    if (!editCustomer.customer_id) {
      isSubmit = false;
      setErrorMessage('Please enter CID')
      validationErr.cid = true;

    } else {
      validationErr.cid = false;
    }
    if (!editCustomer.set) {
      isSubmit = false;
    } else {
      validationErr.set = false;
    }
    if (!editCustomer.name) {
      isSubmit = false;
      setErrorMessage('Please enter name')
      validationErr.name = true;
    } else {
      validationErr.name = false;
    }
    if (isSubmit) {
      updateCustomer();
      modalOpen("editCustomer");
    }

    setValidationError(validationErr);
  };

  const [setData, updateSetData] = useState([]);
  const [setOptions, updateSetOptions] = useState([]);

  const addnewcustomer = async (customers) => {
    setcustomers([...customers]);
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    setMessage("Customer added successfully");
    setActive(true);
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
    addFormData.date = new Date(Date.now());
    addFormData.id = Date.now();
    addnewcustomer([{ ...addFormData }, ...customers]);
  };

  const updateCustomer = async () => {
    customers = customers.map((obj) => {
      if (obj.id == editCustomer.id) {
        return {
          ...editCustomer,
        };
      }
      //else return the object
      return { ...obj };
    });
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    setActive(true);

    setMessage("Customer updated successfully");
    getNotesFromFile();
  };

  const onChangeSet = async (e) => {
    setSelectedSet(e);
    let validateErr = { ...validationError };
    if (e != "") {
      validateErr.set = false;
    } else {
      validateErr.set = true;
      setErrorMessage('Please select set');
    }


    setValidationError(validateErr);
    const fdata = setData.filter((item) => item.set === e);
    const newFormData = { ...addFormData };
    newFormData["commission"] = fdata[0] ? fdata[0]["commission"] : "";
    newFormData["dp"] = fdata[0] ? fdata[0]["dp"] : "";
    newFormData["jodi"] = fdata[0] ? fdata[0]["jodi"] : "";
    newFormData["multiple"] = fdata[0] ? fdata[0]["multiple"] : "";
    newFormData["pana"] = fdata[0] ? fdata[0]["pana"] : "";
    newFormData["partnership"] = fdata[0] ? fdata[0]["partnership"] : "";
    newFormData["partnership2"] = fdata[0] ? fdata[0]["partnership2"] : "";
    newFormData["set"] = fdata[0] ? fdata[0]["set"] : "";
    newFormData["tp"] = fdata[0] ? fdata[0]["tp"] : "";
    newFormData["sp"] = fdata[0] ? fdata[0]["sp"] : "";
    setAddFormData(newFormData);
  };

  const onChangeSetEdit = async (e) => {
    setSelectedSet(e);
    let validateErr = { ...validationError };
    if (e != "") {
      validateErr.set = false;
    } else {
      validateErr.set = true;
      setErrorMessage('Please select set');

    }
    setValidationError(validateErr);
    const fdata = setData.filter((item) => item.set === e);
    const newFormData = { ...editCustomer };
    newFormData["commission"] = fdata[0] ? fdata[0]["commission"] : "";
    newFormData["dp"] = fdata[0] ? fdata[0]["dp"] : "";
    newFormData["jodi"] = fdata[0] ? fdata[0]["jodi"] : "";
    newFormData["multiple"] = fdata[0] ? fdata[0]["multiple"] : "";
    newFormData["pana"] = fdata[0] ? fdata[0]["pana"] : "";
    newFormData["partnership"] = fdata[0] ? fdata[0]["partnership"] : "";
    newFormData["partnership2"] = fdata[0] ? fdata[0]["partnership2"] : "";
    newFormData["set"] = fdata[0] ? fdata[0]["set"] : "";
    newFormData["tp"] = fdata[0] ? fdata[0]["tp"] : "";
    newFormData["sp"] = fdata[0] ? fdata[0]["sp"] : "";
    setEditCustomer(newFormData);
  };
  const getNotesFromFile = async () => {
    try {
      const myfilesets = await readTextFile("set.json", {
        dir: BaseDirectory.Resource,
      });
      const mysetData = JSON.parse(myfilesets);
      let optionsSet = [{ label: "Select set", value: "" }];
      updateSetData(mysetData);
      mysetData.map((data) => {
        optionsSet.push({ label: data.set, value: data.set });
      });
      updateSetOptions(optionsSet);
    } catch (error) {
   
      console.log(error);
    }

    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycustomers = JSON.parse(myfiledata);
      setcustomers(mycustomers);
    } catch (error) {

      console.log(error);
    }

    // entries 
    try {
      const myfiledataEntries = await readTextFile("entries.json", {
        dir: BaseDirectory.Resource,
      });
      const dataEntries = JSON.parse(myfiledataEntries);
      setEntries(dataEntries);
    } catch (error) {
      console.log(error);
    }

    // cashbook
    try {
      const myfiledatasetCashbook = await readTextFile("cashbook.json", {
        dir: BaseDirectory.Resource,
      });
      const cashdata = JSON.parse(myfiledatasetCashbook);
      setCashbook(cashdata);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotesFromFile();
  }, []);

  const deletehandler = async (id) => {
    // customer 
    var getcustomer = customers.filter(function (a) {
      return a.id == id;
    });
    if(getcustomer.length){
      var CUSTOMER_ID = getcustomer[0].customer_id;
    }else{
      var CUSTOMER_ID = 'notfound';
    }
    customers = customers.filter(function (a) {
      return a.id != id;
    });
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    // cashbook 
    cashbook = cashbook.filter(function (a) {
      return a.cid != CUSTOMER_ID;
    });
    await writeTextFile(
      { path: "cashbook.json", contents: JSON.stringify(cashbook) },
      { dir: BaseDirectory.Resource }
    );
    // entries
    Entries = Entries.filter(function (a) {
      return a.customer_id != CUSTOMER_ID;
    });
    await writeTextFile(
      { path: "entries.json", contents: JSON.stringify(Entries) },
      { dir: BaseDirectory.Resource }
    );
    getNotesFromFile();
    setMessage("Customer deleted successfully");
    modalOpen("deleteCustomer");
  };

  // customers
  var [customers, setcustomers] = useState([]);
  var [Entries, setEntries] = useState([]);
  var [cashbook, setCashbook] = useState([]);
  const [editCustomer, setEditCustomer] = useState({});
  const [deleteCustomerID, setDeleteCustomerID] = useState("");

  const handleEditCustomer = (id, param) => {
    let tmp = customers.filter((item) => item.id === id);
    setEditCustomer(tmp[0]);
    setSelectedSet(tmp[0].set);
    modalOpen(param);
  };
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content={msg} onDismiss={toggleActive} duration={2000} />
  ) : null;

  const [isVisible, setIsVisible] = useState({
    addCustomer: false,
    editCustomer: false,
    deleteCustomer: false,
  });
  const modalOpen = (id) => {
    let isVisibleTemp = { ...isVisible };
    if (id == "addCustomer") {
      setSelectedSet("");
    }
    if (isVisibleTemp[id]) {
      isVisibleTemp[id] = false;
      setIsVisible(isVisibleTemp);
    } else {
      isVisibleTemp[id] = true;
      setIsVisible(isVisibleTemp);
    }
    setValidationError({});
  };
  const rows = [];
  customers.map((customer, index) => {
    let newArray = [];
    newArray.push(
      <b>{customer.customer_id}</b>,
      customer.name,
      customer.customer_id2,
      <b>{customer.set}</b>,
      <ButtonGroup>
        <Button
          size="micro"
          onClick={() => handleEditCustomer(customer.id, "editCustomer")}
        >
          <Icon source={EditMinor} color="base" />
        </Button>
        <Button
          size="micro"
          destructive
          outline
          onClick={() => {
            modalOpen("deleteCustomer");
            setDeleteCustomerID(customer.id);
            setDeleteCustomerName(customer.name);
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
    const inputs = document.querySelectorAll("input,textarea");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keydown", function (event) {
        if(event.keyCode == 13){
        event.preventDefault();
          const nextIndex = i + 1;
          if (nextIndex < inputs.length) {
            inputs[nextIndex].focus();
          } 
        }
        });
    }
    if(evt.keyCode==115 && isVisible.addCustomer ){
      document.getElementById("addCustBtn").click();
    }else if(evt.keyCode==115 && isVisible.editCustomer){
      document.getElementById("editCustBtn").click();
    }else if(evt.keyCode == 13){
    }else{}
  }


  return (
    <>
      <Page
       fullWidth
        title="Customers"
        primaryAction={{
          content: "Add Customer",
          icon: PlusMinor,
          onAction: () => modalOpen("addCustomer"),
        }}
      >
  
       <div className="no-border">
       <LegacyCard>
          {rows.length ? <DataTable
            columnContentTypes={["text", "text","text", "text", "text"]}
            headings={["Customer ID", "Name","Customer ID2", "Set", "Action"]}
            rows={rows}
            hasZebraStripingOnData
            increasedTableDensity
            defaultSortDirection="descending"
          />:   <Card>
          <Text alignment="center" variant="headingMd" as="h3">No customer found</Text>
        </Card>}
         
        </LegacyCard>
       </div>

        {/* Add customer popup */}
        <Modal
          open={isVisible.addCustomer}
          onClose={() => modalOpen("addCustomer")}
          title="Add New Customer"
          primaryAction={{
            content: "Add Customer",
            onClick: () => document.getElementById("addCustBtn").click(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("addCustomer"),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={(e)=> console.log(e)}>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <div className="row">
                    <div className="col">
                      <TextField
                        label="Customer ID"
                        type="number"
                        name="customer_id"
                        placeholder="Enter ID"
                        value={addFormData.customer_id}
                        requiredIndicator={true}
                        error={validationError.customer_id}
                        onChange={(e) => addFormHandler(e, "customer_id")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={addFormData.name}
                        error={validationError.name}
                        requiredIndicator={true}
                        onChange={(e) => addFormHandler(e, "name")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Customer ID2"
                        type="number"
                        name="customer_id2"
                        placeholder="Enter ID2"
                        value={addFormData.customer_id2}
                        onChange={(e) => addFormHandler(e, "customer_id2")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Limit"
                        type="number"
                        step="any"
                        name="limit"
                        placeholder="Enter limit"
                        value={addFormData.limit}
                        onChange={(e) => addFormHandler(e, "limit")}
                      />
                    </div>
                  </div>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <div className="row">
                    <div className="col">
                      <Select
                        label="Set"
                        name="set"
                        id="set"
                        options={setOptions}
                        value={selectedSet}
                        error={validationError.set}
                        requiredIndicator={true}
                        onChange={(e) => onChangeSet(e)}
                        required
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
                </Grid.Cell>
              </Grid>
              <Button id="addCustBtn" onClick={submitHandler}>
                Submit
              </Button>
            </Form>
          </Modal.Section>
        </Modal>

        {/* Edit customer popup */}
        <Modal
          open={isVisible.editCustomer}
          onClose={() => modalOpen("editCustomer")}
          title="Edit Customer"
          primaryAction={{
            content: "Update Customer",
            onAction: () => document.getElementById("editCustBtn").click(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("editCustomer"),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={(e)=> console.log(e)}>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <div className="row">
                    <div className="col">
                      <TextField
                        label="Customer ID"
                        type="number"
                        name="customer_id"
                        placeholder="Enter customer ID"
                        error={validationError.cid}
                        requiredIndicator={true}
                        value={editCustomer.customer_id}
                        onChange={(e) => editFormHandler(e, "customer_id")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={editCustomer.name}
                        error={validationError.name}
                        requiredIndicator={true}
                        onChange={(e) => editFormHandler(e, "name")}
                      />
                    </div>

                    <div className="col">
                      <TextField
                        label="Customer ID2"
                        type="number"
                        name="customer_id2"
                        placeholder="Enter ID2"
                        value={editCustomer.customer_id2}
                        onChange={(e) => editFormHandler(e, "customer_id2")}
                      />
                    </div>

                    <div className="col">
                      <TextField
                        label="Limit"
                        type="number"
                        step="any"
                        name="limit"
                        placeholder="Enter limit"
                        value={editCustomer.limit}
                        onChange={(e) => editFormHandler(e, "limit")}
                      />
                    </div>
                  </div>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <div className="row">
                    <div className="col">
                      <Select
                        label="Set"
                        name="set"
                        id="set"
                        options={setOptions}
                        value={selectedSet}
                        error={validationError.set}
                        requiredIndicator={true}
                        onChange={(e) => onChangeSetEdit(e)}
                        required
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Commision"
                        type="number"
                        step="any"
                        name="commission"
                        value={editCustomer ? editCustomer.commission : ""}
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
                        value={editCustomer ? editCustomer.pana : ""}
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
                        value={editCustomer ? editCustomer.partnership : ""}
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
                        value={editCustomer ? editCustomer.partnership2 : ""}
                        onChange={(e) => editFormHandler(e, "partnership2")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Multiple"
                        type="number"
                        step="any"
                        name="multiple"
                        value={editCustomer ? editCustomer.multiple : ""}
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
                        value={editCustomer ? editCustomer.sp : ""}
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
                        value={editCustomer ? editCustomer.dp : ""}
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
                        value={editCustomer ? editCustomer.jodi : ""}
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
                        value={editCustomer ? editCustomer.tp : ""}
                        onChange={(e) => editFormHandler(e, "tp")}
                        required
                      />
                    </div>
                  </div>
                </Grid.Cell>
              </Grid>
              <Button id="editCustBtn" onClick={updateHandler}>
                Update
              </Button>
            </Form>
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
            onAction: () => deletehandler(deleteCustomerID),
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
              Are you sure you want to delete <b>{customerName}</b>!
            </div>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}
