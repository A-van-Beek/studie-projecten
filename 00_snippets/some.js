function isBiggerThan10(element, index, array) {
  return element > 10;
}

[2, 5, 8, 1, 4].some(isBiggerThan10); // false
[12, 5, 8, 1, 4].some(isBiggerThan10); // true



// =========================================================================
// eigen prutswerk
// =========================================================================

const selected = [
    {category: "activiteit", kenmerkWaarde: "natuur aantasten"},
    {category: "gebied", kenmerkWaarde: "natuur ophogen"},
    {category: "gebied", kenmerkWaarde: "natuur verwijderen"}
]

const results = selected.some(element => {
    return element.category === "gebied" && element.kenmerkWaarde === "natuur ophogen"
})


const lijstItems = [
    {category: "activiteit", kenmerkWaarde: "natuur aantasten"},
    {category: "gebied", kenmerkWaarde: "natuur ophogen"},
    {category: "thema", kenmerkWaarde: "zwemmen"},
    {category: "activiteit", kenmerkWaarde: "winkelen"},
    {category: "gebied", kenmerkWaarde: "opschonen"},
]

lijstItems.map((item, i) => {
    console.log("item", item)
    const result3 = selected.some(element => {
        return element.category === item.category && element.kenmerkWaarde === item.kenmerkWaarde
    })
    console.log("!!", result3)
})
