import React, { useState, useEffect } from "react";
import axios from 'axios';
const Calculator = () => {
  
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState(0);
  const [num10, setNum10] = useState(0);
  const [num20, setNum20] = useState(0);
  const [result0, setResult0] = useState(0);
  const [num11, setNum11] = useState(0);
  const [num22, setNum22] = useState(0);
  const [result1, setResult1] = useState(0);
  const [num12, setNum12] = useState(0);
  const [num23, setNum23] = useState(0);
  const [result2, setResult2] = useState(0);
  
  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    const response = await axios.get(`http://localhost:8080/calculator`)
    const data = await response.data;
    console.log(data)
    setNum1(data.Operations[0].Parameters[0].Value);
    setNum2(data.Operations[0].Parameters[1].Value);
    setResult(data.Operations[0].Result);
    setNum10(data.Operations[1].Parameters[0].Value);
    setNum20(data.Operations[1].Parameters[1].Value);
    setResult0(data.Operations[1].Result);
    setNum11(data.Operations[2].Parameters[0].Value);
    setNum22(data.Operations[2].Parameters[1].Value);
    setResult1(data.Operations[2].Result);
    setNum12(data.Operations[2].Parameters[0].Value);
    setNum23(data.Operations[2].Parameters[1].Value);
    setResult2(data.Operations[3].Result);


  };

  const updateValues = async (newNum1, newNum2,newNum10,newNum20,newNum11,newNum22,newNum12,newNum23) => {
  let newdata={"XMLName":{"Space":"","Local":"calculator"},"Operations":[{"Name":"add","Parameters":[{"Name":"num1","Value":''+newNum1},{"Name":"num2","Value":''+newNum2}],"Result":''+result},{"Name":"subtract","Parameters":[{"Name":"num1","Value":''+newNum10},{"Name":"num2","Value":''+newNum20}],"Result":''+result0},{"Name":"multiply","Parameters":[{"Name":"num1","Value":''+newNum11},{"Name":"num2","Value":''+newNum22}],"Result":''+result1},{"Name":"Divide","Parameters":[{"Name":"num1","Value":''+newNum12},{"Name":"num2","Value":''+newNum23}],"Result":''+result2}]}
  console.log(newdata)
  
    const response = await axios.post("http://localhost:8080/calculator",newdata);
  
  };

  const handleNum1Change = (e) => {
    setNum1(parseFloat(e.target.value));
    

  };

  const handleNum2Change = (e) => {
    setNum2(parseFloat(e.target.value));

  };
  const handleNum10Change = (e) => {
    setNum10(parseFloat(e.target.value));
    

  };

  const handleNum20Change = (e) => {    setNum20(parseFloat(e.target.value));

  };
  const handleNum11Change = (e) => {
    setNum11(parseFloat(e.target.value));
    

  };

  const handleNum22Change = (e) => {
    setNum22(parseFloat(e.target.value));

  };
  const handleNum12Change = (e) => {
    setNum12(parseFloat(e.target.value));
    

  };

  const handleNum23Change = (e) => {
    setNum23(parseFloat(e.target.value));

  };

  const handleAdd = () => {
    setResult(parseInt(num1) + parseInt(num2));
  };

  const handleSubtract = () => {
    setResult0(num10 - num20);
  };

  const handleMultiply = () => {
    setResult1(num11 * num22);
  };

  const handleDivide = () => {
    setResult2(num12 / num23);
  };

  const handleUpdate = () => {
    updateValues(num1, num2,num10, num20,num11, num22,num12, num23);


    // updateValues(num10, num20);
    // updateValues(num11, num22);
    // updateValues(num12, num23);
  };

  return (
    <div>
      <h2>Calculator</h2>
      <div>
        <label>Number 1:</label>
        <input type="number" value={num1} onChange={handleNum1Change} />
      </div>
      <div>
        <label>Number 2:</label>
        <input type="number" value={num2} onChange={handleNum2Change} />
      </div>
      <div>
        <button onClick={handleAdd}>Add</button>
      </div>
      <div>
        <label>Result:</label>
        <input type="number" value={result} readOnly />
      </div>
      <div>
        <label>Number 1:</label>
        <input type="number" value={num10} onChange={handleNum10Change} />
      </div>
      <div>
        <label>Number 2:</label>
        <input type="number" value={num20} onChange={handleNum20Change} />
      </div>
      <div>
        <button onClick={handleSubtract}>Subtract</button>
      </div>
      <div>
        <label>Result:</label>
        <input type="number" value={result0} readOnly />
      </div>
      <div>
        <label>Number 1:</label>
        <input type="number" value={num11} onChange={handleNum11Change} />
      </div>
      <div>
        <label>Number 2:</label>
        <input type="number" value={num22} onChange={handleNum22Change} />
      </div>
      <div>
        <button onClick={handleMultiply}>Multiply</button>
      </div>
      <div>
        <label>Result:</label>
        <input type="number" value={result1} readOnly />
      </div>
      <div>
        <label>Number 1:</label>
        <input type="number" value={num12} onChange={handleNum12Change} />
      </div>
      <div>
        <label>Number 2:</label>
        <input type="number" value={num23} onChange={handleNum23Change} />
      </div>
      <div>
        <button onClick={handleDivide}>Divide</button>
      </div>
      <div>
        <label>Result:</label>
        <input type="number" value={result2} readOnly />
      </div>
      <div>
        <button onClick={handleUpdate}>Update Values</button>
      </div>
    </div>
  );
};

export default Calculator;
