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
  Checkbox,
  Link
} from "@shopify/polaris";
import { MyContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function Report() {
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
    if(start != '' && end != '' && filterentries.length && customers.length){
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
              // console.log(error);
    }

    //customers
    try {
      const myfiledata = await readTextFile("customers.json", {
        dir: BaseDirectory.Resource,
      });
      const mycust = JSON.parse(myfiledata);
      setcustomers(mycust);
    } catch (error) {
  
              // console.log(error);
    }

    try {
      const myfiledata = await readTextFile("cashbook.json", {
        dir: BaseDirectory.Resource,
      });
      const mydata = JSON.parse(myfiledata);
      updateCashbookdata(mydata);
    } catch (error) {
              // console.log(error);
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
    if (start != "" && end != "") {
      var startDate = new Date(start + " 00:00:01");
      var endDate = new Date(end + " 23:59:59");
      var datevise = [];
      var customerIds = [];
      const filteredData = filterentries.filter(function (a) {
        var aDate = new Date(a.date);
        if (aDate >= startDate && aDate <= endDate) {
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
      for (let index = 0; index < customerIds.length; index++) {
        var CID = customerIds[index];
        // date loop
        for (let index = 0; index < datevise.length; index++) {
          var vDate = datevise[index];
          // calculations
          var cdata = customers.filter((item) => item.customer_id === CID);
          if(cdata && cdata.length){
          var newFormData = [];
          if(cdata && cdata[0] && cdata[0]['customer_id2']){
            var customer2data = customers.filter((item) => item.customer_id === cdata[0]['customer_id2']);
          newFormData["customer_id2"] = customer2data[0]? customer2data[0]:[];
          }else{
          newFormData["customer_id2"] = []
          }
          newFormData["commission"] = cdata[0] && cdata[0]["commission"] ? cdata[0]["commission"] : "";
          newFormData["dp"] = cdata[0] && cdata[0]["dp"] ? cdata[0]["dp"] : "";
          newFormData["jodi"] = cdata[0] && cdata[0]["jodi"]? cdata[0]["jodi"] : "";
          newFormData["multiple"] = cdata[0] && cdata[0]["multiple"] ? cdata[0]["multiple"] : "";
          newFormData["pana"] = cdata[0] && cdata[0]["pana"]? cdata[0]["pana"] : "";
          newFormData["partnership"] = cdata[0] && cdata[0]["partnership"] ? cdata[0]["partnership"] : "";
          newFormData["partnership2"] = cdata[0] && cdata[0]["partnership2"] ? cdata[0]["partnership2"] : "";
          newFormData["set"] = cdata[0] && cdata[0]["set"] ? cdata[0]["set"] : "";
          newFormData["tp"] = cdata[0] && cdata[0]["tp"]? cdata[0]["tp"] : "";
          newFormData["sp"] = cdata[0] &&  cdata[0]["sp"] ? cdata[0]["sp"] : "";

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

       
          if (CID && cdata && cdata[0] && calculateData) {
            reportList.push({
              id: CID,
              date: vDate,
              name: cdata[0] ? <b>{cdata[0]["name"]}</b> : "",
              credit: <span className="credit">{calculateData.type == "Positive" ? calculateData.total.toFixed(2)+" CR" : ""}</span> ,
              debit: <span className="debit">{calculateData.type == "Negative" ? calculateData.total.toFixed(2)+" DR" : ""}</span>,
              customer2:<span className={allcustomercalculatedata.type == "Positive"?' debit':' credit'}>{calculateData.customer2?(calculateData.customer2amount.toFixed(2)+''+(allcustomercalculatedata.type == "Positive"?' DR':' CR')+' '+(calculateData.customer2name?'('+calculateData.customer2name+')':'')):''}</span>,
              total: (allcustomercalculatedata ? (allcustomercalculatedata.total).toFixed(2):'')+''+(allcustomercalculatedata.type == "Positive"?' CR':' DR'),
              checked: checked,
              customer2amount:calculateData.customer2amount.toFixed(2),
              customer2id:calculateData.customer2,
              type:calculateData.type
            });
          }
        }
        } // date loop end
      } // customer id loop end
      reportList.sort(function compare(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      });
      setreportData(reportList);
    } else {
      setTabActive(false);
      setreportData([]);
      setentries(filterentries);
      // setErrorMessage("Please select date");
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
        var customer2Risk = ((TOTAL * newFormData["partnership2"]) / 100);
      }else{
        var customer2Risk = 0;
      }
      if ((totalDayData['amount'] + totalNightData['amount']) > sec_sub_total) {
      var type = "Negative";
      }else{
      var type = "Positive";
      }
      customer2Risk =  Math.abs(customer2Risk);
      TOTAL = Math.abs(TOTAL);
      var arr = {
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
    } else {
      setEnd(value);
    }
  };

  useEffect(() => {
    document.getElementById("searchBtn").click();
  }, [start,end])
  

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
      newArray.push({id:Date.now(),cid:obj.id,credit:obj.credit?Number(obj.credit):0,debit:obj.debit?Number(obj.debit):0,date:obj.date,remark:'Added from Report.'});
      if(obj.customer2id && obj.customer2id != undefined){
        if(obj.type == 'Positive'){
    newArray.push({id:Date.now(),cid:obj.customer2id,credit:Number(obj.customer2amount),debit:0,date:obj.date,remark:'Added from Report.'});
        }else{
    newArray.push({id:Date.now(),cid:obj.customer2id,credit:0,debit:Number(obj.customer2amount),date:obj.date,remark:'Added from Report.'});
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
  if(reportData.length){
  reportData.length &&reportData.map((data, index) => {
    let newArray = [];
    newArray.push(data.date, data.name, data.credit, data.debit, data.customer2,data.total, <Checkbox
      checked={data.checked}
      id={data.id}
      onChange={()=>handleChange(data.id,data.checked)}
    />);
    rows.push(newArray);
  });
}
  return (
    <>
      <Page
      fullWidth
      secondaryActions={
        <Button onClick={()=> navigate('/reportbycustomer')}>Report By Customer</Button>
      }
        primaryAction={
          <ButtonGroup>
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
            <div className="hidden">
            <Button 
            id="searchBtn"
              primary
              onClick={(e) => {
                searchData();
              }}
            >
              Search
            </Button>
            </div>
          </ButtonGroup>
        }
        title="Report"
      >
        {tabActive && reportData.length ? (
          <>
            <LegacyCard>
              <div className="report">
              <DataTable
                columnContentTypes={["text", "text", "text","text", "text"]}
                headings={["Date", "Name", "Credit", "Debit","Customer2","Total","Status"]}
                rows={rows}
                hasZebraStripingOnData
                increasedTableDensity
                defaultSortDirection="descending"
              />
              </div>
            </LegacyCard>
            <div className="btn-wrap print-btn">
              <ButtonGroup>
                <Button onClick={(e) => window.print()} primary>
                  Print
                </Button>
                <Button destructive onClick={(e) => modalOpen("deleteReport")}>
                  Delete
                </Button>
                <div className="hidden">
                <Button onClick={(e) => modalOpen('cashBook')} >
                  Add To Cashbook
                </Button>
                </div>
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
