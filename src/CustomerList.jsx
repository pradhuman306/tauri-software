import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

export default function CustomerList() {
  const [customers, setcustomers] = useState([]);
  const [filtercustomers, setFiltercustomers] = useState([]);
  const [searchText, setSearchText] = useState("");

  function filterData(searchText, userData) {
    const data = userData.filter((item) =>
      item?.name.toLowerCase().includes(searchText.toLowerCase())
    );
    return data;
  }

  const searchData = (searchText, userData) => {
    if (searchText !== "") {
      const data = filterData(searchText, userData);
      setcustomers(data);
      if (data.length === 0) {
        console.log("not found any record");
      }
    } else {
      setcustomers(userData);
    }
  };

  useEffect(() => {
    const getNotesFromFile = async () => {
      try {
        const myfileNotes = await readTextFile("customers.json", {
          dir: BaseDirectory.Resource,
        });
        const mycustomers = JSON.parse(myfileNotes);
        setcustomers(mycustomers);
        setFiltercustomers(mycustomers);
      } catch (error) {
        await writeTextFile(
          { path: "customers.json", contents: JSON.stringify(customers) },
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
      <main>
        <div className="container">
          <div className="add-customer-popup">
            <div className="add-customer-header">
              <h4>Add new customer</h4>
            </div>
            <div className="customer-body">
              <div>
                <input
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    searchData(e.target.value, filtercustomers);
                  }}
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Set</th>
                    <th>Mobile</th>
                    <th>Limit</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.set}</td>
                      <td>{data.mobile1}</td>
                      <td>{data.limit}</td>
                      <td>{data.address}</td>
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
