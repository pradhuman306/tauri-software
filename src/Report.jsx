import { React, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { message } from "@tauri-apps/api/dialog";

export default function Report() {
  const [entries, setentries] = useState([]);
  const [filterentries, setfilterentries] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [reportData, setreportData] = useState([]);
  const [tabActive, setTabActive] = useState(false);

  useEffect(() => {
    const getNotesFromFile = async () => {
      try {
        const myfileNotes = await readTextFile("entries.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustomers = JSON.parse(myfileNotes);
        setentries(mycustomers);
        setfilterentries(mycustomers);
      } catch (error) {
        await writeTextFile(
          { path: "entries.json", contents: JSON.stringify(entries) },
          { dir: BaseDirectory.Resource }
        );
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
      } catch (error) {
        await writeTextFile(
          { path: "customers.json", contents: JSON.stringify(customers) },
          { dir: BaseDirectory.Resource }
        );
        console.log(error);
      }

    };
    getNotesFromFile();
  }, []);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const searchData = () => {
    if (start != "" && end != "") {
      setTabActive(true);
      var startDate = new Date(start + " 00:00:01");
      var endDate = new Date(end + " 23:59:59");
      var datevise = [];
      var customerIds = [];
      const filteredData = filterentries.filter(function (a) {
        var aDate = new Date(a.date);
        if(aDate >= startDate && aDate <= endDate){
          if (!datevise.includes(a.date)) {
            datevise.push(a.date);
          }
          if (!customerIds.includes(a.customer_id)) {
            customerIds.push(a.customer_id);
          }
        }
        return (
          aDate >= startDate && aDate <= endDate
        );
      });

      if(filteredData.length === 0){
      message("Not found any record.", { title: "Account", type: "error" });
        return false;
      }
      // id loop
      var reportList = [];
      for (let index = 0; index < customerIds.length; index++) {
        var CID = customerIds[index];
        // date loop
        for (let index = 0; index < datevise.length; index++) {
          var vDate = datevise[index];
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
        var startDate = new Date(vDate + " 00:00:01");
        var endDate = new Date(vDate + " 23:59:59");
        var getData = filteredData.filter(function (a) {
          var aDate = new Date(a.date);
          return (
            aDate >= startDate && aDate <= endDate && a.customer_id == CID
          );
        });

        if(getData.length){
          const result = getData.reduce((acc, {timezone, amount,dp_amount,jodi_amount,khula_amount,pana_amount,sp_amount,tp_amount}) => ({
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
        // hidden calculation
        var winning_amount = 0;
        winning_amount += (totalDayData['khula_amount'] + totalNightData['khula_amount']) * newFormData['multiple'];
        winning_amount += (totalDayData['sp_amount'] + totalNightData['sp_amount']) * newFormData['sp'];
        winning_amount += (totalDayData['dp_amount'] + totalNightData['dp_amount']) * newFormData['dp'];
        winning_amount += (totalDayData['jodi_amount'] + totalNightData['jodi_amount']) * newFormData['jodi'];
        winning_amount += (totalDayData['tp_amount'] + totalNightData['tp_amount']) * newFormData['tp'];
        var amount_commision = (((totalDayData['amount'] + totalNightData['amount']) * newFormData['commission'])/100);
        var pana_commision = (((totalDayData['pana_amount'] + totalNightData['pana_amount']) * newFormData['pana'])/100);
        var sec_sub_total = winning_amount+pana_commision+amount_commision;
        var SUB_TOTAL = sec_sub_total - (totalDayData['amount'] + totalNightData['amount']) - (totalDayData['pana_amount'] + totalNightData['pana_amount']);
        var partnership_percent = SUB_TOTAL * newFormData['partnership']/100;
        var TOTAL = SUB_TOTAL-partnership_percent;
        var type = parseInt(TOTAL) > 0 ? 'Positive' : 'Negative';
        reportList.push({
          'id':CID,
          'date':vDate,
          'name':cdata[0] ? cdata[0]["name"] : "",
          // 'total':TOTAL,
          'credit': (type == 'Positive') ? TOTAL.toFixed(2) : '',
          'debit':(type == 'Negative') ? TOTAL.toFixed(2) : '',
        });
      } // length condition

        } // date loop end
      } // customer id loop end
      reportList.sort(function compare(a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      });
      console.log('reportList',reportList);
      setreportData(reportList);
    } else {
      setTabActive(false);
      setreportData([]);
      setentries(filterentries);
    }
  };


  const onchangeHandler = (e) => {
    if(e.target.name == 'start'){
      setStart(e.target.value);
    }else{
      setEnd(e.target.value);
    }
  }

  const clear = (e) => {
    setStart("");
    setEnd("");
    setTabActive(false);
  }

  const printReport = (e) => {
    window.print();
  }

  return (
    <>
      <main>
        <div className="container">
          <div className="report-wrapper">
            <div className="body-header">
            <div className="report-header">
              <h4>Report</h4>
            </div>
            <div className="report-date-select">
              <input type="date" name="start" value={start} onChange={onchangeHandler} />
              <p className="select-range ">to</p>
              <input type="date" name="end" value={end} onChange={onchangeHandler}/>
              <button
                onClick={(e) => {
                  searchData();
                }}
              >Search</button>
            </div>
            </div>
            {tabActive ? 
            <div>
<div className="report-body">
              <br />
              <br />
              <div>
              <button onClick={(e) => printReport(e)}>Print</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>CID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Credit</th>
                    <th>Debit</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.id}</td>
                      <td>{data.date}</td>
                      <td>{data.name}</td>
                      <td>{data.credit}</td>
                      <td>{data.debit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="print-delet-btn">
            <button onClick={(e) => window.print()}>Print</button>
              <button className="secondary-btn">Delete</button>
            </div>
              </div>
            :''}
          </div>
        </div>
      </main>
    </>
  );
}