import { React, useCallback, useContext, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import delet from './assets/delet.svg';
import edit from './assets/edit.svg';
import { IndexTable, Text, Modal, Button, Toast, FormLayout, Form, TextField, Page, LegacyCard, Thumbnail, Grid, Icon,Select, Frame } from '@shopify/polaris';
import {
  EditMajor,
  DeleteMajor,
  PlusMinor
} from '@shopify/polaris-icons';
import { MyContext } from "./App";

export default function Customer() {
  const { message,setMessage } = useContext(MyContext);
  const [validationError,setValidationError] = useState({
    cid:false,
    name:false,
    set:false
  });
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [selectedSet, setSelectedSet] = useState('');
  const [msg, setMsg] = useState('');
  const [addFormData, setAddFormData] = useState({
    customer_id: "",
    commission: "",
    dp: "",
    jodi: "",
    multiple: "",
    pana: "",
    partnership: "",
    set: "",
    tp: "",
    sp: "",
  });
  const addFormHandler = (value,param) => {
    let validationErr = {...validationError};
   if(value && param == 'customer_id'){
    validationErr.cid = false;
   }
   if(value && param == 'name'){
    validationErr.name = false;
   }
   if(value && param == 'set'){
    validationErr.set = false;
   }
   setValidationError(validationErr);
    const fieldName = param;
    const fieldValue = value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);


  };

  const editFormHandler = (value,param) => {
    let validationErr = {...validationError};
    if(value && param == 'customer_id'){
     validationErr.cid = false;
    }
    if(value && param == 'name'){
     validationErr.name = false;
    }
    if(value && param == 'set'){
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
    let validationErr = {...validationError};
   
    let isSubmit = true;
    if(!addFormData.customer_id){
      validationErr.cid = "Please enter customer ID";
      isSubmit = false;
    }else{
      validationErr.cid = false;
    }
    if(!addFormData.set){
      validationErr.set = "Please select set";
      isSubmit = false;
    }else{
      validationErr.set = false;
    }
    if(!addFormData.name){
      validationErr.name = "Please enter customer name";
      isSubmit = false;
    }else{
      validationErr.name = false;
    }
  if(isSubmit){
    addNote();
    navigate("/entry");
    modalOpen('addCustomer');
  }
  setValidationError(validationErr);
   
   
 
  };
  const updateHandler = (event) => {
    event.preventDefault();
    let validationErr = {...validationError};
   
    let isSubmit = true;
    if(!editCustomer.customer_id){
      validationErr.cid = "Please enter customer ID";
      isSubmit = false;
    }else{
      validationErr.cid = false;
    }
    if(!editCustomer.set){
      validationErr.set = "Please select set";
      isSubmit = false;
    }else{
      validationErr.set = false;
    }
    if(!editCustomer.name){
      validationErr.name = "Please enter customer name";
      isSubmit = false;
    }else{
      validationErr.name = false;
    }
    if(isSubmit){
      updateCustomer();
      modalOpen('editCustomer');
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
    setMessage('Customer added successfully');
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
    // addFormData.date = datetime;
    addFormData.date = new Date(Date.now());
    addFormData.id = Date.now();
    addnewcustomer([{ ...addFormData }, ...customers]);

  };


  const updateCustomer = async () => {
    customers = customers.map((obj) => {
      if (obj.id == editCustomer.id) {
        return {
          ...editCustomer
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
   
    setMessage('Customer updated successfully');
    getNotesFromFile();
  };

  const onChangeSet = async (e) => {
    setSelectedSet(e);
    let validateErr = {...validationError};
    if(e != ''){
      validateErr.set = false;
    }else{
      validateErr.set = 'Please select set';
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
    newFormData["set"] = fdata[0] ? fdata[0]["set"] : "";
    newFormData["tp"] = fdata[0] ? fdata[0]["tp"] : "";
    newFormData["sp"] = fdata[0] ? fdata[0]["sp"] : "";
    setAddFormData(newFormData);
  };

  const onChangeSetEdit = async (e) => {
    setSelectedSet(e);
    let validateErr = {...validationError};
    if(e != ''){
      validateErr.set = false;
    }else{
      validateErr.set = 'Please select set';
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
      let optionsSet = [{label:"Select set",value:""}];
      updateSetData(mysetData);
      mysetData.map((data)=>{
        optionsSet.push({label:data.set,value:data.set})
      })
      updateSetOptions(optionsSet);
    } catch (error) {
      await writeTextFile(
        { path: "set.json", contents: JSON.stringify(setData) },
        { dir: BaseDirectory.Resource }
      );
      console.log(error);
    }

    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycustomers = JSON.parse(myfiledata);
      setcustomers(mycustomers);
    } catch (error) {
      await writeTextFile(
        { path: "customers.json", contents: JSON.stringify(customers) },
        { dir: BaseDirectory.Resource }
      );
      console.log(error);
    }
  };
  useEffect(() => {


    getNotesFromFile();
  }, []);


  const deletehandler = async (id) => {

    customers = customers.filter(function (a) {
      return a.id != id;
    });
    console.log(customers);
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    getNotesFromFile();

    setMessage('Customer deleted successfully');
    modalOpen('deleteCustomer');
  }


  // customers
  var [customers, setcustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState({});
  const [deleteCustomerID, setDeleteCustomerID] = useState("");


  const handleEditCustomer = (id, param) => {
    let tmp = customers.filter((item) => item.id === id)
    setEditCustomer(tmp[0]);
    setSelectedSet(tmp[0].set);
    modalOpen(param);
  }
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast content={msg} onDismiss={toggleActive} duration={2000} />
  ) : null;




  const [isVisible, setIsVisible] = useState({ addCustomer: false, editCustomer: false, deleteCustomer: false });
  const modalOpen = (id) => {
    let isVisibleTemp = { ...isVisible };
    if(id=='addCustomer'){
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
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const rowMarkup = customers.map(
    (
      { name, customer_id, set, id },
      index,
    ) => (

      <IndexTable.Row id={customer_id} key={customer_id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {customer_id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{set}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleEditCustomer(id, 'editCustomer')}>
            <Icon
              source={EditMajor}
              color="base"
            />
          </Button>
          <Button onClick={() => {
            modalOpen('deleteCustomer')
            setDeleteCustomerID(id)
          }
          }>
            <Icon
              source={DeleteMajor}
              color="base"
            />

          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>

    ),
  );

  return (
    <>
      <Page fullWidth
        title="Customers"
        primaryAction={{ content: 'Add Customer', icon: PlusMinor, onAction: () => modalOpen('addCustomer') }}>
        <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={customers.length}
            headings={[
              { title: 'Cid' },
              { title: 'Name' },
              { title: 'Set' },
              { title: 'Action'},
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>


        {/* Add customer popup */}
        <Modal
          // activator={activator}
          open={isVisible.addCustomer}
          onClose={() => modalOpen('addCustomer')}
          title="Add New Customer"
          primaryAction={{
            content: 'Add Customer',
            onAction: () => document.getElementById('addCustBtn').click(),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('addCustomer'),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={submitHandler}>
            <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <TextField
                  label="Customer ID"
                  type="number"
                  name="customer_id"
                  placeholder="Enter customer ID"
                  value={addFormData.customer_id}
                  error={validationError.cid}
                  requiredIndicator={true}
                  onChange={(e)=>addFormHandler(e,'customer_id')}
                  
                />
              
                <TextField
                  label="Customer Name"
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={addFormData.name}
                  error={validationError.name}
                  requiredIndicator={true}
                  onChange={(e)=>addFormHandler(e,'name')}
                  
                />

                <TextField
                  label="Mobile Number 1"
                  type="number"
                  step="any"
                  name="mobile1"
                  placeholder="Enter mobile number"
                  value={addFormData.mobile1}
                  onChange={(e)=>addFormHandler(e,'mobile1')}
                />
                <TextField
                  label="Mobile Number 2"
                  type="number"
                  step="any"
                  name="mobile2"
                  placeholder="Enter mobile number"
                  value={addFormData.mobile2}
                  onChange={(e)=>addFormHandler(e,'mobile2')}
                />


                <TextField
                  label="Address"
                  name="address"
                  placeholder="Enter customer address"
                  value={addFormData.address}
                  onChange={(e)=>addFormHandler(e,'address')}
                  multiline={4}
                />
              
                <TextField
                  label="Limit"
                  type="number"
                  step="any"
                  name="limit"
                  placeholder="Enter limit"
                  value={addFormData.limit}
                  onChange={(e)=>addFormHandler(e,'limit')}
                />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <Select
                    label="Set"
                    name="set"
                    error={validationError.set}
                    id="set"
                    options={setOptions}
                    value={selectedSet}
                    requiredIndicator={true}
                    onChange={(e)=>onChangeSet(e)}
                    required
          />
         
          <TextField
            label="Commision"
            type="number"
            step="any"
            name="commission"
            value={addFormData ? addFormData.commission : ""}
            onChange={(e)=>addFormHandler(e,'commission')}
            required
          />
     
          <TextField
            label="Pana"
            type="number"
            step="any"
            name="pana"
            value={addFormData ? addFormData.pana : ""}
            onChange={(e)=>addFormHandler(e,'pana')}
            required
          />
      
          <TextField
            label="Partnership"
            type="number"
            step="any"
            name="partnership"
            value={addFormData ? addFormData.partnership : ""}
            onChange={(e)=>addFormHandler(e,'partnership')}
            required
          />
    
       
          <TextField
             label="Multiple"
            type="number"
            step="any"
            name="multiple"
            value={addFormData ? addFormData.multiple : ""}
            onChange={(e)=>addFormHandler(e,'multiple')}
            required
          />
        
          <TextField
          label="SP"
            type="number"
            step="any"
            name="sp"
            value={addFormData ? addFormData.sp : ""}
            onChange={(e)=>addFormHandler(e,'sp')}
            required
          />
       
          <TextField
          label="DP"
            type="number"
            step="any"
            name="dp"
            value={addFormData ? addFormData.dp : ""}
            onChange={(e)=>addFormHandler(e,'dp')}
            required
          />
         
     
          <TextField
              label="JODI"
            type="number"
            step="any"
            name="jodi"
            value={addFormData ? addFormData.jodi : ""}
            onChange={(e)=>addFormHandler(e,'jodi')}
            required
          />
    
          <TextField
           label="TP"
            type="number"
            step="any"
            name="tp"
            value={addFormData ? addFormData.tp : ""}
            onChange={(e)=>addFormHandler(e,'tp')}
            required
          />
 
                    </Grid.Cell>
                  </Grid>
                <Button id="addCustBtn" submit>Submit</Button>

             
            </Form>

    
          </Modal.Section>
        </Modal>



        {/* Edit customer popup */}
        <Modal
          open={isVisible.editCustomer}
          onClose={() => modalOpen('editCustomer')}
          title="Edit Customer"
          primaryAction={{
            content: 'Update Customer',
            onAction: () => document.getElementById('editCustBtn').click(),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('editCustomer'),
            },
          ]}
        >
          <Modal.Section>
          <Form onSubmit={updateHandler}>
            <Grid>
            <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                <TextField
                  label="Customer ID"
                  type="number"
                  name="customer_id"
                  placeholder="Enter customer ID"
                  error={validationError.cid}
                  requiredIndicator={true}
                  value={editCustomer.customer_id}
                  onChange={(e)=>editFormHandler(e,'customer_id')}
                  
                />
              
                <TextField
                  label="Customer Name"
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={editCustomer.name}
                  error={validationError.name}
                  requiredIndicator={true}
                  onChange={(e)=>editFormHandler(e,'name')}
                  
                />

                <TextField
                  label="Mobile Number 1"
                  type="number"
                  step="any"
                  name="mobile1"
                  placeholder="Enter mobile number"
                  value={editCustomer.mobile1}
                  onChange={(e)=>editFormHandler(e,'mobile1')}
                />
                <TextField
                  label="Mobile Number 2"
                  type="number"
                  step="any"
                  name="mobile2"
                  placeholder="Enter mobile number"
                  value={editCustomer.mobile2}
                  onChange={(e)=>editFormHandler(e,'mobile2')}
                />


                <TextField
                  label="Address"
                  name="address"
                  placeholder="Enter customer address"
                  value={editCustomer.address}
                  onChange={(e)=>editFormHandler(e,'address')}
                  multiline={4}
                />
              
                <TextField
                  label="Limit"
                  type="number"
                  step="any"
                  name="limit"
                  placeholder="Enter limit"
                  value={editCustomer.limit}
                  onChange={(e)=>editFormHandler(e,'limit')}
                />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 6, xl: 6}}>
                  <Select
                    label="Set"
                    name="set"
                    id="set"
                    options={setOptions}
                    value={selectedSet}
                    error={validationError.set}
                    requiredIndicator={true}
                    onChange={(e)=>onChangeSetEdit(e)}
                    required
          />
         
          <TextField
            label="Commision"
            type="number"
            step="any"
            name="commission"
            value={editCustomer ? editCustomer.commission : ""}
            onChange={(e)=>editFormHandler(e,'commission')}
            required
          />
     
          <TextField
            label="Pana"
            type="number"
            step="any"
            name="pana"
            value={editCustomer ? editCustomer.pana : ""}
            onChange={(e)=>editFormHandler(e,'pana')}
            required
          />
      
          <TextField
            label="Partnership"
            type="number"
            step="any"
            name="partnership"
            value={editCustomer ? editCustomer.partnership : ""}
            onChange={(e)=>editFormHandler(e,'partnership')}
            required
          />
    
       
          <TextField
             label="Multiple"
            type="number"
            step="any"
            name="multiple"
            value={editCustomer ? editCustomer.multiple : ""}
            onChange={(e)=>editFormHandler(e,'multiple')}
            required
          />
        
          <TextField
          label="SP"
            type="number"
            step="any"
            name="sp"
            value={editCustomer ? editCustomer.sp : ""}
            onChange={(e)=>editFormHandler(e,'sp')}
            required
          />
       
          <TextField
          label="DP"
            type="number"
            step="any"
            name="dp"
            value={editCustomer ? editCustomer.dp : ""}
            onChange={(e)=>editFormHandler(e,'dp')}
            required
          />
         
     
          <TextField
              label="JODI"
            type="number"
            step="any"
            name="jodi"
            value={editCustomer ? editCustomer.jodi : ""}
            onChange={(e)=>editFormHandler(e,'jodi')}
            required
          />
    
          <TextField
           label="TP"
            type="number"
            step="any"
            name="tp"
            value={editCustomer ? editCustomer.tp : ""}
            onChange={(e)=>editFormHandler(e,'tp')}
            required
          />
 
                    </Grid.Cell>
                  </Grid>
                <Button id="editCustBtn" submit>Update</Button>
            </Form>
            {/* <div className="add-customer-popup">

              <div className="customer-body">
                <form onSubmit={updateHandler}>
                  <div className="add-customer-body">
                    <div className="add-suctomer-left">
                      <div className="customer-id">
                        <label htmlFor="customer">Customer ID</label>
                        <input
                          type="number"
                          step="any"
                          name="customer_id"
                          value={editCustomer.customer_id}
                          placeholder="Enter customer ID"
                          onChange={editFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer name">Customer Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter customer name"
                          value={editCustomer.name}
                          onChange={editFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 1</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile1"
                          value={editCustomer.mobile1}
                          placeholder="Enter mobile number"
                          onChange={editFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 2</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile2"
                          value={editCustomer.mobile2}
                          placeholder="Enter mobile number"
                          onChange={editFormHandler}
                          required
                        />
                      </div>
                      <div className="address">
                        <label htmlFor="textarea">Address</label>
                        <textarea

                          name="address"
                          placeholder="Enter customer address"
                          cols="8"
                          value={editCustomer.address}
                          rows="5"
                          onChange={editFormHandler}
                        ></textarea>
                      </div>
                      <div>
                        <label>Limit</label>
                        <input
                          type="number"
                          step="any"
                          name="limit"
                          placeholder="Enter limit"
                          onChange={editFormHandler}
                          value={editCustomer.limit}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="set">Set</label>
                        <select
                          name="set"
                          id="set"
                          value={editCustomer.set}
                          onChange={editFormHandler}
                          required
                        >
                          <option key={0} value={""}>
                            Select Set
                          </option>
                          {setData.map((data, index) => (
                            <option key={index + 1} value={data.set}>
                              {data.set}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="add-button">
                    <button className="d-none" id="editCustBtn" type="submit"> Update customer </button>
                  </div>
                </form>
              </div>
            </div> */}

          </Modal.Section>
        </Modal>


        {/* Delete customer popup */}
        <Modal
          // activator={activator}
          open={isVisible.deleteCustomer}
          onClose={() => modalOpen('deleteCustomer')}
          title="Delete Customer"
          primaryAction={{
            content: 'Yes',
            onAction: () => deletehandler(deleteCustomerID),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('deleteCustomer'),
            },
          ]}
        >
          <Modal.Section>

            <div className="">
              Are you sure you want to delete this customer!
            </div>


          </Modal.Section>
        </Modal>
     
      </Page>



    </>
  );
}
