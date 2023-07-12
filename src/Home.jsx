import { React, useContext, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import {
  Button,
  Card,
  Form,
  Grid,
  Modal,
  Page,
  Select,
  Text,
  TextField,
} from "@shopify/polaris";
import { MyContext } from "./App";
import { PlusMinor } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { message, setMessage } = useContext(MyContext);
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState({
    cid: false,
    name: false,
    set: false,
  });
  const [setData, updateSetData] = useState([]);
  var [customers, setcustomers] = useState([]);
  var [entries, setEntries] = useState([]);
  const [selectedSet, setSelectedSet] = useState("");
  const [setOptions, updateSetOptions] = useState([]);
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

  const getNotesFromFile = async () => {
    try {
      const myfilesets = await readTextFile("set.json", {
        dir: BaseDirectory.Resource,
      });
      const mysetData = JSON.parse(myfilesets);
      let optionsSet = [{ label: "Select set", value: "" }];
      updateSetData(mysetData);
      mysetData.map((data) => {
        optionsSet.push({ label: data.set, value: data.set })
      })
      updateSetOptions(optionsSet);
    } catch (error) {
      // await writeTextFile(
      //   { path: "set.json", contents: JSON.stringify(setData) },
      //   { dir: BaseDirectory.Resource }
      // );
      console.log(error);
    }

    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycustomers = JSON.parse(myfiledata);
      setcustomers(mycustomers);
    } catch (error) {
      // await writeTextFile(
      //   { path: "customers.json", contents: JSON.stringify(customers) },
      //   { dir: BaseDirectory.Resource }
      // );
      console.log(error);
    }
    try {
      const myfileentries = await readTextFile("entries.json", {
        dir: BaseDirectory.Resource,
      });
      const entry = JSON.parse(myfileentries);
      setEntries(entry);
    } catch (error) {
      // await writeTextFile(
      //   { path: "entries.json", contents: JSON.stringify(entries) },
      //   { dir: BaseDirectory.Resource }
      // );
      console.log(error);
    }
  };
  useEffect(() => {
    getNotesFromFile();
  }, []);


  const [isVisible, setIsVisible] = useState({ addCustomer: false });
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
  const onChangeSet = async (e) => {
    setSelectedSet(e);
    let validateErr = { ...validationError };
    if (e != "") {
      validateErr.set = false;
    } else {
      validateErr.set = "Please select set";
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
  const addnewcustomer = async (customers) => {
    setcustomers([...customers]);
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    setMessage("Customer added successfully");
  };
  const submitHandler = (event) => {
    event.preventDefault();
    let validationErr = { ...validationError };

    let isSubmit = true;
    if (!addFormData.customer_id) {
      // validationErr.cid = "Please enter customer ID";
      isSubmit = false;
    } else {
      validationErr.cid = false;
    }
    if (!addFormData.set) {
      // validationErr.set = "Please select set";
      isSubmit = false;
    } else {
      validationErr.set = false;
    }
    if (!addFormData.name) {
      // validationErr.name = "Please enter customer name";
      isSubmit = false;
    } else {
      validationErr.name = false;
    }
    if (isSubmit) {
      addNote();
      navigate("/entry");
      modalOpen("addCustomer");
    }
    setValidationError(validationErr);
  };
  const getTotalBalance = () => {
    let totalBalance = 0;
    var reportList = [];
    for (let index = 0; index < entries.length; index++) {
      var CID = entries[index].customer_id;
      // date loop
      // for (let index = 0; index < datevise.length; index++) {
      //   var vDate = datevise[index];
        // calculations 
        var cdata = customers.filter(
          (item) => item.customer_id === CID
        );
        var newFormData = [];
        newFormData["commission"] = cdata[0] ? cdata[0]["commission"] : "";
        newFormData["dp"] = cdata[0] ? cdata[0]["dp"] : "";
        newFormData["jodi"] = cdata[0] ? cdata[0]["jodi"] : "";
        newFormData["multiple"] = cdata[0] ? cdata[0]["multiple"] : "";
        newFormData["pana"] = cdata[0] ? cdata[0]["pana"] : "";
        newFormData["partnership"] = cdata[0] ? cdata[0]["partnership"] : "";
        newFormData["set"] = cdata[0] ? cdata[0]["set"] : "";
        newFormData["tp"] = cdata[0] ? cdata[0]["tp"] : "";
        newFormData["sp"] = cdata[0] ? cdata[0]["sp"] : "";
        //
        // var startDate = new Date(vDate + " 00:00:01");
        // var endDate = new Date(vDate + " 23:59:59");
        var getData = entries.filter(function (a) {
          var aDate = new Date(a.date);
          return (
             a.customer_id == CID
          );
        });
  
        if (getData.length) {
          const result = getData.reduce((acc, { timezone, amount, dp_amount, jodi_amount, khula_amount, pana_amount, sp_amount, tp_amount }) => ({
            ...acc,
            [timezone]: {
              timezone,
              amount: acc[timezone] ? (Number(amount) ? Number(acc[timezone].amount) + Number(amount) : (amount)) : (Number(amount) ? Number(amount) : amount),
              dp_amount: acc[timezone] ? (Number(dp_amount) ? Number(acc[timezone].dp_amount) + Number(dp_amount) : (dp_amount)) : (Number(dp_amount) ? Number(dp_amount) : dp_amount),
              jodi_amount: acc[timezone] ? (Number(jodi_amount) ? Number(acc[timezone].jodi_amount) + Number(jodi_amount) : (jodi_amount)) : (Number(jodi_amount) ? Number(jodi_amount) : jodi_amount),
              khula_amount: acc[timezone] ? (Number(khula_amount) ? Number(acc[timezone].khula_amount) + Number(khula_amount) : (khula_amount)) : (Number(khula_amount) ? Number(khula_amount) : khula_amount),
              pana_amount: acc[timezone] ? (Number(pana_amount) ? Number(acc[timezone].pana_amount) + Number(pana_amount) : (pana_amount)) : (Number(pana_amount) ? Number(pana_amount) : pana_amount),
              sp_amount: acc[timezone] ? (Number(sp_amount) ? Number(acc[timezone].sp_amount) + Number(sp_amount) : (sp_amount)) : (Number(sp_amount) ? Number(sp_amount) : sp_amount),
              tp_amount: acc[timezone] ? (Number(tp_amount) ? Number(acc[timezone].tp_amount) + Number(tp_amount) : (tp_amount)) : (Number(tp_amount) ? Number(tp_amount) : tp_amount),
            }
          }),
            {});
  
          var totalDayData = [];
          var first_arr = ['TO', 'TK', 'MO', 'KO', 'MK', 'KK', 'A1'];
          // total 1 calculate
          for (let index = 0; index < first_arr.length; index++) {
            var zone = first_arr[index];
            totalDayData['amount'] = totalDayData['amount'] ? (result[zone] ? totalDayData['amount'] + Number(result[zone].amount) : totalDayData['amount']) : result[zone] ? Number(result[zone].amount) : 0;
            totalDayData['pana_amount'] = totalDayData['pana_amount'] ? (result[zone] ? totalDayData['pana_amount'] + Number(result[zone].pana_amount) : totalDayData['pana_amount']) : result[zone] ? Number(result[zone].pana_amount) : 0;
            totalDayData['khula_amount'] = totalDayData['khula_amount'] ? (result[zone] ? totalDayData['khula_amount'] + Number(result[zone].khula_amount) : totalDayData['khula_amount']) : result[zone] ? Number(result[zone].khula_amount) : 0;
            totalDayData['sp_amount'] = totalDayData['sp_amount'] ? (result[zone] ? totalDayData['sp_amount'] + Number(result[zone].sp_amount) : totalDayData['sp_amount']) : result[zone] ? Number(result[zone].sp_amount) : 0;
            totalDayData['dp_amount'] = totalDayData['dp_amount'] ? (result[zone] ? totalDayData['dp_amount'] + Number(result[zone].dp_amount) : totalDayData['dp_amount']) : result[zone] ? Number(result[zone].dp_amount) : 0;
            totalDayData['jodi_amount'] = totalDayData['jodi_amount'] ? (result[zone] ? totalDayData['jodi_amount'] + Number(result[zone].jodi_amount) : totalDayData['jodi_amount']) : result[zone] ? Number(result[zone].jodi_amount) : 0;
            totalDayData['tp_amount'] = totalDayData['tp_amount'] ? (result[zone] ? totalDayData['tp_amount'] + Number(result[zone].tp_amount) : totalDayData['tp_amount']) : result[zone] ? Number(result[zone].tp_amount) : 0;
          }
          var totalNightData = [];
          var second_arr = ['MO2', 'BO', 'MK2', 'BK', 'A2'];
          // total 2 calculate
          for (let index = 0; index < second_arr.length; index++) {
            var zone = second_arr[index];
            totalNightData['amount'] = totalNightData['amount'] ? (result[zone] ? totalNightData['amount'] + Number(result[zone].amount) : totalNightData['amount']) : result[zone] ? Number(result[zone].amount) : 0;
            totalNightData['pana_amount'] = totalNightData['pana_amount'] ? (result[zone] ? totalNightData['pana_amount'] + Number(result[zone].pana_amount) : totalNightData['pana_amount']) : result[zone] ? Number(result[zone].pana_amount) : 0;
            totalNightData['khula_amount'] = totalNightData['khula_amount'] ? (result[zone] ? totalNightData['khula_amount'] + Number(result[zone].khula_amount) : totalNightData['khula_amount']) : result[zone] ? Number(result[zone].khula_amount) : 0;
            totalNightData['sp_amount'] = totalNightData['sp_amount'] ? (result[zone] ? totalNightData['sp_amount'] + Number(result[zone].sp_amount) : totalNightData['sp_amount']) : result[zone] ? Number(result[zone].sp_amount) : 0;
            totalNightData['dp_amount'] = totalNightData['dp_amount'] ? (result[zone] ? totalNightData['dp_amount'] + Number(result[zone].dp_amount) : totalNightData['dp_amount']) : result[zone] ? Number(result[zone].dp_amount) : 0;
            totalNightData['jodi_amount'] = totalNightData['jodi_amount'] ? (result[zone] ? totalNightData['jodi_amount'] + Number(result[zone].jodi_amount) : totalNightData['jodi_amount']) : result[zone] ? Number(result[zone].jodi_amount) : 0;
            totalNightData['tp_amount'] = totalNightData['tp_amount'] ? (result[zone] ? totalNightData['tp_amount'] + Number(result[zone].tp_amount) : totalNightData['tp_amount']) : result[zone] ? Number(result[zone].tp_amount) : 0;
          }
          // hidden calculation
          var winning_amount = 0;
          winning_amount += (totalDayData['khula_amount'] + totalNightData['khula_amount']) * newFormData['multiple'];
          winning_amount += (totalDayData['sp_amount'] + totalNightData['sp_amount']) * newFormData['sp'];
          winning_amount += (totalDayData['dp_amount'] + totalNightData['dp_amount']) * newFormData['dp'];
          winning_amount += (totalDayData['jodi_amount'] + totalNightData['jodi_amount']) * newFormData['jodi'];
          winning_amount += (totalDayData['tp_amount'] + totalNightData['tp_amount']) * newFormData['tp'];
          var amount_commision = (((totalDayData['amount'] + totalNightData['amount']) * newFormData['commission']) / 100);
          var pana_commision = (((totalDayData['pana_amount'] + totalNightData['pana_amount']) * newFormData['pana']) / 100);
          var sec_sub_total = winning_amount + pana_commision + amount_commision;
          var SUB_TOTAL = sec_sub_total - (totalDayData['amount'] + totalNightData['amount']) - (totalDayData['pana_amount'] + totalNightData['pana_amount']);
          var partnership_percent = SUB_TOTAL * newFormData['partnership'] / 100;
          var TOTAL = SUB_TOTAL - partnership_percent;
          totalBalance+=TOTAL;
        } // length condition
  
      // } // date loop end
    } // customer id loop end
  return totalBalance.toFixed(2).toLocaleString("en-IN");
  }
  return (
    <>
      <Page
        title="Dashboard"
        primaryAction={{
          content: "New Customer",
          icon: PlusMinor,
          onAction: () => modalOpen("addCustomer"),
        }}
      >
        <Grid>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <Card>
              <Text variant="headingMd" as="h3">Total Balance</Text>
              <p style={{marginTop:'15px'}}>₹ {getTotalBalance()}</p>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <Card>
              <Text variant="headingMd" as="h3">Total Customer</Text>
              <p style={{marginTop:'15px'}}>{customers.length }</p>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 4, sm: 4, md: 4, lg: 4, xl: 4 }}>
            <Card>
              <Text variant="headingMd" as="h3">Total Set</Text>
              <p style={{marginTop:'15px'}}>{setData.length}</p>
            </Card>
          </Grid.Cell>
        </Grid>
        {/* Add customer popup */}
        <Modal
          // activator={activator}
          open={isVisible.addCustomer}
          onClose={() => modalOpen("addCustomer")}
          title="Add New Customer"
          primaryAction={{
            content: "Add Customer",
            onAction: () => document.getElementById("addCustBtn").click(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("addCustomer"),
            },
          ]}
        >
          <Modal.Section>
            <Form onSubmit={submitHandler}>
              <Grid>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <div className="row">
                    <div className="col">
                      <TextField
                        label="Customer ID"
                        type="number"
                        name="customer_id"
                        placeholder="Enter customer ID"
                        value={addFormData.customer_id}
                        error={validationError.cid}
                        requiredIndicator={true}
                        onChange={(e) => addFormHandler(e, "customer_id")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Customer Name"
                        type="text"
                        name="name"
                        placeholder="Enter customer name"
                        value={addFormData.name}
                        error={validationError.name}
                        requiredIndicator={true}
                        onChange={(e) => addFormHandler(e, "name")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Mobile Number 1"
                        type="number"
                        step="any"
                        name="mobile1"
                        placeholder="Enter mobile number"
                        value={addFormData.mobile1}
                        onChange={(e) => addFormHandler(e, "mobile1")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Mobile Number 2"
                        type="number"
                        step="any"
                        name="mobile2"
                        placeholder="Enter mobile number"
                        value={addFormData.mobile2}
                        onChange={(e) => addFormHandler(e, "mobile2")}
                      />
                    </div>
                    <div className="col">
                      <TextField
                        label="Address"
                        name="address"
                        placeholder="Enter customer address"
                        value={addFormData.address}
                        onChange={(e) => addFormHandler(e, "address")}
                        multiline={4}
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
                        error={validationError.set}
                        id="set"
                        options={setOptions}
                        value={selectedSet}
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
              <Button id="addCustBtn" submit>
                Submit
              </Button>
            </Form>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}
