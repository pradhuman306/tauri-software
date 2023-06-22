import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { message } from "@tauri-apps/api/dialog";

export default function Report() {
  const [entries, setentries] = useState([]);
  const [filterentries, setfilterentries] = useState([]);
  const [customers, setcustomers] = useState([]);

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

  function filterData() {
      var startDate = new Date(start + " 00:00:01");
      var endDate = new Date(end + " 23:59:59");
      const filteredData = filterentries.filter(function (a) {
        var aDate = new Date(a.date);
        return (
          aDate >= startDate && aDate <= endDate
        );
      });
      console.log(filteredData);
    return filteredData;
  }

  const searchData = () => {
    if (start != "" && end != "") {
      const data = filterData();
      for (let index = 0; index < data.length; index++) {
        var forelement = data[index];

        var element = data.filter(
          (item1) => item1.customer_id === forelement['customer_id']
        );

        console.log('reduce element', element);

        var cdata = customers.filter(
          (item) => item.customer_id === element['customer_id']
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
        element['setdata'] = newFormData;
        // calculation 
        
        const result = element.reduce((acc, {timezone, amount,dp_amount,jodi_amount,khula_amount,pana_amount,sp_amount,tp_amount}) => ({
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
        
        if(TOTAL){
          TOTAL = TOTAL.toFixed(2);
       element['credit'] = TOTAL;
       element[0]['credit'] = TOTAL;
       element['debit'] = TOTAL;
       element[0]['debit'] = TOTAL;
        }
        console.log('element',element);
        // calculation end
      }
      setentries(data);
      if (data.length === 0) {
        console.log("not found any record");
      }
    } else {
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
    console.log('clear');
    setentries(filterentries);
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <div>
            <div className="report-header">
              <h4>Report</h4>
            </div>
            <div>
              <input type="date" name="start" value={start} onChange={onchangeHandler} />
              <input type="date" name="end" value={end} onChange={onchangeHandler}/>
              <button
                onClick={(e) => {
                  searchData();
                }}
              >Search</button>
              &nbsp;
              &nbsp;
              &nbsp;
              <button onClick={clear}>Clear</button>
            </div>
            <div className="report-body">
              <table>
                <thead>
                  <tr>
                    <th>CID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Timezone</th>
                    <th>Credit</th>
                    <th>Debit</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((data, index) => (
                    <tr key={index}>
                      <td>{data.customer_id}</td>
                      <td>{data.date}</td>
                      <td>{data.name}</td>
                      <td>{data.timezone}</td>
                      <td>{data.credit}</td>
                      <td>{data.debit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}