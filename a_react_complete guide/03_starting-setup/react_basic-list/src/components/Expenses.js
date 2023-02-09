import "./Expenses.css";
import ExpenseItem from "./ExpenseItem";
import Card from "./Card";

function Expenses(props) {
  console.log("props", props);
  const content = props.expenses.map((item) => (
    <ExpenseItem title={item.title} amount={item.amount} date={item.date} />
  ));
  return <Card className="expenses">{content}</Card>;
}

export default Expenses;
