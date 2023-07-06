import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import delet from './assets/delet.svg';
import edit from './assets/edit.svg';
import { toast } from 'react-toastify';
import { IndexTable, Text, Modal, Button, Toast, FormLayout, Form, TextField, Page, LegacyCard, Thumbnail, Grid, Icon,Select, Frame } from '@shopify/polaris';
import {
  EditMajor,
  DeleteMajor,
  PlusMinor
} from '@shopify/polaris-icons';


export default function Set() {
  const navigate = useNavigate();

  const [addFormData, setAddFormData] = useState({});
  const [editSet, setEditSet] = useState({});
  const [deleteSetID, setDeleteSetID] = useState("");
  const addFormHandler = (value,param) => {
    const fieldName = param;
    const fieldValue = value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const handleEditSet = (id, param) => {
    let tmp = setData.filter((item) => item.id === id)
    setEditSet(tmp[0]);
    modalOpen(param);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    addNote();
    navigate("/customer");
    toast.success('Set added successfully');
    modalOpen('addSet');
  };

  const editFormHandler = (value,param) => {
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
          ...editSet
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
  };
  const updateHandler = (event) => {
    updateSet();
    event.preventDefault();
    modalOpen('editSet');
  };

  const [setData, updateSetdata] = useState([]);
  const [isVisible, setIsVisible] = useState({ addSet: false, editSet: false, deleteSet: false });
  const modalOpen = (id) => {
    let isVisibleTemp = { ...isVisible };
    if (isVisibleTemp[id]) {
      isVisibleTemp[id] = false;
      setIsVisible(isVisibleTemp);
    } else {
      isVisibleTemp[id] = true;
      setIsVisible(isVisibleTemp);
    }
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
    modalOpen('deleteSet');
  }

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
      await writeTextFile(
        { path: "set.json", contents: JSON.stringify(setData) },
        { dir: BaseDirectory.Resource }
      );
      getdataFromFile();
      console.log(error);
    }
  };
  useEffect(() => {

    getdataFromFile();
  }, []);

  const resourceName = {
    singular: 'setData',
    plural: 'setDatas',
  };

  const rowMarkup = setData.map(
    (
      { id,set, commission, pana, sp, dp,partnership,multiple,jodi,tp },
      index,
    ) => (

      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {set}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{commission}</IndexTable.Cell>
        <IndexTable.Cell>{pana}</IndexTable.Cell>
        <IndexTable.Cell>{partnership}</IndexTable.Cell>
        <IndexTable.Cell>{multiple}</IndexTable.Cell>
        <IndexTable.Cell>{sp}</IndexTable.Cell>
        <IndexTable.Cell>{dp}</IndexTable.Cell>
        <IndexTable.Cell>{jodi}</IndexTable.Cell>
        <IndexTable.Cell>{tp}</IndexTable.Cell>
        <IndexTable.Cell>
          <Button onClick={() => handleEditSet(id, 'editSet')}>
            <Icon
              source={EditMajor}
              color="base"
            />
          </Button>
          <Button onClick={() => {
            modalOpen('deleteSet')
            setDeleteSetID(id)
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
        title="Set"
        primaryAction={{ content: 'Add New Set', icon: PlusMinor, onAction: () => modalOpen('addSet') }}>
                <LegacyCard>
          <IndexTable
            resourceName={resourceName}
            itemCount={setData.length}
            headings={[
              { title: 'Set' },
              { title: 'Commission' },
              { title: 'Pana' },
              { title: 'Partnership' },
              { title: 'Multiple' },
              { title: 'SP'},
              { title: 'DP'},
              { title: 'JODI'},
              { title: 'TP'},
              { title: 'Action'},
            ]}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
        </LegacyCard>

         

    {/* Add set popup */}
    <Modal
          // activator={activator}
          open={isVisible.addSet}
          onClose={() => modalOpen('addSet')}
          title="Add New Set"
          primaryAction={{
            content: 'Add Set',
            onAction: () => document.getElementById('addSetBtn').click(),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('addSet'),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={submitHandler}>
            <TextField
             label="Set"
                        type="number"
                        step="any"
                        name="set"
                        value={addFormData ? addFormData.set : ""}
                        onChange={(e)=>addFormHandler(e,'set')}
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
 
                   
                <Button id="addSetBtn" submit>Submit</Button>

             
            </Form>

    
          </Modal.Section>
        </Modal>

   {/* Edit set popup */}
   <Modal
          open={isVisible.editSet}
          onClose={() => modalOpen('editSet')}
          title="Edit Set"
          primaryAction={{
            content: 'Update Set',
            onAction: () => document.getElementById('editSetBtn').click(),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('editSet'),
            },
          ]}
        >
          <Modal.Section>
          <Form onSubmit={updateHandler}>
            <TextField
             label="Set"
                        type="number"
                        step="any"
                        name="set"
                        value={editSet ? editSet.set : ""}
                        onChange={(e)=>editFormHandler(e,'set')}
                        required
                      />
          <TextField
            label="Commision"
            type="number"
            step="any"
            name="commission"
            value={editSet ? editSet.commission : ""}
            onChange={(e)=>editFormHandler(e,'commission')}
            required
          />
     
          <TextField
            label="Pana"
            type="number"
            step="any"
            name="pana"
            value={editSet ? editSet.pana : ""}
            onChange={(e)=>editFormHandler(e,'pana')}
            required
          />
      
          <TextField
            label="Partnership"
            type="number"
            step="any"
            name="partnership"
            value={editSet ? editSet.partnership : ""}
            onChange={(e)=>editFormHandler(e,'partnership')}
            required
          />
    
       
          <TextField
             label="Multiple"
            type="number"
            step="any"
            name="multiple"
            value={editSet ? editSet.multiple : ""}
            onChange={(e)=>editFormHandler(e,'multiple')}
            required
          />
        
          <TextField
          label="SP"
            type="number"
            step="any"
            name="sp"
            value={editSet ? editSet.sp : ""}
            onChange={(e)=>editFormHandler(e,'sp')}
            required
          />
       
          <TextField
          label="DP"
            type="number"
            step="any"
            name="dp"
            value={editSet ? editSet.dp : ""}
            onChange={(e)=>editFormHandler(e,'dp')}
            required
          />
         
     
          <TextField
              label="JODI"
            type="number"
            step="any"
            name="jodi"
            value={editSet ? editSet.jodi : ""}
            onChange={(e)=>editFormHandler(e,'jodi')}
            required
          />
    
          <TextField
           label="TP"
            type="number"
            step="any"
            name="tp"
            value={editSet ? editSet.tp : ""}
            onChange={(e)=>editFormHandler(e,'tp')}
            required
          />
 
                   
                <Button id="editSetBtn" submit>Submit</Button>

             
            </Form>
            

          </Modal.Section>
        </Modal>


         {/* Delete set popup */}
         <Modal
          // activator={activator}
          open={isVisible.deleteSet}
          onClose={() => modalOpen('deleteSet')}
          title="Delete Set"
          primaryAction={{
            content: 'Yes',
            onAction: () => deletehandler(deleteSetID),
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => modalOpen('deleteSet'),
            },
          ]}
        >
          <Modal.Section>

            <div className="">
              Are you sure you want to delete this set!
            </div>


          </Modal.Section>
        </Modal>
   
     
     </Page>
    </>
  );
}
