import './App.css';
import { useState } from "react";
import { useEffect } from "react";

class Customer {
  name: string;
  age: number;
  postcode: string;
  height: number;

  constructor(name: string, age: number, postcode: string, height: number) {
    this.name = name;
    this.age = age;
    this.postcode = postcode;
    this.height = height;
  }
}


function App() {

  const exampleCustomerBob = new Customer("Bob", 50, "CF11 1NJ", 1.4);
  const exampleCustomerBill = new Customer("Bill", 37, "S10 3HJ", 2.0);
  const exampleCustomerHarry = new Customer("Tom", 24, "PL24 3JP", 1.22);
  const exampleCustomerTom = new Customer("Harry", 29, "LD44 8MD", 2.41);
  let exampleCustomerList: Customer[] = [exampleCustomerBob, exampleCustomerBill, exampleCustomerHarry, exampleCustomerTom];

  const [allCustomers, setAllCustomers] = useState<Customer[]>(exampleCustomerList);
  const [singleCustomer, setSingleCustomer] = useState<Customer>(exampleCustomerBob);
  const [singleCustomerIndex, setSingleCustomerIndex] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [showInputDialog, setShowInputDialog] = useState<boolean>(false);

  const [validationPassed, setValidationPassed] = useState<boolean>(false);
  const [validationFeedBack, setValidationFeedBack] = useState<String[]>([]);

  useEffect(() => {
    checkValidation();
  }, [singleCustomer]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let changedCustomer: Customer = { ...singleCustomer };

    if (isEdit) {
      const updatedCustomers = allCustomers.map((c, i) => {
        if (i == singleCustomerIndex) {
          return changedCustomer;
        } else {
          return c;
        }
      });
      setAllCustomers(updatedCustomers);

    } else {
      setAllCustomers( // Replace the state
        [ // with a new array
          ...allCustomers, // that contains all the old items
          changedCustomer // and one new item at the end
        ]
      );
    };
    setShowInputDialog(false);

  }

  function addButton() {
    setShowInputDialog(true);
    setIsEdit(false);

    const emptyCustomer = new Customer("", 0, "", 0);
    setSingleCustomer(emptyCustomer);

  }

  function editButton(index: number) {

    setShowInputDialog(true);
    setIsEdit(true);

    let allCustomersList: Customer[] = { ...allCustomers };
    setSingleCustomer(allCustomersList[index]);
    setSingleCustomerIndex(index);
  }
  function cancelButton() {
    setShowInputDialog(false);
  }

  const handleChange = (event: any, fieldName: string) => {
    const Value = event.target.value;

    let customer: Customer = { ...singleCustomer };

    switch (fieldName) {
      case "name":
        customer.name = Value;
        break;
      case "age":
        customer.age = Value;
        break;
      case "postcode":
        customer.postcode = Value;
        break;
      case "height":
        customer.height = Value;
        break;
    }

    setSingleCustomer(customer);

  }


  function checkValidation() {
    var isValid: boolean = true;
    var validationFeedBack: string[] = [];

    if (!singleCustomer.name || singleCustomer.name.length > 50) {
      isValid = false;
      validationFeedBack.push("Name must be less than or equal to 50 characters")
    }
    if (!singleCustomer.age || singleCustomer.age < 0 || singleCustomer.age > 110) {
      isValid = false;
      validationFeedBack.push("Age must be between 0 and 110")
    }
    if (!(/\d/.test(singleCustomer.postcode) && /[a-zA-Z]/g.test(singleCustomer.postcode))) {
      isValid = false;
      validationFeedBack.push("Postcode must contain numbers and characters")
    }
    if (!singleCustomer.height || singleCustomer.height <= 0 || singleCustomer.height > 2.5 || countDecimals(singleCustomer.height) > 2) {
      isValid = false;
      validationFeedBack.push("Height must be 0 to 2.50. Only 2 decimal places")
    }

    setValidationPassed(isValid);
    setValidationFeedBack(validationFeedBack);
  }

  function countDecimals(num: number) {
    try {
      if (Math.floor(num.valueOf()) === num.valueOf()) return 0;
      return num.toString().split(".")[1].length || 0;
    }
    catch {
      return 0;
    }
  }

  return (
    <div className="App">
      <header>
        <p>
          Theodore Blakey- Software Test
        </p>
        <h2>
          Customer Table
        </h2>
      </header>


      <table id="customers">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>PostCode</th>
            <th>Height</th>
            <th></th>
          </tr>
        </thead>
        <tbody>

          {allCustomers.map((cus, i) => (
            <tr key={cus.name + i} onClick={() => editButton(i)}>
              <td>{cus.name}</td>
              <td>{cus.age}</td>
              <td>{cus.postcode}</td>
              <td>{cus.height}</td>
              <td>
                <button onClick={() => editButton(i)}>EDIT</button>
              </td>
            </tr>
          ))}

        </tbody>
      </table>

      <div><br></br></div>
      <button onClick={addButton}>Add New Customer </button>

      <dialog open={showInputDialog}>
        <h2>{isEdit ? "Edit Existing Customer" : "Add New Customer"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Name :
            <input
              type="text"
              value={singleCustomer.name}
              onChange={(e) => handleChange(e, "name")}
            />
          </label>
          <label> Age :
            <input
              type="number"
              value={singleCustomer.age}
              onChange={(e) => handleChange(e, "age")}
            />
          </label>
          <label> PostCode :
            <input
              type="text"
              value={singleCustomer.postcode}
              onChange={(e) => handleChange(e, "postcode")}
            />
          </label>
          <label> Height in meters :
            <input
              type="number"
              value={singleCustomer.height}
              onChange={(e) => handleChange(e, "height")}
            />
          </label>
          <input disabled={!validationPassed} type="submit" value="OK" />
        </form>

        <button onClick={cancelButton}>CANCEL</button>
        <ul>
          {validationFeedBack.map((feedback, i) => (
            <li key={i + "fb"}>
              {feedback}
            </li>
          ))}
        </ul>
      </dialog>

    </div >

  );
}

export default App;
