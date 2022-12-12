import verificaIgualdade from "./comparar.js";

const containerDiv = document.getElementById("container");

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

async function fetchData() {
  let response = await fetch("./exemplo_json-_erro.json");
  let responseJson = await response.json();
  let arrayDifference = verificaIgualdade(responseJson[0], responseJson[1]);
  if (arrayDifference.length == 0) {
    containerDiv.innerHTML = "Nenhuma diferença";
  } else {
    arrayDifference.map((element) => createTable(containerDiv, element));
  }
}
const createTable = (container, arrayDiff) => {
  let table = document.createElement("table");
  table.className = "tbl";
  table.setAttribute("border", 2);
  table.innerHTML = createTableHeader();
  table.appendChild(createTableBody(arrayDiff));
  container.appendChild(table);
};
const createTableHeader = () => {
  return `
 <thead>
    <th>Log</th>
    <th>Chave</th>
    <th>Valor</th>
</thead>`;
};
const createTableBody = (arrayDiff) => {
  let tBody = document.createElement("tbody");
  let obj1 = arrayDiff[0];
  let obj2 = arrayDiff[1];
  tBody.innerHTML += `
    <tr>
    <td>Log ${obj1.Objeto}</td>
    <td>${obj1.key}</td>
    <td>${highlight(obj1?.xValue ?? "", obj2?.yValue ?? "")}</td>
    </tr>
    <tr>
    <td>Log ${obj2.Objeto}</td>
    <td>${obj2.key}</td>
    <td>${highlight(obj2?.yValue ?? "", obj1?.xValue ?? "")}</td>
    </tr>
  `;
  return tBody;
};
/*https://stackoverflow.com/questions/38037163/how-to-highlight-the-difference-of-two-texts-with-css*/
function highlight(newElem, oldElem) {
  var oldText = String(oldElem),
    text = "";
  String(newElem)
    .split("")
    .forEach(function (val, i) {
      if (val != oldText.charAt(i))
        text += "<span class='highlight'>" + val + "</span>";
      else text += val;
    });
  return text;
}
