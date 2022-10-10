/* ==========================
conditional expression 
voorkeur van Reijer
========================== */
let toggleSlider;
if (showSlider) {
  toggleSlider = <div className="cp-activateSearch">hier je tekst....</div>;
}

/* ==========================
The ternary operator is a simplified conditional operator like if / else.

Syntax: condition ? <expression if true> : <expression if false>
- If showList is true then show 'Hide List' text
- showList is false then show 'Show List' text 
========================== */
{
  showList ? "Hide List" : "Show List";
}

/* ==========================
short circuit condition (in a react application) 
Syntax: { condition && (Html or subcomponents to render) }
========================== */
const show = true;
{
  show && <h1>I am rendering in the browser</h1>;
}

/* ==========================
We can insert multiple conditions with the && (and) operator to rendering or not
- showList have a true value && (and) also isFernandoFriend have a true value?
- YES! both have a true value, then ---> rendering! 
- NO!  one of this variables have a false value  ---> Don't rendering!, never rendering!
========================== */
{
  showList && isFernandoFriend && (
    <ul className={classes.list}>
      {data.map((friend, index) => {
        return <li key={`friend-${index}`}>{friend.name}</li>;
      })}
    </ul>
  );
}

/* ==========================
We can insert multiple conditions with the || (or) operator to rendering or not
- showList have a true value? || (or) isFernandoFriend have a true value? || (or) isAlmaFriend have a true value?
- YES! if one of this variables have a true value, then ---> rendering!
- NO!  if all of this variables have a false value  ---> Don't rendering!, never rendering!
========================== */
{
  (showList || isFernandoFriend || isAlmaFriend) && (
    <ul className={classes.list}>
      {data.map((friend, index) => {
        return <li key={`friend-${index}`}>{friend.name}</li>;
      })}
    </ul>
  );
}
