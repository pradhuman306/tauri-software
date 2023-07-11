import { React, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Grid, Page, TextField, Select, LegacyCard, Button, DataTable } from "@shopify/polaris";

export default function Calculater() {
  const [customers, setcustomers] = useState([]);
  const [customersOptions, setcustomersOptions] = useState([]);
  const [entries, setentries] = useState([]);
  const params = useParams();
  const date = new Date();
  const nav = useNavigate();
  useEffect(() => {
    const getNotesFromFile = async () => {
      try {
        const myfiledata = await readTextFile("customers.json", {
          dir: BaseDirectory.Resource,
        });
        const mycust = JSON.parse(myfiledata);
        setcustomers(mycust);
        let custOpt = [{ label: "Select Customer", value: "" }];
        mycust.map((data) => {
          custOpt.push({ label: data.name, value: data.customer_id });
        })
        setcustomersOptions(custOpt);
      } catch (error) {
        await writeTextFile(
          { path: "customers.json", contents: JSON.stringify(customers) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }
      try {
        const myfileNotes = await readTextFile("entries.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustomers = JSON.parse(myfileNotes);
        setentries(mycustomers);
      } catch (error) {
        await writeTextFile(
          { path: "entries.json", contents: JSON.stringify(entries) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }
    };
    getNotesFromFile();

  }, []);
  useEffect(() => {
    if (params.cid != 'default') {
      onChangeSet(params.cid);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      if (month.toString().length <= 1) {
        month = '0' + month;
      }
      if (day.toString().length <= 1) {
        day = '0' + day;
      }
      setDate(year + '-' + month + '-' + day);

    }

  }, [customers, params])


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

  const [selectedCId, setCID] = useState("");
  const [selectedDate, setDate] = useState("");
  const [timeZoneAll, setTimeZoneAll] = useState(['TO', 'TK', 'MO', 'KO', 'MK', 'KK', 'A1', 'Total-1', 'MO', 'BO', 'MK', 'BK', 'A2', 'Total-2', 'Final Total']);
  const [amountDetails, setAmountDetails] = useState(['amount', 'pana_amount', 'khula_amount', 'sp_amount', 'dp_amount', 'jodi_amount', 'tp_amount']);

  const [DayData, setDayData] = useState({
    amount: 0,
    khula_amount: 0,
    pana_amount: 0,
    sp_amount: 0,
    dp_amount: 0,
    jodi_amount: 0,
    tp_amount: 0,
  });
  const [NightData, setNightData] = useState({
    amount: 0,
    khula_amount: 0,
    pana_amount: 0,
    sp_amount: 0,
    dp_amount: 0,
    jodi_amount: 0,
    tp_amount: 0,
  });

  const onChangeSet = (value) => {
    console.log(value);
    const cdata = customers.filter(
      (item) => item.customer_id === value
    );
    setCID(value);
    console.log('cdata', cdata);
    const newFormData = { ...addFormData };
    newFormData["customer_id"] = value;
    newFormData["commission"] = cdata[0] ? cdata[0]["commission"] : "";
    newFormData["dp"] = cdata[0] ? cdata[0]["dp"] : "";
    newFormData["jodi"] = cdata[0] ? cdata[0]["jodi"] : "";
    newFormData["multiple"] = cdata[0] ? cdata[0]["multiple"] : "";
    newFormData["pana"] = cdata[0] ? cdata[0]["pana"] : "";
    newFormData["partnership"] = cdata[0] ? cdata[0]["partnership"] : "";
    newFormData["set"] = cdata[0] ? cdata[0]["set"] : "";
    newFormData["tp"] = cdata[0] ? cdata[0]["tp"] : "";
    newFormData["sp"] = cdata[0] ? cdata[0]["sp"] : "";
    setAddFormData(newFormData);
    calculations(value, selectedDate);
  };

  const inputHandler = (value, param) => {
    if (param == 'date') {
      setDate(value);
      calculations(selectedCId, value);
    }
  };
  const [displayData, setDisplayData] = useState([]);
  const [mainTotal, setMainTotal] = useState(0);

  const calculations = (id, date) => {
    if (id == "" || date == "") {
      return;
    }
    var startDate = new Date(date + " 00:00:01");
    var endDate = new Date(date + " 23:59:59");
    const filteredData = entries.filter(function (a) {
      var aDate = new Date(a.date);
      return (
        aDate >= startDate && aDate <= endDate && a.customer_id == id
      );
    });
    console.log('reduce ', filteredData);

    const result = filteredData.reduce((acc, { timezone, amount, dp_amount, jodi_amount, khula_amount, pana_amount, sp_amount, tp_amount }) => ({
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
    setDayData(totalDayData);
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
    setNightData(totalNightData);
    setDisplayData(result);
    // hidden calculation
    var winning_amount = 0;
    winning_amount += (totalDayData['khula_amount'] + totalNightData['khula_amount']) * addFormData.multiple;
    winning_amount += (totalDayData['sp_amount'] + totalNightData['sp_amount']) * addFormData.sp;
    winning_amount += (totalDayData['dp_amount'] + totalNightData['dp_amount']) * addFormData.dp;
    winning_amount += (totalDayData['jodi_amount'] + totalNightData['jodi_amount']) * addFormData.jodi;
    winning_amount += (totalDayData['tp_amount'] + totalNightData['tp_amount']) * addFormData.tp;
    var amount_commision = (((totalDayData['amount'] + totalNightData['amount']) * addFormData.commission) / 100);
    var pana_commision = (((totalDayData['pana_amount'] + totalNightData['pana_amount']) * addFormData.pana) / 100);
    var sec_sub_total = winning_amount + pana_commision + amount_commision;
    var SUB_TOTAL = sec_sub_total - (totalDayData['amount'] + totalNightData['amount']) - (totalDayData['pana_amount'] + totalNightData['pana_amount']);
    var partnership_percent = SUB_TOTAL * addFormData.partnership / 100;
    var TOTAL = SUB_TOTAL - partnership_percent;

    if (TOTAL) {
      TOTAL = TOTAL.toFixed(2);
      if ((totalDayData['amount'] + totalNightData['amount']) > TOTAL) {
        TOTAL = Math.abs(TOTAL) + ' Dr.';
      } else {
        TOTAL = Math.abs(TOTAL) + ' Cr.';
      }
    }

    setMainTotal(TOTAL);
  };


  const close = () => {
    onChangeSet(0);
    setDayData({
      amount: 0,
      khula_amount: 0,
      pana_amount: 0,
      sp_amount: 0,
      dp_amount: 0,
      jodi_amount: 0,
      tp_amount: 0,
    });
    setNightData({
      amount: 0,
      khula_amount: 0,
      pana_amount: 0,
      sp_amount: 0,
      dp_amount: 0,
      jodi_amount: 0,
      tp_amount: 0,
    });
    setDisplayData([]);
    setMainTotal(0);
    setDate(0);
  }
  useEffect(() => {
    calculations(selectedCId, selectedDate);
  }, [addFormData]);


  // const resourceName = {
  //   singular: 'timeZoneAll',
  //   plural: 'timeZoneAlls',
  // };
  // const rowMarkup = timeZoneAll.map(
  //   (
  //     zone,
  //     index,
  //   ) => (

  //     <IndexTable.Row id={index} key={index} position={index}>
  //       <IndexTable.Cell>{zone}</IndexTable.Cell>
  //       {zone === 'Total Amount' ? <IndexTable.Cell> <TextField type="text" step="any" value={mainTotal} readOnly /></IndexTable.Cell> : ""}

  //       {zone != 'Total Amount' && amountDetails.map((amountKey) => (
  //         <IndexTable.Cell>
  //           {zone === 'Total-1' ? <TextField type="text" name={`${'total1'}[${amountKey}]`} value={DayData ? DayData[amountKey] : ''} readOnly /> : zone === 'Total-2' ? <TextField type="text" name={`${'total2'}[${amountKey}]`} value={NightData ? NightData[amountKey] : ''} readOnly /> : zone === 'Final Total' ? <TextField type="text" name={`${'final'}[${amountKey}]`} value={NightData[amountKey] + DayData[amountKey]} readOnly /> : <TextField type="text" name={`${zone}[${amountKey}]`} value={displayData[zone] ? displayData[zone][amountKey] : ''} readOnly />}

  //         </IndexTable.Cell>

  //       ))}


  //     </IndexTable.Row>

  //   ),
  // );

  const rows = [];

  timeZoneAll.map((zone, index) => {
    let newArray = [];
    newArray.push(zone);
    // if (zone === 'Total Amount') {
    //   newArray.push(<TextField type="text" step="any" value={mainTotal} readOnly />);
    // }
    if (zone != 'Total Amount') {
      amountDetails.map((amountKey) => {
        if (zone === 'Total-1') {
          newArray.push(<TextField type="text" name={`${'total1'}[${amountKey}]`} value={DayData ? DayData[amountKey] : ''} readOnly />);
        }
        else if (zone === 'Total-2') {
          newArray.push(<TextField type="text" name={`${'total2'}[${amountKey}]`} value={NightData ? NightData[amountKey] : ''} readOnly />);
        }
        else if(zone === 'Final Total'){
          newArray.push(<TextField type="text" name={`${'final'}[${amountKey}]`} value={NightData[amountKey] + DayData[amountKey]} readOnly />);
        }else {
          newArray.push(<TextField type="text" name={`${zone}[${amountKey}]`} value={displayData[zone] ? displayData[zone][amountKey] : ''} readOnly />);
        }
   
      })
    }
    rows.push(newArray);
  })



  return (
    <>
      <div className="customerHeader">
        <Page
          fullWidth
          className="customerHeader"
          title={
            <div className="row">
              <div className="col subHeader">
                <Select
                  label="Customer Name"
                  name="name"
                  id="name"
                  options={customersOptions}
                  value={selectedCId}
                  onChange={(e) => onChangeSet(e)}
                />
              </div>
            </div>
          }
          primaryAction={
            <div className="row">
              <div className="col inline-field">
                <TextField
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => inputHandler(e, 'date')}
                />
              </div>
            </div>
          }
        >
        </Page>
      </div>
      <div className="contentWrapper">
      <Page fullWidth>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
            <Card>
              <div className="row">
                <div className="col">
                  <TextField label="Set" type="number" step="any" name="set" value={addFormData.set} readOnly />
                </div>
                <div className="col">
                  <TextField label="Commission" type="number" step="any" name="commission" value={addFormData.commission} readOnly />
                </div>
                <div className="col">
                  <TextField label="Multiple" type="number" step="any" name="multiple" value={addFormData.multiple} readOnly />
                </div>
                <div className="col">
                  <TextField label="SP" type="number" step="any" name="sp" value={addFormData.sp} readOnly />
                </div>
                <div className="col">
                  <TextField label="DP" type="number" step="any" name="dp" value={addFormData.dp} readOnly />
                </div>
                <div className="col">
                  <TextField label="Jodi" type="number" step="any" name="jodi" value={addFormData.jodi} readOnly />
                </div>
                <div className="col">
                  <TextField label="TP" type="number" step="any" name="tp" value={addFormData.tp} readOnly />
                </div>
                <div className="col">
                  <TextField label="Partnership" type="number" step="any" name="partnership" value={addFormData.partnership} readOnly />
                </div>
                <div className="col">
                  <TextField label="Pana" type="number" step="any" name="pana" value={addFormData.pana} readOnly />
                </div>
              </div>
            </Card>
          </Grid.Cell>

          <Grid.Cell columnSpan={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }}>
          <LegacyCard>
          <div className="calculator-table">
          <DataTable
            showTotalsInFooter
            columnContentTypes={[
              'text',
              'text',
              'text',
              'text',
              'text',
              'text',
              'text',
              'text'
            ]}
            headings={[
              '',
              'Amount',
              'Pana-Amount',
              'Kh',
              'SP-Amount',
              'DP-Amount',
              'J-Amount',
              'TP-Amount'
            ]}
            rows={rows}
            totals={['', mainTotal, '', '', '', '', '', '']}
            hasZebraStripingOnData
            increasedTableDensity
            defaultSortDirection="descending"
            totalsName={{
              singular: 'Total Amount',
              plural: 'Total Amount',
            }}
          />
          </div>
        </LegacyCard>
          </Grid.Cell>
        </Grid>
      </Page>
      </div>
      <div className="bottomBar">
      <Button onClick={() => close()} primary>Cancel</Button>
      </div>
    </>
  );
}
