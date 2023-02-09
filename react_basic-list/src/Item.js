const Item = () => {
  const lijst = ["item_1", "item_2", "item_3", "item_4"];

  return (
    <ul>
      {lijst.map((item, idx) => (
        <li>{item}</li>
      ))}
    </ul>
  );
};

export default Item;
