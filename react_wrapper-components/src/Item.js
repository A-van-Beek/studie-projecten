import Wrapper from "./Wrapper";

const Item = () => {
  const lijst = ["item_1", "item_2", "item_3", "item_4"];

  const content = lijst.map((item) => (
    <li>{item}</li>
  ))
  return (
    <Wrapper>
{content}
    </Wrapper>
  );
};

export default Item;
