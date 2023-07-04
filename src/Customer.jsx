import { React, useEffect, useState } from "react";
import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useNavigate } from "react-router-dom";
import delet from './assets/delet.svg';
import edit from './assets/edit.svg';
import { toast } from 'react-toastify';

export default function Customer() {
  const navigate = useNavigate();

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
  const addFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);


  };

  const editFormHandler = (event) => {
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData1 = { ...editCustomer };
    newFormData1[fieldName] = fieldValue;
    setEditCustomer(newFormData1);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    addNote();
    navigate("/entry");
    modalOpen('addCustomer');
  };
  const updateHandler = (event) => {
    updateCustomer();
    event.preventDefault();
  
    modalOpen('editCustomer');
  };


  const [setData, updateSetData] = useState([]);

  const addnewcustomer = async (customers) => {
    setcustomers([...customers]);
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    toast.success('Customer added successfully');
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
    addnewcustomer([{ ...addFormData }, ...customers]);
  
  };


  const updateCustomer = async () => {
    customers = customers.map((obj) => {
      if (obj.id == editCustomer.id) {
        return {
          ...editCustomer
        };
      }
      //else return the object
      return { ...obj };
    });
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    toast.success('Customer updated successfully');
    getNotesFromFile();
  };

  const onChangeSet = async (e) => {
    const fdata = setData.filter((item) => item.set === e.target.value);
    const newFormData = { ...addFormData };
    newFormData["commission"] = fdata[0] ? fdata[0]["commission"] : "";
    newFormData["dp"] = fdata[0] ? fdata[0]["dp"] : "";
    newFormData["jodi"] = fdata[0] ? fdata[0]["jodi"] : "";
    newFormData["multiple"] = fdata[0] ? fdata[0]["multiple"] : "";
    newFormData["pana"] = fdata[0] ? fdata[0]["pana"] : "";
    newFormData["partnership"] = fdata[0] ? fdata[0]["partnership"] : "";
    newFormData["set"] = fdata[0] ? fdata[0]["set"] : "";
    newFormData["tp"] = fdata[0] ? fdata[0]["tp"] : "";
    newFormData["sp"] = fdata[0] ? fdata[0]["sp"] : "";
    setAddFormData(newFormData);
  };
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


  const deletehandler = async (id) => {
    customers = customers.filter(function (a) {
      return a.id != id;
    });
    console.log(customers);
    await writeTextFile(
      { path: "customers.json", contents: JSON.stringify(customers) },
      { dir: BaseDirectory.Resource }
    );
    getNotesFromFile();
    toast.success('Customer deleted successfully');
    modalOpen('deleteCustomer');
  }


  // customers
  var [customers, setcustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState({});
  const [deleteCustomerID, setDeleteCustomerID] = useState("");


  const handleEditCustomer = (id, param) => {
    let tmp = customers.filter((item) => item.id === id)
    setEditCustomer(tmp[0]);
    modalOpen(param);
  }


  const [isVisible, setIsVisible] = useState({ addCustomer: false, editCustomer: false, deleteCustomer: false });
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




  return (
    <>
      <main>
        <div className="customer-main-sec">
      
          <div className="customer-list">
            <table>
              <thead>
                <tr>
                  <th>CID</th>
                  <th>Name</th>
                  <th>Set</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((data, index) => (
                  <tr key={index}>
                    <td>{data.customer_id}</td>
                    <td>{data.name}</td>
                    <td>{data.set}</td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => handleEditCustomer(data.id, 'editCustomer')}>
                          <img src={edit} alt="" />
                        </button>
                        <button onClick={() => {
                          modalOpen('deleteCustomer')
                          setDeleteCustomerID(data.id)
                        }
                        }>
                          <img src={delet} alt="" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="customer-add-frame">
          <div className="add-button">
                    <button type="button" onClick={()=>modalOpen('addCustomer')}> Add customer </button>
                  </div>
            {/* <div className="add-customer-popup">
         
              <div className="add-customer-header">
                <h4>Add new customer</h4>
              </div>
              <div className="customer-body">
                <form onSubmit={submitHandler}>
                  <div className="add-customer-body">
                    <div className="add-suctomer-left">
                      <div className="customer-id">
                        <label htmlFor="customer">Customer ID</label>
                        <input
                          type="number"
                          step="any"
                          name="customer_id"
                          placeholder="Enter customer ID"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer name">Customer Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter customer name"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 1</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile1"
                          placeholder="Enter mobile number"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 2</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile2"
                          placeholder="Enter mobile number"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div className="address">
                        <label htmlFor="textarea">Address</label>
                        <textarea

                          name="address"
                          placeholder="Enter customer address"
                          cols="8"
                          rows="5"
                          onChange={addFormHandler}
                        ></textarea>
                      </div>
                      <div>
                        <label>Limit</label>
                        <input
                          type="number"
                          step="any"
                          name="limit"
                          placeholder="Enter limit"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                    </div>

                    <div className="add-suctomer-right">
                      <div className="customer-set">
                        <label htmlFor="set">Set</label>
                        <select
                          name="set"
                          id="set"
                          onChange={onChangeSet}
                          required
                        >
                          <option key={0} value={""}>
                            Select Set
                          </option>
                          {setData.map((data, index) => (
                            <option key={index + 1} value={data.set}>
                              {data.set}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="commission">Commision</label>
                        <input
                          type="number"
                          step="any"
                          name="commission"
                          value={addFormData ? addFormData.commission : ""}
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
                          value={addFormData ? addFormData.pana : ""}
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
                          value={addFormData ? addFormData.partnership : ""}
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
                          value={addFormData ? addFormData.multiple : ""}
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
                          value={addFormData ? addFormData.sp : ""}
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
                          value={addFormData ? addFormData.dp : ""}
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
                          value={addFormData ? addFormData.jodi : ""}
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
                          value={addFormData ? addFormData.tp : ""}
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="add-button">
                    <button type="submit"> Add customer </button>
                  </div>
                </form>
              </div>
            </div> */}
          </div>
        </div>
        <div className={isVisible.addCustomer ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('addCustomer')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('addCustomer')}>Add customer</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
              <div className="">
            <div className="add-customer-popup">
            
              <div className="customer-body">
                <form onSubmit={submitHandler}>
                  <div className="add-customer-body">
                    <div className="add-suctomer-left">
                      <div className="customer-id">
                        <label htmlFor="customer">Customer ID</label>
                        <input
                          type="number"
                          step="any"
                          name="customer_id"
                          placeholder="Enter customer ID"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer name">Customer Name</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter customer name"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 1</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile1"
                          placeholder="Enter mobile number"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="customer number">Mobile Number 2</label>
                        <input
                          type="number"
                          step="any"
                          name="mobile2"
                          placeholder="Enter mobile number"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                      <div className="address">
                        <label htmlFor="textarea">Address</label>
                        <textarea

                          name="address"
                          placeholder="Enter customer address"
                          cols="8"
                          rows="5"
                          onChange={addFormHandler}
                        ></textarea>
                      </div>
                      <div>
                        <label>Limit</label>
                        <input
                          type="number"
                          step="any"
                          name="limit"
                          placeholder="Enter limit"
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                    </div>

                    <div className="add-suctomer-right">
                      <div className="customer-set">
                        <label htmlFor="set">Set</label>
                        <select
                          name="set"
                          id="set"
                          onChange={onChangeSet}
                          required
                        >
                          <option key={0} value={""}>
                            Select Set
                          </option>
                          {setData.map((data, index) => (
                            <option key={index + 1} value={data.set}>
                              {data.set}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="commission">Commision</label>
                        <input
                          type="number"
                          step="any"
                          name="commission"
                          value={addFormData ? addFormData.commission : ""}
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
                          value={addFormData ? addFormData.pana : ""}
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
                          value={addFormData ? addFormData.partnership : ""}
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
                          value={addFormData ? addFormData.multiple : ""}
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
                          value={addFormData ? addFormData.sp : ""}
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
                          value={addFormData ? addFormData.dp : ""}
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
                          value={addFormData ? addFormData.jodi : ""}
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
                          value={addFormData ? addFormData.tp : ""}
                          onChange={addFormHandler}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="add-button">
                    <button type="submit"> Add customer </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
              </div>
            </div>
          </div>
        </div>
        <div className={isVisible.editCustomer ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('editCustomer')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('editCustomer')}>Edit customer</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
                <div className="">
                  <div className="add-customer-popup">

                    <div className="customer-body">
                      <form onSubmit={updateHandler}>
                        <div className="add-customer-body">
                          <div className="add-suctomer-left">
                            <div className="customer-id">
                              <label htmlFor="customer">Customer ID</label>
                              <input
                                type="number"
                                step="any"
                                name="customer_id"
                                value={editCustomer.customer_id}
                                placeholder="Enter customer ID"
                                onChange={editFormHandler}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="customer name">Customer Name</label>
                              <input
                                type="text"
                                name="name"
                                placeholder="Enter customer name"
                                value={editCustomer.name}
                                onChange={editFormHandler}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="customer number">Mobile Number 1</label>
                              <input
                                type="number"
                                step="any"
                                name="mobile1"
                                value={editCustomer.mobile1}
                                placeholder="Enter mobile number"
                                onChange={editFormHandler}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="customer number">Mobile Number 2</label>
                              <input
                                type="number"
                                step="any"
                                name="mobile2"
                                value={editCustomer.mobile2}
                                placeholder="Enter mobile number"
                                onChange={editFormHandler}
                                required
                              />
                            </div>
                            <div className="address">
                              <label htmlFor="textarea">Address</label>
                              <textarea

                                name="address"
                                placeholder="Enter customer address"
                                cols="8"
                                value={editCustomer.address}
                                rows="5"
                                onChange={editFormHandler}
                              ></textarea>
                            </div>
                            <div>
                              <label>Limit</label>
                              <input
                                type="number"
                                step="any"
                                name="limit"
                                placeholder="Enter limit"
                                onChange={editFormHandler}
                                value={editCustomer.limit}
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="set">Set</label>
                              <select
                                name="set"
                                id="set"
                                value={editCustomer.set}
                                onChange={editFormHandler}
                                required
                              >
                                <option key={0} value={""}>
                                  Select Set
                                </option>
                                {setData.map((data, index) => (
                                  <option key={index + 1} value={data.set}>
                                    {data.set}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="add-button">
                          <button type="submit"> Update customer </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={isVisible.deleteCustomer ? "modal is-visible" : "modal"}>
          <div
            className="modal-overlay modal-toggle customer-toggle"
            onClick={() => modalOpen('deleteCustomer')}
          >x</div>
          <div className="modal-wrapper modal-transition">
            <div className="modal-header">

              <h2 className="modal-heading" onClick={() => modalOpen('deleteCustomer')}>Delete customer</h2>
              <button className="modal-close modal-toggle">

              </button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
                <div className="">
                  Are you sure you want to delete this customer!
                </div>
                <button onClick={() =>deletehandler(deleteCustomerID)}>Yes</button>
                <button onClick={() =>modalOpen('deleteCustomer')}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
