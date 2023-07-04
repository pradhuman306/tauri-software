import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";





export default function Home() {
  const [setData, updateSetData] = useState([]);
  var [customers, setcustomers] = useState([]);

const getNotesFromFile = async () => {
  try {
    const myfilesets = await readTextFile("set.json", {
      dir: BaseDirectory.Resource,
    });
    const mysetData = JSON.parse(myfilesets);
    updateSetData(mysetData);
  } catch (error) {
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(setData) },
      { dir: BaseDirectory.Resource }
    );
    console.log(error);
  }

  try {
    const myfiledata = await readTextFile("customers.json", {
      dir: BaseDirectory.Resource,
    });
    const mycustomers = JSON.parse(myfiledata);
    setcustomers(mycustomers);
  } catch (error) {
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    console.log(error);
  }
};
useEffect(() => {
  getNotesFromFile();
}, []);
  return (
    <>
      <main className="container">
        <h1>Dashboard</h1>
        <div className="row">
          <div className="col-md-4">
            <h3>Total Balance</h3>
          </div>
          <div className="col-md-4">
            <h3>Total Customer</h3>
            {customers.length+'+'}
          </div>
          <div className="col-md-4">
            <h3>Total Set</h3>
            {setData.length+'+'}
          </div>
        </div>
      </main>
    </>
  );
}
