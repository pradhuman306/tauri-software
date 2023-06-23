import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";

export default function Set() {
  const navigate = useNavigate();

  const [addFormData, setAddFormData] = useState({});
  const addFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    addNote();
    navigate("/customer");
  };

  const [setData, updateSetdata] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const modalOpen = () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  const modalAction = () => {
    setIsVisible(false);
  };
  const updateData = async (data) => {
    updateSetdata([...data]);
    await writeTextFile(
      { path: "set.json", contents: JSON.stringify(data) },
      { dir: BaseDirectory.Resource }
    );
  };

  const addNote = async () => {
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    // addFormData.date = datetime;
    addFormData.date = new Date(Date.now());
    addFormData.id = Date.now();
    updateData([{ ...addFormData }, ...setData]);
  };

  useEffect(() => {
    const getdataFromFile = async () => {
      try {
        const myfiledata = await readTextFile("set.json", {
          dir: BaseDirectory.Resource,
        });
        const mydata = JSON.parse(myfiledata);
        updateSetdata(mydata);
      } catch (error) {
        await writeTextFile(
          { path: "set.json", contents: JSON.stringify(setData) },
          { dir: BaseDirectory.Resource }
        );
        getdataFromFile();
        console.log(error);
      }
    };
    getdataFromFile();
  }, []);

  return (
    <>
      <main>
        <div className="container">
          <div className="add-customer-popup">
            <div className="add-customer-header">
              <h4>Add new Set</h4>
            </div>
            <div className="customer-body">
              <form onSubmit={submitHandler}>
                <div className="add-customer-body">
                  <div className="add-suctomer-right">
                    <div className="customer-set">
                      <label htmlFor="set">Set</label>
                      <input
                        type="number"
                        step="any"
                        name="set"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="commission">Commision</label>
                      <input
                        type="number"
                        step="any"
                        name="commission"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pana">Pana</label>
                      <input
                        type="number"
                        step="any"
                        name="pana"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="partnership">Partmership</label>
                      <input
                        type="number"
                        step="any"
                        name="partnership"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="multiple">Multiple</label>
                      <input
                        type="number"
                        step="any"
                        name="multiple"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sp">SP</label>
                      <input
                        type="number"
                        step="any"
                        name="sp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="dp">DP</label>
                      <input
                        type="number"
                        step="any"
                        name="dp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="jodi">JODI</label>
                      <input
                        type="number"
                        step="any"
                        name="jodi"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="tp">TP</label>
                      <input
                        type="number"
                        step="any"
                        name="tp"
                        onChange={addFormHandler}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="add-button">
                  <button type="submit">Add Set</button>
                </div>
              </form>
            </div>
          </div>
          <button onClick={modalOpen}>Modal Open</button>
          <div className={isVisible ? "modal is-visible" : "modal"}>
            <div
              className="modal-overlay modal-toggle"
              onClick={modalOpen}
            ></div>
            <div className="modal-wrapper modal-transition">
              <div className="modal-header">
                <button className="modal-close modal-toggle">
                  <svg className="icon-close icon" viewBox="0 0 32 32"></svg>
                </button>
                <h2 className="modal-heading">This is a modal</h2>
              </div>
              <div className="modal-body">
                <div className="modal-content">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Impedit eum delectus, libero, accusantium dolores inventore
                    obcaecati placeat cum sapiente vel laboriosam similique
                    totam id ducimus aperiam, ratione fuga blanditiis maiores.
                  </p>
                  <button className="modal-toggle" onClick={modalAction}>
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
