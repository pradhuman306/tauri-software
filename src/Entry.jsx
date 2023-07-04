import { React, useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { message } from "@tauri-apps/api/dialog";
import { toast } from 'react-toastify';


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

  const dateChange = async (e) => {
    setDate(e.target.value);
    setTabActive("");
  };

  const [timezone, setTimeZone] = useState("");
  const [inputFields, setInputFields] = useState([]);

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const list = [...inputFields];
    list[index][name] = value;
    if (name == "customer_id") {
      const cdata = customers.filter(
        (item) => item.customer_id === evnt.target.value
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

  const onChangesetTimeZone = (tz) => {
    setTimeZone(tz);
    setTabActive("");
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
    setentries([...entries,...inputFields]);
      await writeTextFile(
        {
          path: "entries.json",
          contents: JSON.stringify([...entries,...inputFields]),
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
  return (
    <>
      <main>
        <div className="container over-flow">
        <div>
          <div className="time-frame">
            <h4 className="time-frame-heading">Entry/Edit</h4>
            <header>
              <ul className="entry-header">
                <li
                  className={timezone == "TO" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("TO")}
                >
                  TO
                </li>
                <li
                  className={timezone == "TK" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("TK")}
                >
                  TK
                </li>
                <li
                  className={timezone == "MO" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("MO")}
                >
                  MO
                </li>
                <li
                  className={timezone == "KO" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("KO")}
                >
                  KO
                </li>
                <li
                  className={timezone == "MK" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("MK")}
                >
                  MK
                </li>
                <li
                  className={timezone == "KK" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("KK")}
                >
                  KK
                </li>
                <li
                  className={timezone == "A1" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("A1")}
                >
                  A1
                </li>
                <li
                  className={timezone == "MO2" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("MO2")}
                >
                  MO2
                </li>
                <li
                  className={timezone == "BO" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("BO")}
                >
                  BO
                </li>
                <li
                  className={timezone == "MK2" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("MK2")}
                >
                  MK2
                </li>
                <li
                  className={timezone == "BK" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("BK")}
                >
                  BK
                </li>
                <li
                  className={timezone == "A2" ? "active" : ""}
                  onClick={() => onChangesetTimeZone("A2")}
                >
                  A2
                </li>
              </ul>
            </header>
            <div className="customer-list-slide">
              <a href="javascript:void(0)" onClick={modalOpen} >Customers</a>
            </div>
            </div>
            <div className="content">
              <div className="content-top">
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
              </div>
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
              <div className="main-table-contant">

              <div className="center-wrap">
                {timezone != "" && tabActive != "" ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>CID</th>
                          <th>Name</th>
                          <th>Amount</th>
                          <th>Pana_amount</th>
                          <th>Khula_amount</th>
                          <th>SP_amount</th>
                          <th>DP_amount</th>
                          <th>JODI_amount</th>
                          <th>TP_amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inputFields.map((data, index) => {
                          const {
                            customer_id,
                            name,
                            amount,
                            pana_amount,
                            khula_amount,
                            sp_amount,
                            dp_amount,
                            jodi_amount,
                            tp_amount,
                          } = data;
                          return (
                            <tr key={index}>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={customer_id}
                                  name="customer_id"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={name}
                                  name="name"
                                  readOnly
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={amount}
                                  name="amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={pana_amount}
                                  name="pana_amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={khula_amount}
                                  name="khula_amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={sp_amount}
                                  name="sp_amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={dp_amount}
                                  name="dp_amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={jodi_amount}
                                  name="jodi_amount"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(evnt) => handleChange(index, evnt)}
                                  value={tp_amount}
                                  name="tp_amount"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div>
                    {timezone != "" && tabActive != "" && tabActive == "entry" ? (
                      <button
                        className="btn btn-outline-success "
                        onClick={addInputField}
                      >
                        Add New
                      </button>
                    ) : (
                      ""
                    )}
                    </div>
                  </>
                ) : (
                  ""
                )}
                </div>
                <div className="save-cancel-btn">
                      <button className="save-btn" onClick={saveEntries}>
                        Save
                      </button>
                      <button className="cancel-btn secondary-btn">
                        Cancel
                      </button>
                    </div>
              
              </div>
              
            </div>
          </div>
            <div className={isVisible ? "modal is-visible" : "modal"}>
            <div
              className="modal-overlay modal-toggle customer-toggle"
              onClick={modalOpen}
            >x</div>
            <div className="modal-wrapper modal-transition customer-list-modal">
              <div className="modal-header">
                
                <h2 className="modal-heading"  onClick={modalOpen}>Customers</h2>
                <button className="modal-close modal-toggle">
                  
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-content">
                <div className="customer-list-popup">
          <table>
                <thead>
                  <tr>
                    <th>CID</th>
                    <th>Name</th>
                    <th>Set</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((data, index) => (
                    <tr key={index}>
                      <td>{data.customer_id}</td>
                      <td>{data.name}</td>
                      <td>{data.set}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
