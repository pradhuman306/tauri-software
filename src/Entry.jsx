import { React, useContext, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { message } from "@tauri-apps/api/dialog";
import { toast } from 'react-toastify';
import { IndexTable, Text, Modal, Button, Toast, FormLayout, Form, TextField, Page, LegacyCard, Thumbnail, Grid, Icon, Select, Frame, List, ButtonGroup } from '@shopify/polaris';
import {
  EditMajor,
  DeleteMajor,
  PlusMinor
} from '@shopify/polaris-icons';
import { MyContext } from "./App";


export default function Entry() {
  const [customers, setcustomers] = useState([]);

  var [entries, setentries] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  const modalOpen = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };


  useEffect(() => {
    const getdataFromFile = async () => {
      try {
        const myfiledata = await readTextFile("customers.json", {
          dir: BaseDirectory.Resource,
        });
        const mycust = JSON.parse(myfiledata);
        setcustomers(mycust);
      } catch (error) {
        await writeTextFile(
          { path: "customers.json", contents: JSON.stringify(customers) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }
      // entries
      try {
        const myfiledataentries = await readTextFile("entries.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustentries = JSON.parse(myfiledataentries);
        setentries(mycustentries);
      } catch (error) {
        await writeTextFile(
          { path: "entries.json", contents: JSON.stringify(entries) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }
    };
    getdataFromFile();
  }, []);

  const [tabActive, setTabActive] = useState("");
  const [date, setDate] = useState("");

  const dateChange = async (value) => {
    setDate(value);
    setTabActive("");
  };

  const [timezone, setTimeZone] = useState("TO");
  const [inputFields, setInputFields] = useState([]);

  const handleChange = (value,name,index) => {
    const list = [...inputFields];
    list[index][name] = value;
    if (name == "customer_id") {
      const cdata = customers.filter(
        (item) => item.customer_id === value
      );
      list[index]["name"] = cdata && cdata[0] ? cdata[0]["name"] : "";
    }
    list[index]["timezone"] = timezone;
    setInputFields(list);
  };

  const addInputField = () => {
    setInputFields([
      ...inputFields,
      {
        id: Date.now(),
        timezone: "",
        date: date,
        customer_id: "",
        name: "",
        amount: "",
        pana_amount: "",
        khula_amount: "",
        sp_amount: "",
        dp_amount: "",
        jodi_amount: "",
        tp_amount: "",
      },
    ]);
  };
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const onChangesetTimeZone = (tz, index) => {
    setTimeZone(tz);
    setTabActive("");
    if (activeButtonIndex === index) return;
    setActiveButtonIndex(index);

  };



  const saveEntries = async () => {
    if (tabActive == "edit") {
      for (let index = 0; index < inputFields.length; index++) {
        const element = inputFields[index];
        entries = entries.map((obj) => {
          if (obj.id == element.id) {
            return {
              ...obj,
              customer_id: element.customer_id,
              name: element.name,
              date: date,
              amount: element.amount,
              pana_amount: element.pana_amount,
              khula_amount: element.khula_amount,
              sp_amount: element.sp_amount,
              dp_amount: element.dp_amount,
              jodi_amount: element.jodi_amount,
              tp_amount: element.tp_amount,
            };
          }
          //else return the object
          return { ...obj };
        });
      }
      await writeTextFile(
        { path: "entries.json", contents: JSON.stringify(entries) },
        { dir: BaseDirectory.Resource }
      );
      toast.success('Entry updated successfully');
    } else {
      setentries([...entries, ...inputFields]);
      await writeTextFile(
        {
          path: "entries.json",
          contents: JSON.stringify([...entries, ...inputFields]),
        },
        { dir: BaseDirectory.Resource }
      );
      setInputFields([
        {
          id: Date.now(),
          timezone: "",
          date: date,
          customer_id: "",
          name: "",
          amount: "",
          pana_amount: "",
          khula_amount: "",
          sp_amount: "",
          dp_amount: "",
          jodi_amount: "",
          tp_amount: "",
        },
      ]);
      toast.success('Entry saved successfully');
    }
    setTimeZone("");
    setTabActive("");

  };

  const newEntry = async (v) => {
    setTabActive(v);
    if (date == "") {
      toast.error('Please select date');
      // await message("First select date.", { title: "Account", type: "error" });
    } else {
      setInputFields([
        {
          id: Date.now(),
          timezone: "",
          date: date,
          customer_id: "",
          name: "",
          amount: "",
          pana_amount: "",
          khula_amount: "",
          sp_amount: "",
          dp_amount: "",
          jodi_amount: "",
          tp_amount: "",
        },
      ]);
    }
  };

  const editEntry = async (v) => {
    setTabActive(v);
    if (date == "" && timezone == "") {
      toast.error('Please select time and date');

      // await message("First select time and date.", {
      //   title: "Account",
      //   type: "error",
      // });
    } else if (date == "") {
      toast.error('Please select date');
      // await message("First select date.", { title: "Account", type: "error" });
    } else if (timezone == "") {
      toast.error('Please select time');
      // await message("First select time.", { title: "Account", type: "error" });
    } else {
      var startDate = new Date(date + " 00:00:01");
      var endDate = new Date(date + " 23:59:59");
      const filteredData = entries.filter(function (a) {
        var aDate = new Date(a.date);
        return aDate >= startDate && aDate <= endDate && a.timezone == timezone;
      });
      setInputFields(filteredData);
    }
  };

  const cancel = async () => {
    console.log("cancel");
  };
  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };
  const resourceNameInput = {
    singular: 'inputFields',
    plural: 'inputFields',
  };
  
  const rowMarkup = customers.map(
    (
      { id, customer_id, set, name },
      index,
    ) => (

      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {customer_id}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{set}</IndexTable.Cell>
      </IndexTable.Row>

    ),
  );

  const tableEdit = inputFields.map(
    (
      { 
        id,
        customer_id,
        name,
        amount,
        pana_amount,
        khula_amount,
        sp_amount,
        dp_amount,
        jodi_amount,
        tp_amount },
      index,
    ) => (

      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt,'customer_id', index)}
            value={customer_id}
            name="customer_id"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>  <TextField
          type="text"
          onChange={(evnt) => handleChange(evnt, 'name',index)}
          value={name}
          name="name"
          readOnly
        /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt,'amount', index)}
            value={amount}
            name="amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt, 'pana_amount', index)}
            value={pana_amount}
            name="pana_amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt,'khula_amount', index)}
            value={khula_amount}
            name="khula_amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt, 'sp_amount', index)}
            value={sp_amount}
            name="sp_amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt,  'dp_amount', index)}
            value={dp_amount}
            name="dp_amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt,'jodi_amount', index)}
            value={jodi_amount}
            name="jodi_amount"
          /></IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="text"
            onChange={(evnt) => handleChange(evnt, 'tp_amount',index)}
            value={tp_amount}
            name="tp_amount"
          /></IndexTable.Cell>

      </IndexTable.Row>

    ),
  );


  return (
    <>
      <Page fullWidth
        title="Entry/Edit"
        primaryAction={{ content: 'View Customer', icon: PlusMinor, onAction: () => modalOpen() }}>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 8, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <ButtonGroup segmented>
              <Button
                pressed={activeButtonIndex === 0}
                onClick={() => onChangesetTimeZone("TO", 0)}
              >
                TO
              </Button>
              <Button
                pressed={activeButtonIndex === 1}
                onClick={() => onChangesetTimeZone("TK", 1)}
              >
                TK
              </Button>
              <Button
                pressed={activeButtonIndex === 2}
                onClick={() => onChangesetTimeZone("MO", 2)}
              >
                MO
              </Button>
              <Button
                pressed={activeButtonIndex === 3}
                onClick={() => onChangesetTimeZone("KO", 3)}
              >
                KO
              </Button>
              <Button
                pressed={activeButtonIndex === 4}
                onClick={() => onChangesetTimeZone("MK", 4)}
              >
                MK
              </Button>
              <Button
                pressed={activeButtonIndex === 5}
                onClick={() => onChangesetTimeZone("KK", 5)}
              >
                KK
              </Button>
              <Button
                pressed={activeButtonIndex === 6}
                onClick={() => onChangesetTimeZone("A1", 6)}
              >
                A1
              </Button>
              <Button
                pressed={activeButtonIndex === 7}
                onClick={() => onChangesetTimeZone("MO2", 7)}
              >
                MO2
              </Button>
              <Button
                pressed={activeButtonIndex === 8}
                onClick={() => onChangesetTimeZone("BO", 8)}
              >
                BO
              </Button>

              <Button
                pressed={activeButtonIndex === 9}
                onClick={() => onChangesetTimeZone("MK2", 9)}
              >
                MK2
              </Button>

              <Button
                pressed={activeButtonIndex === 10}
                onClick={() => onChangesetTimeZone("BK", 10)}
              >
                BK
              </Button>
              <Button
                pressed={activeButtonIndex === 11}
                onClick={() => onChangesetTimeZone("A2", 11)}
              >
                A2
              </Button>
            </ButtonGroup>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <TextField
                  type="date"
                  value={date}
                  onChange={(e) => dateChange(e)}

                />
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                <ButtonGroup>
                  <Button
                    className={tabActive == "entry" ? "active" : ""}
                    onClick={() => newEntry("entry")}
                  >
                    Entry
                  </Button>
                  <Button primary className={tabActive == "edit" ? "active" : ""}
                    onClick={() => editEntry("edit")}>  Edit</Button>
                </ButtonGroup>

              </Grid.Cell>
            </Grid>
          </Grid.Cell>
        </Grid>

    

                {/* <div className="left-wrap">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => dateChange(e)}
                />
                <div className="btn-wrap">
                  <button
                    className={tabActive == "entry" ? "active" : ""}
                    onClick={() => newEntry("entry")}
                  >
                    Entry
                  </button>
                  <button
                    className={tabActive == "edit" ? "active" : ""}
                    onClick={() => editEntry("edit")}
                  >
                    Edit
                  </button>
                </div>
                <div className="action-wrap">
                  <button onClick={saveEntries}>Save</button>
                  <button onClick={cancel}>Cancel</button>
                </div>
              </div> */}
             
                    {timezone != "" && tabActive != "" ? (
                      <>
                          <LegacyCard>
          <IndexTable
            resourceName={resourceNameInput}
            itemCount={inputFields.length}
            headings={[
              { title: 'CID' },
              { title: 'Name' },
              { title: 'Amount' },
              { title: 'Pana_amount' },
              { title: 'Khula_amount' },
              { title: 'SP_amount'},
              { title: 'DP_amount'},
              { title: 'JODI_amount'},
              { title: 'TP_amount'},
            ]}
            selectable={false}
          >
            {tableEdit}
          </IndexTable>
        </LegacyCard>
                      
                          {timezone != "" && tabActive != "" && tabActive == "entry" ? (
                            <Button
                             primary
                              onClick={()=>addInputField()}
                            >
                              Add New
                            </Button>
                          ) : (
                            ""
                          )}
                       
                      </>
                    ) : (
                      ""
                    )}
             
                  
                    <ButtonGroup>
                  <Button
                    className={tabActive == "entry" ? "active" : ""}
                    onClick={()=>saveEntries()}
                  >
                    Save
                  </Button>
                  <Button primary
                  >  Cancel</Button>
                </ButtonGroup>
              
        
            {/* View customer popup */}
            <Modal
              // activator={activator}
              open={isVisible}
              onClose={() => modalOpen()}
              title="Customers"
              secondaryActions={[
                {
                  content: 'Cancel',
                  onAction: () => modalOpen(),
                },
              ]}
            >
              <Modal.Section>

                <LegacyCard>
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={customers.length}
                    headings={[
                      { title: 'CID' },
                      { title: 'Name' },
                      { title: 'Set' },
                    ]}
                    selectable={false}
                  >
                    {rowMarkup}
                  </IndexTable>
                </LegacyCard>


              </Modal.Section>
            </Modal>
        
      </Page>
    </>
  );
}
