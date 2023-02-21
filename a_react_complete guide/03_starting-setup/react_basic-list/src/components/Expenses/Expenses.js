import "./Expenses.css";
import ExpenseItem from "./ExpenseItem";
import Card from "../UI/Card";

const Expenses = (props) => {
  const content = props.expenses.map((item, idx) => (
    <ExpenseItem key={idx} title={item.title} amount={item.amount} date={item.date} />
  ));
  return <Card className="expenses">{content}</Card>;
}

export default Expenses;
