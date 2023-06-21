import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export default function Calculater() {
  const [customers, setcustomers] = useState([]);
  useEffect(() => {
    const getNotesFromFile = async () => {
      try {
        const myfiledata = await readTextFile("customers.json", {
          dir: BaseDirectory.Resource,
        });
        const mycust = JSON.parse(myfiledata);
        setcustomers(mycust);
        console.log("Notes list rendered");
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

  const onChangeSet = async (e) => {
    const cdata = customers.filter(
      (item) => item.customer_id === e.target.value
    );
    setCID(e.target.value);
    const newFormData = { ...addFormData };
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
  };

  useEffect(() => {
    console.log(addFormData);
  }, [addFormData]);

  return (
    <>
      <Navbar />
      <main>
        <div className="container calculater">
          <h4>Calculater</h4>
          <table>
            <thead>
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
            </thead>
            <tbody>
              <tr>
                <td>
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
                </td>
                <td>
                  Set
                  <br />
                  <input type="number" />
                </td>
                <td>
                  Cummision
                  <br />
                  <input type="number" />
                </td>
                <td>
                  Multiple
                  <br />
                  <input type="number" />
                </td>
                <td>
                  SP
                  <br />
                  <input type="number" />
                </td>
                <td>
                  DP
                  <br />
                  <input type="number" />
                </td>
                <td>
                  J<br />
                  <input type="number" />
                </td>
                <td>
                  TP
                  <br />
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="customer id"> Customer ID</label>
                  <br />
                  <select
                    value={selectedCId}
                    name="customer"
                    id="customer"
                    className="customer-name"
                    onChange={onChangeSet}
                    required
                  >
                    <option key={0} value={""}>
                      Select ID
                    </option>
                    {customers.map((data, index) => (
                      <option key={index + 1} value={data.customer_id}>
                        {data.customer_id}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  Partnership
                  <br />
                  <input type="number" />
                </td>
                <td colSpan="6" className="align-left">
                  Pana cummision
                  <br />
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>
                  <input type="date" />
                </td>
                <td>Ammount</td>
                <td>Pana-Amount</td>
                <td>Kh</td>
                <td>SP-Amount</td>
                <td>DP-Amount</td>
                <td>J-Amount</td>
                <td>TP-Amount</td>
              </tr>
              <tr>
                <td>To</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>TK</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>MO</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>KO</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>MK</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>KK</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>A1</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td className="custom-padding">Total-1</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>MO</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>BA</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>MK</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>BK</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>A2</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td className="custom-padding">Total-2</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>Final Total</td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
                <td>
                  <input type="number" />
                </td>
              </tr>
              <tr>
                <td>Total Amount</td>
                <td colSpan="4" className="align-left">
                  <input type="number" />
                </td>
                <td colSpan="3" className="align-left">
                  <input type="number" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
