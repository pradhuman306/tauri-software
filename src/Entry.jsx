import { React, useContext, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import {
  Modal,
  Button,
  TextField,
  Page,
  LegacyCard,
  ButtonGroup,
  DataTable,
  Card,
  Text,
} from "@shopify/polaris";
import { PlusMinor } from "@shopify/polaris-icons";
import { MyContext } from "./App";

export default function Entry() {
  document.onkeydown = keydown;
    function onArrowpress(e){
        const inputs = document.querySelectorAll("input[type='text']");
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].addEventListener("keydown", function (event) {
            if (event.keyCode === 39) {
            event.preventDefault();
              console.log('aroow next');
              const nextIndex = i + 1;
              if (nextIndex < inputs.length) {
                inputs[nextIndex].focus();
              } 
            }
            if(event.keyCode === 40){
            event.preventDefault();
            console.log('aroow down');
              const nextIndex = i +9;
              if (nextIndex < inputs.length) {
                inputs[nextIndex].focus();
              }
            }
            if(event.keyCode === 38){
            event.preventDefault();
            console.log('aroow up');
              const nextIndex = i -9;
              if (nextIndex < inputs.length) {
                inputs[nextIndex].focus();
              }
            }
            if (event.keyCode === 37) {
            event.preventDefault();
            console.log('aroow pre');
              const nextIndex = i -1;
              if (nextIndex < inputs.length) {
                inputs[nextIndex].focus();
              }
            }
          });
        }
    }

  const { setErrorMessage, setMessage } = useContext(MyContext);
  const [customers, setcustomers] = useState([]);
  var [entries, setentries] = useState([]);
  const todaydate = new Date();
  const [date, setDate] = useState("");
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
        // await writeTextFile(
        //   { path: "customers.json", contents: JSON.stringify(customers) },
        //   { dir: BaseDirectory.Resource }
        // );
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
        // await writeTextFile(
        //   { path: "entries.json", contents: JSON.stringify(entries) },
        //   { dir: BaseDirectory.Resource }
        // );
        console.log(error);
      }
    };
    getdataFromFile();
    let day = todaydate.getDate();
    let month = todaydate.getMonth() + 1;
    let year = todaydate.getFullYear();
    if (month.toString().length <= 1) {
      month = '0' + month;
    }
    if (day.toString().length <= 1) {
      day = '0' + day;
    }
    setDate(year + '-' + month + '-' + day);
  }, []);

  const [tabActive, setTabActive] = useState("");


  const dateChange = async (value) => {
    setDate(value);
    setTabActive("");
  };

  const [timezone, setTimeZone] = useState("TO");
  const [inputFields, setInputFields] = useState([]);

  const handleChange = (value, name, index) => {
    const list = [...inputFields];
    list[index][name] = value;
    if (name == "customer_id") {
      const cdata = customers.filter((item) => item.customer_id === value);
      list[index]["name"] = cdata && cdata[0] ? cdata[0]["name"] : "";
      if (cdata && cdata[0]) {
        if (cdata[0].pana != 0 && cdata[0].pana != "" && cdata[0].pana != null) {
          list[index]['isDisabled'] = false;
        } else {
          list[index]['isDisabled'] = true;
        }
      }
    }
    list[index]["timezone"] = timezone;
    setInputFields(list);
  };
  const handleBlur = (e, name, index) => {
    let value = e.target.value;
    if (tabActive != "edit") {
      if (name == "customer_id") {
        if (value != '') {
          setTimeout(() => {
            addInputField();
          }, 500);
        } else {
          setTimeout(() => {
            if (inputFields.length > 1) {
              inputFields.pop();
              setInputFields(inputFields)
            }

          }, 500);

        }
      }
    }

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
      setMessage("Entry updated successfully");
    } else {
      let tmp = inputFields.filter((item) => item.customer_id != "");
      if (tmp.length) {
        setentries([...entries, ...tmp]);
        await writeTextFile(
          {
            path: "entries.json",
            contents: JSON.stringify([...entries, ...tmp]),
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
        setMessage("Entry saved successfully");
        onChangesetTimeZone("TO", 0);
        setTabActive("");
      } else {
        setErrorMessage("Please enter cid");
      }
    }
  };

  const newEntry = async (v) => {
    if (date == "") {
      setErrorMessage("Please select date");
    } else {
      setTabActive(v);
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
    if (date == "" && timezone == "") {
      setErrorMessage("Please select time and date");
    } else if (date == "") {
      setErrorMessage("Please select date");
    } else if (timezone == "") {
      setErrorMessage("Please select time");
    } else {
      setTabActive(v);
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
    onChangesetTimeZone("TO", 0);
    setTabActive("");
    setDate("");
  };

  function keydown(evt) {
    if (!evt) evt = event;
    if (evt.keyCode == 115 && timezone != "" && tabActive != "") {
      saveEntries();
    }
    onArrowpress();
  }

  const rowsTable = [];
  inputFields.map((inFields, index) => {
    let newArray = [];
    newArray.push(
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "customer_id", index)}
        onBlur={(evnt) => handleBlur(evnt, "customer_id", index)}
        value={inFields.customer_id}
        name="customer_id"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "name", index)}
        value={inFields.name}
        name="name"
        readOnly
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "amount", index)}
        value={inFields.amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "pana_amount", index)}
        value={inFields.pana_amount}
        disabled={inFields.customer_id&& inFields.name!=''?inFields.isDisabled:true}
        name="pana_amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "khula_amount", index)}
        value={inFields.khula_amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="khula_amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "sp_amount", index)}
        value={inFields.sp_amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="sp_amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "dp_amount", index)}
        value={inFields.dp_amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="dp_amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "jodi_amount", index)}
        value={inFields.jodi_amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="jodi_amount"
      />,
      <TextField
        type="text"
        autoComplete="off"
        onChange={(evnt) => handleChange(evnt, "tp_amount", index)}
        value={inFields.tp_amount}
        disabled={inFields.customer_id && inFields.name!=''?false:true}
        name="tp_amount"
      />
    );
    rowsTable.push(newArray);
  
  });

  let totalArray = [];
  totalArray.push(
    <span><b>Total Row {inputFields.length}</b></span>,
    <span></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.pana_amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.khula_amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.sp_amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.dp_amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.jodi_amount),0)))}</b></span>,
    <span><b>{Number((inputFields.reduce((a,v) =>  a = a + Number(v.tp_amount),0)))}</b></span>,
  );
  rowsTable.push(totalArray);

  const rowsCustomer = [];
  customers.map((customer, index) => {
    let newArray = [];
    newArray.push(customer.customer_id, customer.name, customer.set);
    rowsCustomer.push(newArray);
  });
  return (
    <div>
      <Page
        fullWidth
        title="Entry/Edit"
        primaryAction={{
          content: "View Customer",
          icon: PlusMinor,
          onAction: () => modalOpen(),
        }}
      >
        {/* View customer popup */}
        <Modal
          // activator={activator}
          open={isVisible}
          onClose={() => modalOpen()}
          title="Customers"
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen(),
            },
          ]}
        >
          <Modal.Section>
            <LegacyCard>
              <DataTable
                columnContentTypes={["text", "text", "text"]}
                headings={["Cid", "Name", "Set"]}
                rows={rowsCustomer}
                hasZebraStripingOnData
                increasedTableDensity
                defaultSortDirection="descending"
              />
            </LegacyCard>
          </Modal.Section>
        </Modal>
      </Page>
      <div className="contentWrapper customTd">
        <Page
          fullWidth
          title={
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
          }
          primaryAction={
            <ButtonGroup>
<Text>Date</Text>
            
                <TextField
                  type="date"
                  // label="Select Date"
                  value={date}
                  onChange={(e) => dateChange(e)}
                />
             

              <Button
                className={tabActive == "entry" ? "active" : ""}
                onClick={() => newEntry("entry")}
              >
                Entry
              </Button>
              <Button
                primary
                className={tabActive == "edit" ? "active" : ""}
                onClick={() => editEntry("edit")}
              >
                {" "}
                Edit
              </Button>
            </ButtonGroup>
          }
        >
          {timezone != "" && tabActive != "" && inputFields.length ? (
            <>
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
                  ]}
                  headings={[
                    "CID",
                    "Name",
                    "Amount",
                    "Pana Amount",
                    "Khula Amount",
                    "SP Amount",
                    "DP Amount",
                    "JODI Amount",
                    "TP Amount",
                  ]}
                  rows={rowsTable}
                  hasZebraStripingOnData
                  increasedTableDensity
                  defaultSortDirection="descending"
                />
              </LegacyCard>
              {timezone != "" && tabActive != "" && tabActive == "entry" ? (
                <div style={{ marginTop: '15px' }}>
                  <Button primary onClick={() => addInputField()}>
                    Add Row
                  </Button>
                </div>
              ) : (
                ""
              )}
            </>
          ) : (
            <Card>
              <Text alignment="center" variant="headingMd" as="h3">No data available</Text>
            </Card>
          )}
        </Page>
      </div>
      {timezone != "" && tabActive != "" && inputFields.length ? (
        <>
          <div className="bottomBar">
            <ButtonGroup>
              <Button onClick={() => cancel()}>
                {" "}
                Cancel
              </Button>
              {inputFields.length ? (
                <Button primary
                  className={tabActive == "entry" ? "active" : ""}
                  onClick={() => saveEntries()}
                >
                  Save
                </Button>
              ) : (
                ""
              )}
            </ButtonGroup>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
