import { React, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { useNavigate, useParams } from "react-router-dom";
import { Card, ButtonGroup, Page, TextField, Select, LegacyCard, Button, DataTable,Modal } from "@shopify/polaris";

export default function Calculater() {
  const [customers, setcustomers] = useState([]);
  const [customersOptions, setcustomersOptions] = useState([]);
  const [entries, setentries] = useState([]);
  const params = useParams();
  const date = new Date();
  const nav = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
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
          custOpt.push({ label: data.name + " (" + data.customer_id + ")", value: data.customer_id });
        })
        setcustomersOptions(custOpt);
      } catch (error) {

        console.log(error);
      }
      try {
        const myfileNotes = await readTextFile("entries.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustomers = JSON.parse(myfileNotes);
        setentries(mycustomers);
      } catch (error) {

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

  const [selectedCId, setCID] = useState("");
  const [selectedDate, setDate] = useState("");
  const [timeZoneAll, setTimeZoneAll] = useState(['TO', 'TK', 'MO', 'KO', 'MK', 'KK', 'Total-1', 'Total Day', 'MO', 'BO', 'MK', 'BK', 'Total-2', 'Total Night', 'Final Total']);
  const [showtimeZoneAll, setTimeZoneAllshow] = useState(['TO', 'TK', 'MO', 'KO', 'MK', 'KK', 'Total-1', 'Total Day', 'MO2', 'BO', 'MK2', 'BK', 'Total-2', 'Total Night', 'Final Total']);
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
    const cdata = customers.filter(
      (item) => item.customer_id === value
    );
    setCID(value);
    const newFormData = { ...addFormData };
    newFormData["customer_id"] = value;
    newFormData["commission"] = cdata[0] ? cdata[0]["commission"] : "";
    newFormData["dp"] = cdata[0] ? cdata[0]["dp"] : "";
    newFormData["jodi"] = cdata[0] ? cdata[0]["jodi"] : "";
    newFormData["multiple"] = cdata[0] ? cdata[0]["multiple"] : "";
    newFormData["pana"] = cdata[0] ? cdata[0]["pana"] : "";
    newFormData["partnership"] = cdata[0] ? cdata[0]["partnership"] : "";
    newFormData["partnership2"] = cdata[0] ? cdata[0]["partnership2"] : "";
    newFormData["set"] = cdata[0] ? cdata[0]["set"] : "";
    newFormData["tp"] = cdata[0] ? cdata[0]["tp"] : "";
    newFormData["sp"] = cdata[0] ? cdata[0]["sp"] : "";
    newFormData["limit"] = cdata[0] ? cdata[0]["limit"] : null;
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
  const [dayTotal, setDayTotal] = useState(0);
  const [nightTotal, setNightTotal] = useState(0);

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
    const result = filteredData.reduce((acc, { timezone, amount, dp_amount, jodi_amount, khula_amount, pana_amount, sp_amount, tp_amount }) => ({
      ...acc,
      [timezone]: {
        timezone,
        amount: acc[timezone] ? (Number(acc[timezone].amount) + Number(amount)) : Number(amount),
        dp_amount: acc[timezone] ? Number(acc[timezone].dp_amount) + Number(dp_amount) : Number(dp_amount),
        jodi_amount: acc[timezone] ? Number(acc[timezone].jodi_amount) + Number(jodi_amount) : Number(jodi_amount),
        khula_amount: acc[timezone] ? Number(acc[timezone].khula_amount) + Number(khula_amount) : Number(khula_amount),
        pana_amount: acc[timezone] ? Number(acc[timezone].pana_amount) + Number(pana_amount) : Number(pana_amount),
        sp_amount: acc[timezone] ? Number(acc[timezone].sp_amount) + Number(sp_amount) : Number(sp_amount),
        tp_amount: acc[timezone] ? Number(acc[timezone].tp_amount) + Number(tp_amount) : Number(tp_amount),
      }
    }),
      {});

    var totalDayData = [];
    totalDayData["amount"] = 0;
    totalDayData["pana_amount"] = 0;
    totalDayData["khula_amount"] = 0;
    totalDayData["sp_amount"] = 0;
    totalDayData["dp_amount"] = 0;
    totalDayData["jodi_amount"] = 0;
    totalDayData["tp_amount"] = 0;
    var first_arr = ["TO", "TK", "MO", "KO", "MK", "KK", "A1"];
    // total 1 calculate
    for (let index = 0; index < first_arr.length; index++) {
      var zone = first_arr[index];
      totalDayData["amount"] = (result[zone] ? totalDayData["amount"] + Number(result[zone].amount) : totalDayData["amount"]);
      totalDayData["pana_amount"] = result[zone] ? totalDayData["pana_amount"] + Number(result[zone].pana_amount) : totalDayData["pana_amount"];
      totalDayData["khula_amount"] = result[zone] ? totalDayData["khula_amount"] + Number(result[zone].khula_amount) : totalDayData["khula_amount"];
      totalDayData["sp_amount"] = result[zone] ? totalDayData["sp_amount"] + Number(result[zone].sp_amount) : totalDayData["sp_amount"];
      totalDayData["dp_amount"] = result[zone] ? totalDayData["dp_amount"] + Number(result[zone].dp_amount) : totalDayData["dp_amount"];
      totalDayData["jodi_amount"] = result[zone] ? totalDayData["jodi_amount"] + Number(result[zone].jodi_amount) : totalDayData["jodi_amount"];
      totalDayData["tp_amount"] = result[zone] ? totalDayData["tp_amount"] + Number(result[zone].tp_amount) : totalDayData["tp_amount"];
    }
    setDayData(totalDayData);
    var totalNightData = [];
    totalNightData["amount"] = 0;
    totalNightData["pana_amount"] = 0;
    totalNightData["khula_amount"] = 0;
    totalNightData["sp_amount"] = 0;
    totalNightData["dp_amount"] = 0;
    totalNightData["jodi_amount"] = 0;
    totalNightData["tp_amount"] = 0;
    var second_arr = ["MO2", "BO", "MK2", "BK", "A2"];
    // total 2 calculate
    for (let index = 0; index < second_arr.length; index++) {
      var zone = second_arr[index];
      totalNightData["amount"] = (result[zone] ? totalNightData["amount"] + Number(result[zone].amount) : totalNightData["amount"]);
      totalNightData["pana_amount"] = result[zone] ? totalNightData["pana_amount"] + Number(result[zone].pana_amount) : totalNightData["pana_amount"];
      totalNightData["khula_amount"] = result[zone] ? totalNightData["khula_amount"] + Number(result[zone].khula_amount) : totalNightData["khula_amount"];
      totalNightData["sp_amount"] = result[zone] ? totalNightData["sp_amount"] + Number(result[zone].sp_amount) : totalNightData["sp_amount"];
      totalNightData["dp_amount"] = result[zone] ? totalNightData["dp_amount"] + Number(result[zone].dp_amount) : totalNightData["dp_amount"];
      totalNightData["jodi_amount"] = result[zone] ? totalNightData["jodi_amount"] + Number(result[zone].jodi_amount) : totalNightData["jodi_amount"];
      totalNightData["tp_amount"] = result[zone] ? totalNightData["tp_amount"] + Number(result[zone].tp_amount) : totalNightData["tp_amount"];
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

    if(addFormData.partnership2 && addFormData.partnership2 != ""){
      var customer2Risk = ((SUB_TOTAL * addFormData.partnership2) / 100);
    }else{
      var customer2Risk = 0;
    }

    var day_winning_amount = 0;
    day_winning_amount += (totalDayData['khula_amount']) * addFormData.multiple;
    day_winning_amount += (totalDayData['sp_amount']) * addFormData.sp;
    day_winning_amount += (totalDayData['dp_amount']) * addFormData.dp;
    day_winning_amount += (totalDayData['jodi_amount']) * addFormData.jodi;
    day_winning_amount += (totalDayData['tp_amount']) * addFormData.tp;
    var day_amount_commision = (((totalDayData['amount']) * addFormData.commission) / 100);
    var day_pana_commision = (((totalDayData['pana_amount']) * addFormData.pana) / 100);
    var day_sec_sub_total = day_winning_amount + day_pana_commision + day_amount_commision;
    var day_SUB_TOTAL = day_sec_sub_total - (totalDayData['amount']) - (totalDayData['pana_amount']);
    var day_partnership_percent = day_SUB_TOTAL * addFormData.partnership / 100;
    var DAY_TOTAL = day_SUB_TOTAL - day_partnership_percent;
    if (DAY_TOTAL) {
      DAY_TOTAL = DAY_TOTAL.toFixed(2);
      if ((totalDayData['amount']) > DAY_TOTAL) {
        DAY_TOTAL = Math.abs(DAY_TOTAL) + ' Dr.';
      } else {
        DAY_TOTAL = Math.abs(DAY_TOTAL) + ' Cr.';
      }
    }
    setDayTotal(DAY_TOTAL);

    var night_winning_amount = 0;
    night_winning_amount += (totalNightData['khula_amount']) * addFormData.multiple;
    night_winning_amount += (totalNightData['sp_amount']) * addFormData.sp;
    night_winning_amount += (totalNightData['dp_amount']) * addFormData.dp;
    night_winning_amount += (totalNightData['jodi_amount']) * addFormData.jodi;
    night_winning_amount += (totalNightData['tp_amount']) * addFormData.tp;
    var night_amount_commision = (((totalNightData['amount']) * addFormData.commission) / 100);
    var night_pana_commision = (((totalNightData['pana_amount']) * addFormData.pana) / 100);
    var night_sec_sub_total = night_winning_amount + night_pana_commision + night_amount_commision;
    var night_SUB_TOTAL = night_sec_sub_total - (totalNightData['amount']) - (totalNightData['pana_amount']);
    var night_partnership_percent = night_SUB_TOTAL * addFormData.partnership / 100;
    var night_TOTAL = night_SUB_TOTAL - night_partnership_percent;
    if (night_TOTAL) {
      night_TOTAL = night_TOTAL.toFixed(2);
      if ((totalNightData['amount']) > night_TOTAL) {
        night_TOTAL = Math.abs(night_TOTAL) + ' Dr.';
      } else {
        night_TOTAL = Math.abs(night_TOTAL) + ' Cr.';
      }
    }
    setNightTotal(night_TOTAL);

    if (TOTAL) {
      if(Number(addFormData.limit) < TOTAL){
        setIsVisible(true);
      }else{
        setIsVisible(false);
      }
      TOTAL = TOTAL.toFixed(2);
      if ((totalDayData['amount'] + totalNightData['amount']) > TOTAL) {
        TOTAL = Math.abs(TOTAL) + ' Dr.';
      } else {
        TOTAL = Math.abs(TOTAL) + ' Cr.';
      }
    }

    setMainTotal(TOTAL);
    document.querySelector("tfoot").className = '';
    document.querySelector("tfoot").classList.add(TOTAL ? TOTAL.includes('Dr') ? 'background-debit' : 'background-credit' : 'background');

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
  }
  useEffect(() => {
    calculations(selectedCId, selectedDate);
  }, [addFormData]);



  const rows = [];

  timeZoneAll.map((zone, index) => {
    let newArray = [];
    newArray.push(zone);
    if (zone != 'Total Amount') {
      amountDetails.map((amountKey) => {
        if (zone === 'Total-1') {
          newArray.push(<TextField type="text" name={`${'total1'}[${amountKey}]`} value={DayData ? DayData[amountKey] : ''} readOnly />);
        }
        else if (zone === 'Total Day') {
          if (newArray.length == 1) {
            newArray.push(<span className={dayTotal ? dayTotal.includes('Dr') ? 'debit' : 'credit' : ''}><TextField type="text" name={`${'total1'}[${amountKey}]`} value={amountKey == 'amount' ? dayTotal : ''} readOnly /></span>);
          } else {
            newArray.push(<span></span>);
          }
        }
        else if (zone === 'Total Night') {
          if (newArray.length == 1) {
            newArray.push(<span className={nightTotal ? nightTotal.includes('Dr') ? 'debit' : 'credit' : ''}><TextField type="text" name={`${'total1'}[${amountKey}]`} value={amountKey == 'amount' ? nightTotal : ''} readOnly /></span>);
          } else {
            newArray.push(<span></span>);
          }
        }
        else if (zone === 'Total-2') {
          newArray.push(<TextField type="text" name={`${'total2'}[${amountKey}]`} value={NightData ? NightData[amountKey] : ''} readOnly />);
        }
        else if (zone === 'Final Total') {
          newArray.push(<TextField type="text" name={`${'final'}[${amountKey}]`} value={NightData[amountKey] + DayData[amountKey]} readOnly />);
        } else {
          let zone2 = showtimeZoneAll[index];
          newArray.push(<TextField type="text" name={`${zone2}[${amountKey}]`} value={displayData[zone2] ? displayData[zone2][amountKey] : ''} readOnly />);
        }

      })
    }
    rows.push(newArray);
  })


  return (
    <>



      <Page
        fullWidth
        title="Calculator"
        primaryAction={
          <ButtonGroup>
            
            <div className="col subHeader">
                <Select
                  label="Customer"
                  name="name"
                  id="name"
                  options={customersOptions}
                  value={selectedCId}
                  onChange={(e) => onChangeSet(e)}
                />
              </div>
              <div className="col subHeader">
                <TextField
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => inputHandler(e, 'date')}
                />
              </div>
          </ButtonGroup>
        }
      >
      </Page>

        <Page fullWidth>
        <div className="row calculator-table">

{/* <TextField label="Set" type="number" step="any" name="set" value={addFormData.set} readOnly /> */}

<TextField label="Partnership" type="number" step="any" name="partnership" value={addFormData.partnership} readOnly />
<TextField label="Partnership2" type="number" step="any" name="partnership2" value={addFormData.partnership2} readOnly />

<TextField label="Commission" type="number" step="any" name="commission" value={addFormData.commission} readOnly />
<TextField label="Pana" type="number" step="any" name="pana" value={addFormData.pana} readOnly />
<TextField label="Multiple" type="number" step="any" name="multiple" value={addFormData.multiple} readOnly />

<TextField label="SP" type="number" step="any" name="sp" value={addFormData.sp} readOnly />

<TextField label="DP" type="number" step="any" name="dp" value={addFormData.dp} readOnly />

<TextField label="Jodi" type="number" step="any" name="jodi" value={addFormData.jodi} readOnly />

<TextField label="TP" type="number" step="any" name="tp" value={addFormData.tp} readOnly />

</div>
        </Page>
       
      <div className="contentWrapper mb-2">

        
        <Page fullWidth>



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
                  'Pana Amount',
                  'Khula Amount',
                  'SP Amount',
                  'DP Amount',
                  'JODI Amount',
                  'TP Amount'
                ]}
                rows={rows}
                totals={['', <span>{mainTotal}</span>, '', '', '', '', '', '']}
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

        </Page>
      </div>
      <Modal
          small
          open={isVisible}
          title="Warning"
          onClose={() => setIsVisible(false)}
        >
          <Modal.Section>
            <div className="error">
            Customer limit exceeded! 
            <span> Max limit is <b>₹{addFormData.limit}</b></span>
            </div>
          </Modal.Section>
        </Modal>
    </>
  );
}
