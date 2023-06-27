import { React, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export default function Calculater() {
  const [customers, setcustomers] = useState([]);
  const [entries, setentries] = useState([]);

  useEffect(() => {
    const getNotesFromFile = async () => {
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

  const onChangeSet = async (e) => {
    const cdata = customers.filter(
      (item) => item.customer_id === e.target.value
    );
    setCID(e.target.value);
    const newFormData = { ...addFormData };
    newFormData["customer_id"] = e.target.value;
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
    calculations(e.target.value,selectedDate);
  };

  const inputHandler = (e) => {
    if(e.target.name == 'date'){
      setDate(e.target.value);
      calculations(selectedCId,e.target.value);
    }
  };
  const [displayData, setDisplayData] = useState([]);
  const [mainTotal, setMainTotal] = useState(0);

  const calculations = (id,date) => {
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
    console.log('reduce ',filteredData);

const result = filteredData.reduce((acc, {timezone, amount,dp_amount,jodi_amount,khula_amount,pana_amount,sp_amount,tp_amount}) => ({
  ...acc, 
  [timezone]: {
    timezone, 
    amount: acc[timezone] ? (Number(amount)? Number(acc[timezone].amount) + Number(amount): (amount)): (Number(amount)?Number(amount):amount),
    dp_amount: acc[timezone] ? (Number(dp_amount)?Number(acc[timezone].dp_amount) + Number(dp_amount):(dp_amount)): (Number(dp_amount)?Number(dp_amount):dp_amount),
    jodi_amount: acc[timezone] ? (Number(jodi_amount)?Number(acc[timezone].jodi_amount) + Number(jodi_amount):(jodi_amount)): (Number(jodi_amount)?Number(jodi_amount):jodi_amount),
    khula_amount: acc[timezone] ? (Number(khula_amount)?Number(acc[timezone].khula_amount) + Number(khula_amount):(khula_amount)): (Number(khula_amount)?Number(khula_amount):khula_amount),
    pana_amount: acc[timezone] ? (Number(pana_amount)?Number(acc[timezone].pana_amount) + Number(pana_amount):(pana_amount)): (Number(pana_amount)?Number(pana_amount):pana_amount),
    sp_amount: acc[timezone] ? (Number(sp_amount)?Number(acc[timezone].sp_amount) + Number(sp_amount):(sp_amount)): (Number(sp_amount)?Number(sp_amount):sp_amount),
    tp_amount: acc[timezone] ? (Number(tp_amount)?Number(acc[timezone].tp_amount) + Number(tp_amount):(tp_amount)): (Number(tp_amount)?Number(tp_amount):tp_amount),
  }
}), 
{});

var totalDayData = [];
var first_arr = ['TO','TK','MO','KO','MK','KK','A1'];
// total 1 calculate
for (let index = 0; index < first_arr.length; index++) {
  var zone = first_arr[index];
  totalDayData['amount'] = totalDayData['amount'] ? (result[zone]?totalDayData['amount']+Number(result[zone].amount) : totalDayData['amount']): result[zone]? Number(result[zone].amount):0;
  totalDayData['pana_amount'] = totalDayData['pana_amount'] ? (result[zone]?totalDayData['pana_amount']+Number(result[zone].pana_amount) :totalDayData['pana_amount']): result[zone]? Number(result[zone].pana_amount):0;
  totalDayData['khula_amount'] = totalDayData['khula_amount'] ? (result[zone]?totalDayData['khula_amount']+Number(result[zone].khula_amount) :totalDayData['khula_amount']): result[zone]? Number(result[zone].khula_amount):0;
  totalDayData['sp_amount'] = totalDayData['sp_amount'] ? (result[zone]?totalDayData['sp_amount']+Number(result[zone].sp_amount) :totalDayData['sp_amount']): result[zone]? Number(result[zone].sp_amount):0;
  totalDayData['dp_amount'] = totalDayData['dp_amount'] ? (result[zone]?totalDayData['dp_amount']+Number(result[zone].dp_amount) :totalDayData['dp_amount']): result[zone]? Number(result[zone].dp_amount):0;
  totalDayData['jodi_amount'] = totalDayData['jodi_amount'] ? (result[zone]?totalDayData['jodi_amount']+Number(result[zone].jodi_amount) :totalDayData['jodi_amount']): result[zone]? Number(result[zone].jodi_amount):0;
  totalDayData['tp_amount'] = totalDayData['tp_amount'] ? (result[zone]?totalDayData['tp_amount']+Number(result[zone].tp_amount) :totalDayData['tp_amount']): result[zone]? Number(result[zone].tp_amount):0;
}
setDayData(totalDayData);
var totalNightData = [];
var second_arr = ['MO2','BO','MK2','BK','A2'];
// total 2 calculate
for (let index = 0; index < second_arr.length; index++) {
  var zone = second_arr[index];
  totalNightData['amount'] = totalNightData['amount'] ? (result[zone]?totalNightData['amount']+Number(result[zone].amount) : totalNightData['amount']): result[zone]? Number(result[zone].amount):0;
  totalNightData['pana_amount'] = totalNightData['pana_amount'] ? (result[zone]?totalNightData['pana_amount']+Number(result[zone].pana_amount) :totalNightData['pana_amount']): result[zone]? Number(result[zone].pana_amount):0;
  totalNightData['khula_amount'] = totalNightData['khula_amount'] ? (result[zone]?totalNightData['khula_amount']+Number(result[zone].khula_amount) :totalNightData['khula_amount']): result[zone]? Number(result[zone].khula_amount):0;
  totalNightData['sp_amount'] = totalNightData['sp_amount'] ? (result[zone]?totalNightData['sp_amount']+Number(result[zone].sp_amount) :totalNightData['sp_amount']): result[zone]? Number(result[zone].sp_amount):0;
  totalNightData['dp_amount'] = totalNightData['dp_amount'] ? (result[zone]?totalNightData['dp_amount']+Number(result[zone].dp_amount) :totalNightData['dp_amount']): result[zone]? Number(result[zone].dp_amount):0;
  totalNightData['jodi_amount'] = totalNightData['jodi_amount'] ? (result[zone]?totalNightData['jodi_amount']+Number(result[zone].jodi_amount) :totalNightData['jodi_amount']): result[zone]? Number(result[zone].jodi_amount):0;
  totalNightData['tp_amount'] = totalNightData['tp_amount'] ? (result[zone]?totalNightData['tp_amount']+Number(result[zone].tp_amount) :totalNightData['tp_amount']): result[zone]? Number(result[zone].tp_amount):0;
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
var amount_commision = (((totalDayData['amount'] + totalNightData['amount']) * addFormData.commission)/100);
var pana_commision = (((totalDayData['pana_amount'] + totalNightData['pana_amount']) * addFormData.pana)/100);
var sec_sub_total = winning_amount+pana_commision+amount_commision;
var SUB_TOTAL = sec_sub_total - (totalDayData['amount'] + totalNightData['amount']) - (totalDayData['pana_amount'] + totalNightData['pana_amount']);
var partnership_percent = SUB_TOTAL * addFormData.partnership/100;
var TOTAL = SUB_TOTAL-partnership_percent;

if(TOTAL){
  TOTAL = TOTAL.toFixed(2);
if((totalDayData['amount'] + totalNightData['amount']) > TOTAL){
  TOTAL = Math.abs(TOTAL)+' Dr.';
}else{
  TOTAL = Math.abs(TOTAL)+' Cr.';
}
}

setMainTotal(TOTAL);
  };

  useEffect(() => {
    calculations(selectedCId,selectedDate);
  }, [addFormData]);

  return (
    <>
      <main>
        
        <div className="customer-name-date">
          <div className="container">

            <div className="name-date-wrapper">
            <div>
          <label htmlFor="customer name"> Customer Name</label>
                  <br />
                  <select
                    value={selectedCId}
                    name="name"
                    id="name"
                    className="customer-name"
                    onChange={onChangeSet}
                    required
                  >
                    <option key={0} value={""}>
                      Select Customer
                    </option>
                    {customers.map((data, index) => (
                      <option key={index + 1} value={data.customer_id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
          </div>
          <div>
            Date <br />
          <input
                    type="date"
                    name="date"
                    onChange={(e) => inputHandler(e)}
                  />      
          </div>
            </div>
          </div>
        </div>
    <div className="main-section container">
      <div className="main-section-set">
      <table className="table-first">
            <tr>
              <td>
              Set
            <br />
              <input type="number" step="any" name="set" value={addFormData.set} readOnly/> 
              </td>
                <td>
                  Cummision
                  <br />
                  <input type="number" step="any" name="commission" value={addFormData.commission} readOnly/>
                </td>
                <td>
                  Multiple
                  <br />
                  <input type="number" step="any" name="multiple" value={addFormData.multiple} readOnly/>
                </td>
                <td>
                  SP
                  <br />
                  <input type="number" step="any" name="sp" value={addFormData.sp} readOnly />
                </td>
                <td>
                  DP
                  <br />
                  <input type="number" step="any" name="dp" value={addFormData.dp} readOnly/>
                </td>
                <td>
                  Jodi<br />
                  <input type="number" step="any" name="jodi"  value={addFormData.jodi} readOnly/>
                </td>
                <td>
                  TP
                  <br />
                  <input type="number" step="any" name="tp" value={addFormData.tp} readOnly/>
                </td>
                <td>
                  Partnership
                  <br />
                  <input type="number" step="any" name="partnership" value={addFormData.partnership} readOnly/>
                </td>
                <td colSpan="6" >
                  Pana cummision
                  <br />
                  <input type="number" step="any" name="pana" value={addFormData.pana} readOnly/>
                </td>
              </tr>
              
          </table>
      </div>
        <div className="calculater">
          <div className="table-perent">
          <table>
            {/* <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead> */}
            <tbody>
              <tr>
                <td></td>
                <td>Amount</td>
                <td>Pana-Amount</td>
                <td>Kh</td>
                <td>SP-Amount</td>
                <td>DP-Amount</td>
                <td>J-Amount</td>
                <td>TP-Amount</td>
              </tr>
              <tr>
                <td>TO</td>
                <td>
                  <input type="text" name="TO[amount]" value={displayData['TO']?displayData['TO'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[pana_amount]" value={displayData['TO']?displayData['TO'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[khula_amount]" value={displayData['TO']?displayData['TO'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[sp_amount]" value={displayData['TO']?displayData['TO'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[dp_amount]" value={displayData['TO']?displayData['TO'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[jodi_amount]" value={displayData['TO']?displayData['TO'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TO[tp_amount]" value={displayData['TO']?displayData['TO'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>TK</td>
                <td>
                  <input type="text" name="TK[amount]" value={displayData['TK']?displayData['TK'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[pana_amount]" value={displayData['TK']?displayData['TK'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[khula_amount]" value={displayData['TK']?displayData['TK'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[sp_amount]" value={displayData['TK']?displayData['TK'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[dp_amount]" value={displayData['TK']?displayData['TK'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[jodi_amount]" value={displayData['TK']?displayData['TK'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="TK[tp_amount]" value={displayData['TK']?displayData['TK'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>MO</td>
                <td>
                  <input type="text" name="MO[amount]" value={displayData['MO']?displayData['MO'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[pana_amount]" value={displayData['MO']?displayData['MO'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[khula_amount]" value={displayData['MO']?displayData['MO'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[sp_amount]" value={displayData['MO']?displayData['MO'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[dp_amount]" value={displayData['MO']?displayData['MO'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[jodi_amount]" value={displayData['MO']?displayData['MO'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO[tp_amount]" value={displayData['MO']?displayData['MO'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>KO</td>
                <td>
                  <input type="text" name="KO[amount]" value={displayData['KO']?displayData['KO'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[pana_amount]" value={displayData['KO']?displayData['KO'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[khula_amount]" value={displayData['KO']?displayData['KO'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[sp_amount]" value={displayData['KO']?displayData['KO'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[dp_amount]" value={displayData['KO']?displayData['KO'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[jodi_amount]" value={displayData['KO']?displayData['KO'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KO[tp_amount]" value={displayData['KO']?displayData['KO'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>MK</td>
                <td>
                  <input type="text" name="MK[amount]" value={displayData['MK']?displayData['MK'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[pana_amount]" value={displayData['MK']?displayData['MK'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[khula_amount]" value={displayData['MK']?displayData['MK'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[sp_amount]" value={displayData['MK']?displayData['MK'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[dp_amount]" value={displayData['MK']?displayData['MK'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[jodi_amount]" value={displayData['MK']?displayData['MK'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK[tp_amount]" value={displayData['MK']?displayData['MK'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>KK</td>
                <td>
                  <input type="text" name="KK[amount]" value={displayData['KK']?displayData['KK'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[pana_amount]" value={displayData['KK']?displayData['KK'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[khula_amount]" value={displayData['KK']?displayData['KK'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[sp_amount]" value={displayData['KK']?displayData['KK'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[dp_amount]" value={displayData['KK']?displayData['KK'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[jodi_amount]" value={displayData['KK']?displayData['KK'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="KK[tp_amount]" value={displayData['KK']?displayData['KK'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>A1</td>
                <td>
                  <input type="text" name="A1[amount]" value={displayData['A1']?displayData['A1'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[pana_amount]" value={displayData['A1']?displayData['A1'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[khula_amount]" value={displayData['A1']?displayData['A1'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[sp_amount]" value={displayData['A1']?displayData['A1'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[dp_amount]" value={displayData['A1']?displayData['A1'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[jodi_amount]" value={displayData['A1']?displayData['A1'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A1[tp_amount]" value={displayData['A1']?displayData['A1'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td className="custom-padding">Total-1</td>
                <td>
                  <input type="text" name="total1[amount]" value={DayData?DayData['amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[pana_amount]" value={DayData?DayData['pana_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[khula_amount]" value={DayData?DayData['khula_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[sp_amount]" value={DayData?DayData['sp_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[dp_amount]" value={DayData?DayData['dp_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[jodi_amount]" value={DayData?DayData['jodi_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total1[tp_amount]" value={DayData?DayData['tp_amount']:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>MO</td>
                <td>
                  <input type="text" name="MO2[amount]" value={displayData['MO2']?displayData['MO2'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[pana_amount]" value={displayData['MO2']?displayData['MO2'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[khula_amount]" value={displayData['MO2']?displayData['MO2'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[sp_amount]" value={displayData['MO2']?displayData['MO2'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[dp_amount]" value={displayData['MO2']?displayData['MO2'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[jodi_amount]" value={displayData['MO2']?displayData['MO2'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MO2[tp_amount]" value={displayData['MO2']?displayData['MO2'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>BO</td>
                <td>
                  <input type="text" name="BO[amount]" value={displayData['BO']?displayData['BO'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[pana_amount]" value={displayData['BO']?displayData['BO'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[khula_amount]" value={displayData['BO']?displayData['BO'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[sp_amount]" value={displayData['BO']?displayData['BO'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[dp_amount]" value={displayData['BO']?displayData['BO'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[jodi_amount]" value={displayData['BO']?displayData['BO'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BO[tp_amount]" value={displayData['BO']?displayData['BO'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>MK</td>
                <td>
                  <input type="text" name="MK2[amount]" value={displayData['MK2']?displayData['MK2'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[pana_amount]" value={displayData['MK2']?displayData['MK2'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[khula_amount]" value={displayData['MK2']?displayData['MK2'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[sp_amount]" value={displayData['MK2']?displayData['MK2'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[dp_amount]" value={displayData['MK2']?displayData['MK2'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[jodi_amount]" value={displayData['MK2']?displayData['MK2'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="MK2[tp_amount]" value={displayData['MK2']?displayData['MK2'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>BK</td>
                <td>
                  <input type="text" name="BK[amount]" value={displayData['BK']?displayData['BK'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[pana_amount]" value={displayData['BK']?displayData['BK'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[khula_amount]" value={displayData['BK']?displayData['BK'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[sp_amount]" value={displayData['BK']?displayData['BK'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[dp_amount]" value={displayData['BK']?displayData['BK'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[jodi_amount]" value={displayData['BK']?displayData['BK'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="BK[tp_amount]" value={displayData['BK']?displayData['BK'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>A2</td>
                <td>
                  <input type="text" name="A2[amount]" value={displayData['A2']?displayData['A2'].amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[pana_amount]" value={displayData['A2']?displayData['A2'].pana_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[khula_amount]" value={displayData['A2']?displayData['A2'].khula_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[sp_amount]" value={displayData['A2']?displayData['A2'].sp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[dp_amount]" value={displayData['A2']?displayData['A2'].dp_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[jodi_amount]" value={displayData['A2']?displayData['A2'].jodi_amount:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="A2[tp_amount]" value={displayData['A2']?displayData['A2'].tp_amount:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td className="custom-padding">Total-2</td>
                <td>
                  <input type="text" name="total2[amount]" value={NightData?NightData['amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[pana_amount]" value={NightData?NightData['pana_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[khula_amount]" value={NightData?NightData['khula_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[sp_amount]" value={NightData?NightData['sp_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[dp_amount]" value={NightData?NightData['dp_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[jodi_amount]" value={NightData?NightData['jodi_amount']:''} readOnly/>
                </td>
                <td>
                  <input type="text" name="total2[tp_amount]" value={NightData?NightData['tp_amount']:''} readOnly/>
                </td>
              </tr>
              <tr>
                <td>Final Total</td>
                <td>
                  <input type="number" step="any" name="final[amount]" value={DayData['amount']+NightData['amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[pana_amount]" value={DayData['pana_amount']+NightData['pana_amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[khula_amount]" value={DayData['khula_amount']+NightData['khula_amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[sp_amount]" value={DayData['sp_amount']+NightData['sp_amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[dp_amount]" value={DayData['dp_amount']+NightData['dp_amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[jodi_amount]" value={DayData['jodi_amount']+NightData['jodi_amount']} readOnly/>
                </td>
                <td>
                  <input type="number" step="any" name="final[tp_amount]" value={DayData['tp_amount']+NightData['tp_amount']} readOnly/>
                </td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td colSpan="4" className="align-left">
                  <input type="text" step="any" value={mainTotal} readOnly/>
                </td>
                <td colSpan="3" className="align-left">
                  <button>Cancel/Close</button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
        </div>
      </main>
    </>
  );
}
