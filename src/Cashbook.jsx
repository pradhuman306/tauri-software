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
import { EditMinor, DeleteMinor, PlusMinor,ViewMajor } from "@shopify/polaris-icons";
import { MyContext } from "./App";

export default function Cashbook() {
  document.onkeydown = keydown;
  const navigate = useNavigate();
  const { setMessage, setErrorMessage } = useContext(MyContext);
  const [addFormData, setAddFormData] = useState({});
  const [cashCustData, setcashCustData] = useState({});
  const [AllCashcustomers, setAllCashcustomers] = useState([]);
  const [cashbookcustomerData, setcashbookcustomerData] = useState({customer_id:'CB'+1});
  const [editSet, setEditSet] = useState({});
  const [deleteSetID, setDeleteSetID] = useState("");
  const [setName, updateSetName] = useState("");
  const [Password, setPassword] = useState("");
  const [pageAccess, setpageAccess] = useState(false);
  const [customers, setcustomers] = useState([]);
  const [customersOptions, setcustomersOptions] = useState([]);

  const [validationError, setValidationError] = useState({
    set: false,
    customer_id:false
  });
  const [passwordvalidationError,setpasswordvalidationError]= useState({
    password:false,
  })
  const getdataFromFile = async () => {

    // customers 
    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycust = JSON.parse(myfiledata);
      setcustomers(mycust);
      let custOpt = [{ label: "Select Customer", value: "" }];
      mycust.sort((a, b) => parseInt(a.customer_id) > parseInt(b.customer_id) ? 1 : -1).map((data) => {
        custOpt.push({ label: data.name + " (" + data.customer_id + ")", value: data.customer_id });
      })
      setcustomersOptions(custOpt);
    } catch (error) {
              // console.log(error);
    }

    // setAllCashcustomers
    try {
      const myfiledata = await readTextFile("cashbookcustomer.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      setAllCashcustomers(mydata);
      var maxId = Math.max(...mydata.map(o => o.customer_id));
      maxId = maxId == '-Infinity' ? 0 : maxId;
      const newData = { ...cashbookcustomerData };
      newData['customer_id'] = 'CB'+(maxId+1);
      setcashbookcustomerData(newData);
    } catch (error) {
              // console.log(error);
    }
    try {
      const myfiledata = await readTextFile("cashbook.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      updateSetdata(mydata);
      console.log(mydata);
    } catch (error) {
              // console.log(error);
    }
  };
  useEffect(() => {
    getdataFromFile();
    if(!pageAccess){
      modalOpen("pageLock");
    }
  }, []);

  const cashbookcustomerHandler = (value,param) => {
    let validationErr = { ...validationError };
    if (value && param == "customer_id") {
      validationErr.customer_id = false;
    }
    setValidationError(validationErr);
    const fieldName = param;
    let fieldValue = value;
    const newData = { ...cashbookcustomerData };
    newData[fieldName] = fieldValue;
    setcashbookcustomerData(newData);
  }

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
    console.log(setData);
    let tmp = setData.filter((item) => item.id === id);
    setEditSet(tmp[0]);
    modalOpen(param);
  };

  const submitNewCustomer = async (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };
    let isSubmit = true;
    if (!cashbookcustomerData.customer_id) {
      isSubmit = false;
    } else {
      validationErr.customer_id = false;
    }

    let filteredCustomer = AllCashcustomers.filter((data)=>data.customer_id == cashbookcustomerData.customer_id);
    if(filteredCustomer.length){
      isSubmit = false; 
      setErrorMessage("Customer ID already exist");
    }

    if (isSubmit) {
      modalOpen("addCustomer");
  addnewcustomer([{ ...cashbookcustomerData }, ...AllCashcustomers]);
    }else{
    }
    setValidationError(validationErr);
  }

const addnewcustomer = async (customers) => {
  setAllCashcustomers([...customers]);
  await writeTextFile(
    { path: "cashbookcustomer.json", contents: JSON.stringify(customers) },
    { dir: BaseDirectory.Resource }
  );
  setMessage("Customer added successfully");
  setcashbookcustomerData({});
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
      setMessage("Record added successfully");
      modalOpen("addSet");
    }
    setValidationError(validationErr);
  };

  const changePassword = (value, param) => {
    setPassword(value);
    console.log(value);
  };

  const verifyPassword = () => {
    let pvalidationErr = { ...passwordvalidationError };
    if(Password == '2023'){
      setpageAccess(true);
      modalOpen("pageLock");
    pvalidationErr.password = false;
    console.log('trueeeeeeeeee');
    }else{
    pvalidationErr.password = 'Invalid password !';
      setpageAccess(false);
    console.log('falseeeeeeeeee');
    }
    setpasswordvalidationError(pvalidationErr);
  }

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
    console.log(editSet);
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
    location.reload();
    setMessage("Record updated successfully");
  };

  const updateHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };
    let isSubmit = true;
    if (!editSet.id) {
      validationErr.debit = "Refresh and try again";
      isSubmit = false;
    } else {
      validationErr.debit = false;
    }
    if (isSubmit) {
      updateSet();
      modalOpen("editSet");
    }
    setValidationError(validationErr);
  };

  const handleEditcash = (id, cid,param) => {
    let tmp = setData.filter((item) => item.id === id);
    setEditSet(tmp[0]);
    modalOpen(param);
  };

  const [setData, updateSetdata] = useState([]);
  const [deleteCustomerID, setDeleteCustomerID] = useState("");
  const [infoCustomerID, setInfoCustomerID] = useState("");
  const [infoCustomerName, setInfoCustomerName] = useState("");
  const [customerName, setDeleteCustomerName] = useState("");
  const [rowsCustomer, setrowsCustomer] = useState([]);
  useEffect(() => {
    let rowsCustomer2 = [];
    let tmp = setData.filter(function (a) {
      return a.cid == infoCustomerID;
    });
    tmp.map((customer, index) => {
      let newArray = [];
      newArray.push(index+1,customer.date,<span className="credit">{customer.credit?''+customer.credit+' CR':''}</span>,<span className="debit">{customer.debit?''+customer.debit+' DR':''}</span>, customer.remark?customer.remark:'',
      <Button size="micro" onClick={() => handleEditSet(customer.id,"editSet")}>
      <Icon source={EditMinor} color="base" />
    </Button>);
      rowsCustomer2.push(newArray);
    });
    setrowsCustomer(rowsCustomer2);
  }, [infoCustomerID,setData])

  const deleteCashbookData = async (id) => {
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
    addCustomer: false,
    customerInfo:false,
    pageLock:false,
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
    if(id == 'addCustomer'){
      var maxId = Math.max(...AllCashcustomers.map(o => parseInt(o.customer_id.replace(/\D/g, ""))));
      maxId = (maxId == '-Infinity') ? 0 : maxId;
      const newData = { ...cashbookcustomerData };
      newData['customer_id'] = 'CB'+(parseInt(maxId)+1);
      setcashbookcustomerData(newData);
    }
    if(id == 'addSet'){
      let custOpt = [{ label: "Select Customer", value: "" }];
      customers.map((data) => {
        custOpt.push({ label: data.name + " (" + data.customer_id + ")", value: data.customer_id });
      })
      AllCashcustomers.sort((a, b) => a.customer_id > b.customer_id ? 1 : -1).map((data) => {
        custOpt.push({ label: data.name + " (" + data.customer_id + ")", value: data.customer_id });
      })
      setcustomersOptions(custOpt);
    }
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
    setMessage("Record deleted successfully");
    modalOpen("deleteSet");
  };

  const getdateFormet = (date) => {
    var todaydate = new Date(date);
    let day = todaydate.getDate();
    let month = todaydate.getMonth() + 1;
    let year = todaydate.getFullYear();
    if (month.toString().length <= 1) {
      month = '0' + month;
    }
    if (day.toString().length <= 1) {
      day = '0' + day;
    }
    return day+'-'+month+'-'+year;
  }

  function format(num) {
    if(num){
      return (num / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }else{
      return num;
    }
  }

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
    getdataFromFile();
  };
  const rows = [];
  const footerRows = [];
  var result = setData.reduce((acc, {cid, credit, debit,date}) => ({...acc, [cid]: {cid, credit: acc[cid] ? Number(acc[cid].credit) + Number(credit): Number(credit), debit: acc[cid] ? Math.abs(Number(acc[cid].debit)) + Math.abs(Number(debit)): Math.abs(Number(debit)),date:date}}), {});
  result = Object.values(result);
  var TotalCredit = 0;
  var TotalDebit = 0;
  result.map((data, index) => {
    let newArray = [];
    var found = customers.find(obj => {
      return obj.customer_id === data.cid;
    });
    if(!found){
      found = AllCashcustomers.find(obj => {
        return obj.customer_id === data.cid;
      });
    }
    if(found){
      TotalCredit = TotalCredit+data.credit;
      TotalDebit = TotalDebit+data.debit;
    newArray.push(
      data.cid,
     <b className="customerinfo" onClick={() => {
       setInfoCustomerID(data.cid);
       setInfoCustomerName(found.name);
        modalOpen("customerInfo");
    }}>{found.name}</b>,
      getdateFormet(data.date),
      <span className="credit">{data.credit?''+format(data.credit)+' CR':''}</span>,
      <span className="debit">{data.debit?''+format(data.debit)+' DR':''}</span>,
      Number(data.credit)-Number(data.debit) !== 0 ? (<b className={Number(data.credit)-Number(data.debit) > 0 ? 'credit' : 'debit'}>{format(Math.abs(Number(data.credit)-Number(data.debit)))+''+((Number(data.credit)-Number(data.debit))>0?' CR':' DR')}</b>):'=',
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

        <Button
          size="micro"
          outline
          onClick={() => {
            setInfoCustomerID(data.cid);
            setInfoCustomerName(found.name);
             modalOpen("customerInfo");
          }}
        >
          <Icon source={ViewMajor} color="base" />
        </Button>

      </ButtonGroup>
    );
  }
    rows.push(newArray);
  });
  footerRows.push('','','',<b className="credit">{format(TotalCredit)} CR</b>,<b className="debit">{format(TotalDebit)} DR</b>,<b>{TotalCredit> TotalDebit? <b className="credit">{format(TotalCredit-TotalDebit)} CR</b>: <b className="debit">{format(TotalDebit-TotalCredit)} DR </b>}</b>,'');
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
    if(evt.keyCode==115 && isVisible.addSet ){
      document.getElementById("addSetBtn").click();
    }else if(evt.keyCode==115 && isVisible.editSet){
      document.getElementById("editSetBtn").click();
    }
  
  }

  return (
    <div className={pageAccess?'cashbook-table':'cashbook-table background-blur'}>
      <Page
        title="CashBook"
        fullWidth
        // primaryAction={{
        //   content: "Add Payment",
        //   icon: PlusMinor,
        //   onAction: () => modalOpen("addSet"),
        // }}

        primaryAction={
          <ButtonGroup>
            <div className="col subHeader">
                <Button
                primary
                  onClick={(e) => modalOpen('addSet')}
                >
                  Add Payment
                  </Button>
              </div>
              <div className="col subHeader">
                <Button
                primary
                onClick={(e) => modalOpen("addCustomer")}
                > Add Customer
                </Button>
              </div>
          </ButtonGroup>
        }
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
              "text",
              "text"
            ]}
            headings={[
              "CID",
              "Name",
              "Date",
              "Credit",
              "Debit",
              "Total",
              "Action",
            ]}
            rows={rows}
            totals={footerRows}
            showTotalsInFooter
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
            <Form onSubmit={()=>console.log('submit')}>
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
                    placeholder="Enter credit"
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
                    placeholder="Enter debit"
                    step="any"
                    name="debit"
                    value={addFormData ? addFormData.debit : 0}
                    onChange={(e) => addFormHandler(e, "debit")}
                    required
                  />
                </div>
                <div className="col textarea">
                <TextField
                    multiline={4}
                    label="Remark"
                    type="text"
                    placeholder="Enter Remark"
                    step="any"
                    name="remark"
                    value={addFormData ? addFormData.remark : ''}
                    onChange={(e) => addFormHandler(e, "remark")}
                    required
                  />
                </div>
              </div>

              <Button id="addSetBtn" onClick={submitHandler}>
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

        {/* // customer add modal  */}
        <Modal
      open={isVisible.addCustomer}
      onClose={() => modalOpen("addCustomer")}
      title="Add Cashbook Customer"
    >
      <Modal.Section>
        <Form onSubmit={()=>console.log('customer submit')}>
              <div className="row">
                <div className="col">
                  <TextField
                  readOnly
                    label="Customer ID"
                    type="text"
                    name="customer_id"
                    placeholder="Enter customer ID"
                    value={cashbookcustomerData.customer_id}
                    error={validationError.cid}
                    requiredIndicator={true}
                    onChange={(e) => cashbookcustomerHandler(e, "customer_id")}
                  />
                </div>
                <div className="col">
                  <TextField
                    label="Customer Name"
                    type="text"
                    name="name"
                    placeholder="Enter customer name"
                    value={cashbookcustomerData.name}
                    error={validationError.name}
                    requiredIndicator={true}
                    onChange={(e) => cashbookcustomerHandler(e, "name")}
                  />
                </div>
              </div>
          <Button primary onClick={submitNewCustomer}>
            Submit
          </Button>
        </Form>
      </Modal.Section>
    </Modal>
    {/* customer info */}

    <Modal
    large
          open={isVisible.customerInfo}
          onClose={() => modalOpen('customerInfo')}
          title={'Customer: '+infoCustomerName+', CID: '+ infoCustomerID}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => modalOpen('customerInfo'),
            },
          ]}
        >
          <Modal.Section>
            <LegacyCard>
              <DataTable
                columnContentTypes={["text", "text", "text","text","text","text"]}
                headings={["S.no.","Date","Credit","Debit","Remark","Action"]}
                rows={rowsCustomer}
                hasZebraStripingOnData
                increasedTableDensity
                defaultSortDirection="descending"
              />
            </LegacyCard>
          </Modal.Section>
        </Modal>
    {/* customer info end */}


       {/* Edit set popup */}
       <Modal
          small
          open={isVisible.editSet}
          onClose={() => modalOpen("editSet")}
          title="Edit Cashbook"
          primaryAction={{
            content: "Update",
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
            <Form onSubmit={()=>console.log('update')}>
              <div className="row">
                <div className="col">
                  <TextField
                    label="Credit"
                    type="number"
                    step="any"
                    name="credit"
                    placeholder="Enter Credit Amount"
                    value={editSet && editSet.credit ? editSet.credit : ''}
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
                    placeholder="Enter Debit Amount"
                    value={editSet && editSet.debit ? editSet.debit : ''}
                    onChange={(e) => editFormHandler(e, "debit")}
                    required
                  />
                </div>
                <div className="col">
                  <TextField
                    multiline={4}
                    label="Remark"
                    type="text"
                    placeholder="Enter Remark"
                    name="remark"
                    value={editSet ? editSet.remark : ''}
                    onChange={(e) => editFormHandler(e, "remark")}
                    required
                  />
                </div>
              </div>
              <Button id="editSetBtn" onClick={updateHandler}>
                Submit
              </Button>
            </Form>
          </Modal.Section>
        </Modal>

         {/* Lock popup */}
         <Modal
          small
          open={isVisible.pageLock}
          title="Enter Privacy Password"
          onClose={(e)=> navigate(-1)}
          primaryAction={{
            content: "Verify",
            onAction: () => verifyPassword(),
          }}
          secondaryActions={{
            content:'← Go Back',
            onAction:()=> navigate(-1)
          }}
        >
          <Modal.Section>
            <div className="pagelock">
            <Form onSubmit={()=>console.log('p submit')}>
            <TextField
                    type="Password"
                    placeholder="Enter Password"
                    name="Password"
                    value={Password}
                    error={passwordvalidationError.password}
                    onChange={(e) => changePassword(e, "Password")}
                    onkeydown={(e)=>console.log(e,'p submit')}
                    required
                  />
                  </Form>
            </div>
          </Modal.Section>
        </Modal>

      </Page>
    </div>
  );
}
