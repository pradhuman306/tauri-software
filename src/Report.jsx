import { React, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";

export default function Report() {
  const [entires, setentires] = useState([]);

  useEffect(() => {
    const getNotesFromFile = async () => {
      try {
        const myfileNotes = await readTextFile("entires.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustomers = JSON.parse(myfileNotes);
        setentires(mycustomers);
        console.log(mycustomers);
        console.log("entires list rendered");
      } catch (error) {
        await writeTextFile(
          { path: "entires.json", contents: JSON.stringify(entires) },
          { dir: BaseDirectory.Resource }
        );
        getNotesFromFile();
        console.log(error);
      }
    };
    getNotesFromFile();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <div className="container">
          <div>
            <div className="report-header">
              <h4>Report</h4>
            </div>
            <div className="report-body">
              <table>
                <thead>
                  <tr>
                    <th>CID</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Timezone</th>
                    <th>Amount</th>
                    <th>Pana amount</th>
                    <th>khula amount</th>
                    <th>sp amount</th>
                    <th>dp amount</th>
                    <th>jodi amount</th>
                    <th>tp amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entires.map((data, index) => (
                    <tr key={index}>
                      <td>{data.customer_id}</td>
                      <td>{data.date}</td>
                      <td>{data.name}</td>
                      <td>{data.timezone}</td>
                      <td>{data.amount}</td>
                      <td>{data.pana_amount}</td>
                      <td>{data.khula_amount}</td>
                      <td>{data.sp_amount}</td>
                      <td>{data.dp_amount}</td>
                      <td>{data.jodi_amount}</td>
                      <td>{data.tp_amount}</td>
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
