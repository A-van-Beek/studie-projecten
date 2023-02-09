// import React from "react";
import "./ExpenseItem.css";
import Card from "./Card";
import ExpenseDate from "./ExpenseDate";

function ExpenseItem(props) {
    const content = (
        <Card className="expense-item">
          <ExpenseDate date={props.date} />
          <div className="expense-item__description">
            <h2>{props.title}</h2>
            <div className="expense-item___price">$ {props.amount}</div>
          </div>
        </Card>
      )
  return content;
}

export default ExpenseItem;
