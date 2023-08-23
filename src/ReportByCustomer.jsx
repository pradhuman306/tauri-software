import { React, useContext, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import {
  Button,
  Page,
  TextField,
  Text,
  LegacyCard,
  ButtonGroup,
  Modal,
  DataTable,
  Card,
  Select,
  Checkbox
} from "@shopify/polaris";
import { MyContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function ReportByCustomer() {
  const navigate = useNavigate();
  const [entries, setentries] = useState([]);
  const [filterentries, setfilterentries] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [reportData, setreportData] = useState([]);
  const [tabActive, setTabActive] = useState(false);
  const { setErrorMessage, setMessage } = useContext(MyContext);
  const [remainingEntries, setRemainingEntries] = useState([]);
  const todaydate = new Date();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [checked, setChecked] = useState(false);
  const [customersOptions, setcustomersOptions] = useState([]);
  const [printReportdata, setprintReportdata] = useState([]);
  const [selectedCId, setCID] = useState("");

  const handleChange = async (id,value) => {

  // Create a new array with the modified objects
  const updatedArray = filterentries.map((obj)=>{
    if(obj.customer_id == id){
      if(!Object.keys(obj).includes("checked") && obj.customer_id == id){
        return{
          ...obj,
          checked:!value
        }
      }else{
        return{
          ...obj,
          checked:!value
        }
      }
     
    }
    return {...obj}
  })

  await writeTextFile(
    { path: "entries.json", contents: JSON.stringify(updatedArray) },
    { dir: BaseDirectory.Resource }
  );
  setfilterentries(updatedArray);

  }
  useEffect(()=>{
    if(start != '' && end != '' && selectedCId!= '' && filterentries.length && customers.length){
      searchData();
    }
  },[filterentries,customers])
 
    
  const getNotesFromFile = async () => {
    try {
      const myfileNotes = await readTextFile("entries.json", {
        dir: BaseDirectory.Resource,
      });
      const mycustomers = JSON.parse(myfileNotes);
      setentries(mycustomers);
      setfilterentries(mycustomers);
    } catch (error) {
   
      getNotesFromFile();
      console.log(error);
    }

    //customers
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
      const myfiledata = await readTextFile("cashbook.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      updateCashbookdata(mydata);
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    getNotesFromFile();
    let day = todaydate.getDate();
    let month = todaydate.getMonth() + 1;
    let year = todaydate.getFullYear();
    if (month.toString().length <= 1) {
      month = '0' + month;
    }
    if (day.toString().length <= 1) {
      day = '0' + day;
    }
    setStart(year + '-' + month + '-' + day);
    setEnd(year + '-' + month + '-' + day);
  }, []);



  const searchData = () => {
    if (start != "" && end != "" && selectedCId != "") {                   
      var startDate = new Date(start + " 00:00:01");
      var endDate = new Date(end + " 23:59:59");
      var datevise = [];
      var customerIds = [];
      const filteredData = filterentries.filter(function (a) {
        var aDate = new Date(a.date);
        if (aDate >= startDate && aDate <= endDate && a.customer_id == selectedCId) {
          if (!datevise.includes(a.date)) {
            datevise.push(a.date);
          }
          if (!customerIds.includes(a.customer_id)) {
            customerIds.push(a.customer_id);
          }
        }
        return aDate >= startDate && aDate <= endDate;
      });
      const updatedFilterEntries = filterentries.filter(function (entry) {
        // Check if the entry is not present in the filteredData array
        return !filteredData.includes(entry);
      });
      setRemainingEntries(updatedFilterEntries);
      if (filteredData.length === 0) {
        setErrorMessage("No record found");
        setreportData([]);
        return false;
      } else {
        setTabActive(true);
      }
      // id loop
      var reportList = [];
      var printReportList = [];
      for (let index = 0; index < customerIds.length; index++) {
        var CID = customerIds[index];
        // date loop
        for (let index = 0; index < datevise.length; index++) {
          var vDate = datevise[index];
          // calculations
          var cdata = customers.filter((item) => item.customer_id === CID);
          var newFormData = [];
          if(cdata && cdata[0] && cdata[0]['customer_id2']){
            var customer2data = customers.filter((item) => item.customer_id === cdata[0]['customer_id2']);
          newFormData["customer_id2"] = customer2data[0]? customer2data[0]:[];
          }else{
          newFormData["customer_id2"] = []
          }
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
          //
          var startDate = new Date(vDate + " 00:00:01");
          var endDate = new Date(vDate + " 23:59:59");
          var getData = filteredData.filter(function (a) {
            var aDate = new Date(a.date);
            return (
              aDate >= startDate && aDate <= endDate && a.customer_id == CID
            );
          });

          var allcustomerdata = filterentries.filter(function (a) {
            return a.customer_id == CID;
          });



        var calculateData = doCalcultion(getData,CID,newFormData);

        var allcustomercalculatedata = doCalcultion(allcustomerdata,CID,newFormData);
        // return false;
      let tmp = allcustomerdata.filter((obj)=>{
        if (!Object.keys(obj).includes("checked") || obj.checked === false) {
          return true;
        }
      
      })
      let checked = false;
      if(tmp.length == 0){
        checked = true;
      }
      calculateData.printdata.id= CID;
      calculateData.printdata.date= vDate;
      calculateData.printdata.name= cdata[0] ? cdata[0]["name"] : "";
      printReportList.push(calculateData.printdata);

          if (CID && calculateData) {
            reportList.push({
              id: CID,
              date: vDate,
              name: cdata[0] ? cdata[0]["name"] : "",
              credit: calculateData.type == "Positive" ? calculateData.total.toFixed(2) : "",
              debit: calculateData.type == "Negative" ? calculateData.total.toFixed(2) : "",
              customer2:calculateData.customer2?('₹'+calculateData.customer2amount.toFixed(2)+''+(calculateData.customer2name?'('+calculateData.customer2name+')':'')):'',
              total: (allcustomercalculatedata ? (allcustomercalculatedata.total).toFixed(2):'')+''+(allcustomercalculatedata.type == "Positive"?' CR':' DR'),
              checked: checked,
              customer2amount:calculateData.customer2amount.toFixed(2),
              customer2id:calculateData.customer2,
              type:calculateData.type
            });
          }
        } // date loop end
      } // customer id loop end
      reportList.sort(function compare(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      });
      setreportData(reportList);
      console.log(printReportList);
      setprintReportdata(printReportList);
    } else {
      setTabActive(false);
      setreportData([]);
      setentries(filterentries);
      setErrorMessage("Please select date");
    }
  };

  const doCalcultion = (data, id, newFormData) => {
    var getData = data;
    if (getData.length) {
      const result = getData.reduce(
        (
          acc,
          {
            timezone,
            amount,
            dp_amount,
            jodi_amount,
            khula_amount,
            pana_amount,
            sp_amount,
            tp_amount,
          }
        ) => ({
          ...acc,
          [timezone]: {
            timezone,
            amount: acc[timezone] ? (Number(acc[timezone].amount) + Number(amount)) : Number(amount),
            dp_amount: acc[timezone]? Number(acc[timezone].dp_amount) + Number(dp_amount) : Number(dp_amount),
            jodi_amount: acc[timezone]? Number(acc[timezone].jodi_amount) + Number(jodi_amount) : Number(jodi_amount),
            khula_amount: acc[timezone]? Number(acc[timezone].khula_amount) + Number(khula_amount) : Number(khula_amount),
            pana_amount: acc[timezone]? Number(acc[timezone].pana_amount) + Number(pana_amount) : Number(pana_amount),
            sp_amount: acc[timezone]? Number(acc[timezone].sp_amount) + Number(sp_amount) : Number(sp_amount),
            tp_amount: acc[timezone]? Number(acc[timezone].tp_amount) + Number(tp_amount) : Number(tp_amount),
          },
        }),
        {}
      );
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
        totalDayData["amount"] = (result[zone]? totalDayData["amount"] + Number(result[zone].amount) : totalDayData["amount"]);
        totalDayData["pana_amount"] =result[zone]? totalDayData["pana_amount"] + Number(result[zone].pana_amount): totalDayData["pana_amount"];
        totalDayData["khula_amount"] = result[zone]? totalDayData["khula_amount"] +Number(result[zone].khula_amount): totalDayData["khula_amount"];
        totalDayData["sp_amount"] =  result[zone]? totalDayData["sp_amount"] + Number(result[zone].sp_amount): totalDayData["sp_amount"];
        totalDayData["dp_amount"] = result[zone] ? totalDayData["dp_amount"] + Number(result[zone].dp_amount): totalDayData["dp_amount"];
        totalDayData["jodi_amount"] = result[zone]? totalDayData["jodi_amount"] +Number(result[zone].jodi_amount): totalDayData["jodi_amount"];
        totalDayData["tp_amount"] = result[zone] ? totalDayData["tp_amount"] + Number(result[zone].tp_amount): totalDayData["tp_amount"];
      }

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
        totalNightData["amount"] = (result[zone]? totalNightData["amount"] + Number(result[zone].amount) : totalNightData["amount"]);
        totalNightData["pana_amount"] =result[zone]? totalNightData["pana_amount"] + Number(result[zone].pana_amount): totalNightData["pana_amount"];
        totalNightData["khula_amount"] = result[zone]? totalNightData["khula_amount"] +Number(result[zone].khula_amount): totalNightData["khula_amount"];
        totalNightData["sp_amount"] =  result[zone]? totalNightData["sp_amount"] + Number(result[zone].sp_amount): totalNightData["sp_amount"];
        totalNightData["dp_amount"] = result[zone] ? totalNightData["dp_amount"] + Number(result[zone].dp_amount): totalNightData["dp_amount"];
        totalNightData["jodi_amount"] = result[zone]? totalNightData["jodi_amount"] +Number(result[zone].jodi_amount): totalNightData["jodi_amount"];
        totalNightData["tp_amount"] = result[zone] ? totalNightData["tp_amount"] + Number(result[zone].tp_amount): totalNightData["tp_amount"];
      }
      // hidden calculation
      var winning_amount = 0;
      winning_amount +=
        (totalDayData["khula_amount"] + totalNightData["khula_amount"]) *
        newFormData["multiple"];
      winning_amount +=
        (totalDayData["sp_amount"] + totalNightData["sp_amount"]) *
        newFormData["sp"];
      winning_amount +=
        (totalDayData["dp_amount"] + totalNightData["dp_amount"]) *
        newFormData["dp"];
      winning_amount +=
        (totalDayData["jodi_amount"] + totalNightData["jodi_amount"]) *
        newFormData["jodi"];
      winning_amount +=
        (totalDayData["tp_amount"] + totalNightData["tp_amount"]) *
        newFormData["tp"];
      var amount_commision =
        ((totalDayData["amount"] + totalNightData["amount"]) *
          newFormData["commission"]) /
        100;
      var pana_commision =
        ((totalDayData["pana_amount"] + totalNightData["pana_amount"]) *
          newFormData["pana"]) /
        100;
      var sec_sub_total =
        winning_amount + pana_commision + amount_commision;
      var SUB_TOTAL =
        sec_sub_total -
        (totalDayData["amount"] + totalNightData["amount"]) -
        (totalDayData["pana_amount"] + totalNightData["pana_amount"]);

      var partnership_percent =
        (SUB_TOTAL * newFormData["partnership"]) / 100;
      var TOTAL = SUB_TOTAL - partnership_percent;
      if(newFormData["partnership2"] && newFormData["partnership2"] != ""){
        var customer2Risk = ((SUB_TOTAL * newFormData["partnership2"]) / 100);
      }else{
        var customer2Risk = 0;
      }
      var type = ((totalDayData['amount'] + totalNightData['amount']) > TOTAL) ? "Negative" : "Positive";
      // total day night calculation

      var day_winning_amount = 0;
      day_winning_amount += (totalDayData['khula_amount']) * newFormData['multiple'];
      day_winning_amount += (totalDayData['sp_amount']) * newFormData['sp'];
      day_winning_amount += (totalDayData['dp_amount']) * newFormData['dp'];
      day_winning_amount += (totalDayData['jodi_amount']) * newFormData['jodi'];
      day_winning_amount += (totalDayData['tp_amount']) * newFormData['tp'];
      var day_amount_commision = (((totalDayData['amount']) * newFormData['commission']) / 100);
      var day_pana_commision = (((totalDayData['pana_amount']) * newFormData['pana']) / 100);
      var day_sec_sub_total = day_winning_amount + day_pana_commision + day_amount_commision;
      var day_SUB_TOTAL = day_sec_sub_total - (totalDayData['amount']) - (totalDayData['pana_amount']);
      var day_partnership_percent = newFormData['partnership']?(day_SUB_TOTAL * newFormData['partnership'] / 100):0;
      var DAY_TOTAL = day_SUB_TOTAL - day_partnership_percent;
      if (DAY_TOTAL) {
        DAY_TOTAL = DAY_TOTAL.toFixed(2);
        if ((totalDayData['amount']) > DAY_TOTAL) {
          DAY_TOTAL = Math.abs(DAY_TOTAL) + ' Dr.';
        } else {
          DAY_TOTAL = Math.abs(DAY_TOTAL) + ' Cr.';
        }
      }

      var night_winning_amount = 0;
      night_winning_amount += (totalNightData['khula_amount']) * newFormData['multiple'];
      night_winning_amount += (totalNightData['sp_amount']) * newFormData['sp'];
      night_winning_amount += (totalNightData['dp_amount']) * newFormData['dp'];
      night_winning_amount += (totalNightData['jodi_amount']) * newFormData['jodi'];
      night_winning_amount += (totalNightData['tp_amount']) * newFormData['tp'];
      var night_amount_commision = (((totalNightData['amount']) * newFormData['commission']) / 100);
      var night_pana_commision = (((totalNightData['pana_amount']) * newFormData['pana']) / 100);
      var night_sec_sub_total = night_winning_amount + night_pana_commision + night_amount_commision;
      var night_SUB_TOTAL = night_sec_sub_total - (totalNightData['amount']) - (totalNightData['pana_amount']);
      var night_partnership_percent = newFormData['partnership']?(night_SUB_TOTAL * newFormData['partnership'] / 100):0;
      var night_TOTAL = night_SUB_TOTAL - night_partnership_percent;
      if (night_TOTAL) {
        night_TOTAL = night_TOTAL.toFixed(2);
        if ((totalNightData['amount']) > night_TOTAL) {
          night_TOTAL = Math.abs(night_TOTAL) + ' Dr.';
        } else {
          night_TOTAL = Math.abs(night_TOTAL) + ' Cr.';
        }
      }
      // total day night calculation end
      let printdata = {
        'totalDayData':totalDayData,
        'totalNightData':totalNightData,
        'newFormData':newFormData,
        'result':result,
        'DAY_TOTAL':DAY_TOTAL,
        'night_TOTAL':night_TOTAL,
        total: TOTAL,
        type : type,
      }
      var arr = {
        printdata:printdata,
        total: TOTAL,
        type : type,
        customer2:newFormData['customer_id2']?newFormData['customer_id2']['customer_id']:'',
        customer2amount:customer2Risk,
        customer2name:newFormData['customer_id2']?newFormData['customer_id2']['name']+' '+newFormData['customer_id2']['customer_id']:''
      }
      return arr;
    } // length condition
  }

  const onchangeHandler = (value, param) => {
    if (param == "start") {
      setStart(value);
    } else if(param == 'end') {
      setEnd(value);
    }else if(param == 'cid'){
        setCID(value);
    }
  };
  const deleteEntries = async () => {
    await writeTextFile(
      { path: "entries.json", contents: JSON.stringify(remainingEntries) },
      { dir: BaseDirectory.Resource }
    );
    getNotesFromFile();
    // searchData();
    modalOpen("deleteReport");
    setTabActive(false);
    setMessage("Entries deleted successfully");
  };
  const clear = (e) => {
    setStart("");
    setEnd("");
    setTabActive(false);
  };
  const [cashbookData, updateCashbookdata] = useState([]);
  const AddDatatoCashBook = (data) => {
    let newArray = [];
    data.map((obj, index) => {
      newArray.push({id:Date.now(),cid:obj.id,credit:obj.credit?Number(obj.credit):0,debit:obj.debit?Number(obj.debit):0,date:obj.date});
      if(obj.customer2id && obj.customer2id != undefined){
        if(obj.type == 'Positive'){
    newArray.push({id:Date.now(),cid:obj.customer2id,credit:Number(obj.customer2amount),debit:0,date:obj.date});
        }else{
    newArray.push({id:Date.now(),cid:obj.customer2id,credit:0,debit:Number(obj.customer2amount),date:obj.date});
        }
      }
    })
    updateData([...newArray,...cashbookData]);
  }

  const updateData = async (data) => {
    updateCashbookdata([...data]);
    await writeTextFile(
      { path: "cashbook.json", contents: JSON.stringify(data) },
      { dir: BaseDirectory.Resource }
    );
    modalOpen("cashBook")
    setMessage("Entries added to Cashbook");
    navigate("/cashbook");
  };

  const [isVisible, setIsVisible] = useState({ deleteReport: false,cashBook: false });
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
  const printReport = (e) => {
    window.print();
  };
  const rows = [];
  reportData.map((data, index) => {
    let newArray = [];
    newArray.push(data.date, data.name, data.credit, data.debit, data.customer2,data.total, <Checkbox
      checked={data.checked}
      id={data.id}
      onChange={()=>handleChange(data.id,data.checked)}
    />);
    rows.push(newArray);
  });

  return (
    <>
      <Page
      fullWidth
        primaryAction={
          <ButtonGroup>
            <Button onClick={()=> navigate('/report')}>Report By Date</Button> 
            <Select
                  name="name"
                  id="name"
                  options={customersOptions}
                  value={selectedCId}
                  onChange={(e) => onchangeHandler(e,'cid')}
                />
             <div className="col subHeader">
            <TextField
            label="From"
              type="date"
              name="start"
              value={start}
              onChange={(e) => onchangeHandler(e, "start")}
            />
            </div>
            <Text>To</Text>
            <TextField
              type="date"
              name="end"
              value={end}
              onChange={(e) => onchangeHandler(e, "end")}
            />
            <Button
              primary
              onClick={(e) => {
                searchData();
              }}
            >
              Search
            </Button>
          </ButtonGroup>
        }
        title="Report By Customer"
      >
        
        {printReportdata.length ? (
          <>
            <div className="report-table-wrapper">
              {
    printReportdata.map((obj,index) => {
      console.log(obj);
      return <div className="table-warp" key={index}>
      <table key={index} className="printreporttable">
      <thead>
<tr>
  <th colSpan="3">{obj.name} </th>
  <th colSpan="5">{obj.date}</th>
</tr>
</thead>
<tbody>
<tr>
  <td>{obj.newFormData.commission} <br/>Commision</td>
  <td>{obj.newFormData.partnership} <br/>Partnership</td>
  <td rowSpan="2">{obj.newFormData.pana} <br /> Pana-commision</td>
  <td rowSpan="2">{obj.newFormData.multiple} <br/>Multiple</td>
  <td rowSpan="2">{obj.newFormData.sp} <br/> SP</td>
  <td rowSpan="2">{obj.newFormData.dp} <br/>DP</td>
  <td rowSpan="2"> {obj.newFormData.jodi} <br/> J </td>
  <td rowSpan="2">{obj.newFormData.tp} <br/> TP</td>
</tr>
<tr>
  <td></td>
  <th>Amount</th>
</tr>
<tr>
  <th>TO </th>
  <td>{obj.result['TO']?obj.result['TO'].amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].pana_amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].khula_amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].sp_amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].dp_amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].jodi_amount:''}</td>
  <td>{obj.result['TO']?obj.result['TO'].tp_amount:''}</td>
</tr>
<tr>
  <th>TK </th>
  <td>{obj.result['TK']?obj.result['TK'].amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].pana_amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].khula_amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].sp_amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].dp_amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].jodi_amount:''}</td>
  <td>{obj.result['TK']?obj.result['TK'].tp_amount:''}</td>
</tr>
<tr>
  <th> MO</th>
  <td>{obj.result['MO']?obj.result['MO'].amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].pana_amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].khula_amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].sp_amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].dp_amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].jodi_amount:''}</td>
  <td>{obj.result['MO']?obj.result['MO'].tp_amount:''}</td>
</tr>
<tr>
  <th> KO</th>
  <td>{obj.result['KO']?obj.result['KO'].amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].pana_amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].khula_amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].sp_amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].dp_amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].jodi_amount:''}</td>
  <td>{obj.result['KO']?obj.result['KO'].tp_amount:''}</td>
</tr>
<tr>
  <th> MK</th>
  <td>{obj.result['MK']?obj.result['MK'].amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].pana_amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].khula_amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].sp_amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].dp_amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].jodi_amount:''}</td>
  <td>{obj.result['MK']?obj.result['MK'].tp_amount:''}</td>
</tr>
<tr>
  <th> KK</th>
  <td>{obj.result['KK']?obj.result['KK'].amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].pana_amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].khula_amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].sp_amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].dp_amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].jodi_amount:''}</td>
  <td>{obj.result['KK']?obj.result['KK'].tp_amount:''}</td>
</tr>
<tr>
  <th> Total 1</th>
  <th>{obj.totalDayData.amount?obj.totalDayData.amount:''}</th>
  <th>{obj.totalDayData.pana_amount?obj.totalDayData.pana_amount:''}</th>
  <th>{obj.totalDayData.khula_amount?obj.totalDayData.khula_amount:''}</th>
  <th>{obj.totalDayData.sp_amount?obj.totalDayData.sp_amount:''}</th>
  <th>{obj.totalDayData.dp_amount?obj.totalDayData.dp_amount:''}</th>
  <th>{obj.totalDayData.jodi_amount?obj.totalDayData.jodi_amount:''}</th>
  <th>{obj.totalDayData.tp_amount?obj.totalDayData.tp_amount:''}</th>
</tr>
<tr>
  <th> MO2</th>
  <td>{obj.result['MO2']?obj.result['MO2'].amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].pana_amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].khula_amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].sp_amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].dp_amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].jodi_amount:''}</td>
  <td>{obj.result['MO2']?obj.result['MO2'].tp_amount:''}</td>
</tr>
<tr>
  <th> BO</th>
  <td>{obj.result['BO']?obj.result['BO'].amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].pana_amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].khula_amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].sp_amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].dp_amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].jodi_amount:''}</td>
  <td>{obj.result['BO']?obj.result['BO'].tp_amount:''}</td>
</tr>
<tr>
  <th> MK2</th>
  <td>{obj.result['MK2']?obj.result['MK2'].amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].pana_amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].khula_amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].sp_amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].dp_amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].jodi_amount:''}</td>
  <td>{obj.result['MK2']?obj.result['MK2'].tp_amount:''}</td>
</tr>
<tr>
  <th> BK</th>
  <td>{obj.result['BK']?obj.result['BK'].amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].pana_amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].khula_amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].sp_amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].dp_amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].jodi_amount:''}</td>
  <td>{obj.result['BK']?obj.result['BK'].tp_amount:''}</td>
</tr>
<tr>
  <th>Total 2</th>
  <th>{obj.totalNightData.amount?obj.totalNightData.amount:''}</th>
  <th>{obj.totalNightData.pana_amount?obj.totalNightData.pana_amount:''}</th>
  <th>{obj.totalNightData.khula_amount?obj.totalNightData.khula_amount:''}</th>
  <th>{obj.totalNightData.sp_amount?obj.totalNightData.sp_amount:''}</th>
  <th>{obj.totalNightData.dp_amount?obj.totalNightData.dp_amount:''}</th>
  <th>{obj.totalNightData.jodi_amount?obj.totalNightData.jodi_amount:''}</th>
  <th>{obj.totalNightData.tp_amount?obj.totalNightData.tp_amount:''}</th>
</tr>
<tr>
  <th>Total</th>
  <th>{obj.totalDayData.amount+obj.totalNightData.amount}</th>
  <th>{obj.totalDayData.pana_amount+obj.totalNightData.pana_amount}</th>
  <th>{obj.totalDayData.khula_amount+obj.totalNightData.khula_amount}</th>
  <th>{obj.totalDayData.sp_amount+obj.totalNightData.sp_amount}</th>
  <th>{obj.totalDayData.dp_amount+obj.totalNightData.dp_amount}</th>
  <th>{obj.totalDayData.jodi_amount+obj.totalNightData.jodi_amount}</th>
  <th>{obj.totalDayData.tp_amount+obj.totalNightData.tp_amount}</th>
</tr>
<tr>
  <th>Final Total</th>
  <th>{obj.total+''+(obj.type == "Positive"?' CR':' DR')}</th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  <th></th>
  
</tr>
</tbody>
</table>
</div>

    })
              }

             
            </div>
            <div className="btn-wrap print-btn">
              <ButtonGroup>
                <Button onClick={(e) => window.print()} primary>
                  Print
                </Button>
                {/* <Button destructive onClick={(e) => modalOpen("deleteReport")}>
                  Delete
                </Button>
                <Button onClick={(e) => modalOpen('cashBook')} >
                  Add To Cashbook
                </Button> */}
              </ButtonGroup>
            </div>
          </>
        ) : (
          <Card>
            <Text alignment="center" variant="headingMd" as="h3">No data available</Text>
          </Card>
        )}
        {/* Delete set popup */}
        <Modal
          small
          open={isVisible.deleteReport}
          onClose={() => modalOpen("deleteReport")}
          title="Delete Entries"
          primaryAction={{
            content: "Yes",
            onAction: () => deleteEntries(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("deleteReport"),
            },
          ]}
        >
          <Modal.Section>
            <div className="">
              Are you sure you want to delete this entries!
            </div>
          </Modal.Section>
        </Modal>
        {/* cashbook modal  */}
        <Modal
          small
          open={isVisible.cashBook}
          onClose={() => modalOpen("cashBook")}
          title="Add Enties to Cashbook"
          primaryAction={{
            content: "Yes",
            onAction: () => AddDatatoCashBook(reportData),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => modalOpen("cashBook"),
            },
          ]}
        >
          <Modal.Section>
            <div className="">
              Are you sure you want to Add this entries to CashBook!
            </div>
          </Modal.Section>
        </Modal>
      </Page>
    </>
  );
}
