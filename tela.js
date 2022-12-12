import verificaIgualdade from "./comparar.js";

var selectedIndex = 0;
var posicaoTabelaSet = new Set();
const containerDivAll = document.getElementById("containerFullList");
const containerDivFiltered = document.getElementById("containerFilteredList");

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  document.getElementById('btn-inicio-pause').addEventListener("click", btnInicioPauseEvento);
  document.getElementById('btn-avancar').addEventListener("click", btnAvancarEvento);
  document.getElementById('btn-voltar').addEventListener("click", btnVoltarEvento);
  document.getElementById('checkboxDiff').addEventListener("click", handleChange);
});

async function fetchData() {
  let responseProduto = await fetch("./exemplo_json.json");
  let json = await responseProduto.json();
  let vetorDiferenca = verificaIgualdade(json[0], json[1]);
  let mapDifferenceObj1 = new Map();
  let mapDifferenceObj2 = new Map();
  vetorDiferenca.forEach((item) => {
    mapDifferenceObj1.set(item[0].key, item[0]);
    mapDifferenceObj2.set(item[1].key, item[1]);
    criarTabelaDiferenca(containerDivFiltered, item);
  })
  criarTabela(containerDivAll, Object.entries(json[0]), mapDifferenceObj1);
  criarTabela(containerDivAll, Object.entries(json[1]), mapDifferenceObj2);
}

//eventos 
const btnAvancarEvento = (event) => {
  if (selectedIndex < posicaoTabelaSet.size - 1) {
    selectedIndex++;
    atualizaEstilosTabela()
  }
}
const btnVoltarEvento = (event) => {
  if (selectedIndex > 0) {
    selectedIndex--;
    atualizaEstilosTabela()
  }
}
const btnInicioPauseEvento = (event) => {
  selectedIndex = 0;
  let btnPausarIniciar = event.srcElement;
  if (btnPausarIniciar.textContent == "Iniciar") {
    atualizaEstilosTabela(false);
    btnPausarIniciar.textContent = "Pausar";
  } else {
    atualizaEstilosTabela(true);
    btnPausarIniciar.textContent = "Iniciar";
  }
}
const handleChange = (event) => {
  let btnContainer = document.getElementById('containerBtn')
  if (event.srcElement.checked) {
    containerDivAll.style.display = "none";
    btnContainer.style.display = "none"
    containerDivFiltered.style.display = "flex";
  }
  else {
    containerDivAll.style.display = "flex";
    btnContainer.style.display = "flex";
    containerDivFiltered.style.display = "none";
  }
}
//
//criar tabelas, separadas em dois sets de funcoes pq nao tive tempo de melhorar
const criarTabela = (container, arrayOriginal, map) => {
  let tabela = document.createElement("table");
  tabela.className = "tbl";
  tabela.setAttribute("border", 2);
  criarHeaderTabela(tabela);
  criarBodyTabela(tabela, arrayOriginal, map)
  container.appendChild(tabela);
}
const criarBodyTabela = (tabela, arrayItem, map) => {
  let tBody = document.createElement("tbody");
  tabela.appendChild(tBody);
  let mapItem = new Map(arrayItem)
  map.forEach((value, key) => {
    if (!mapItem.has(key)) {
      arrayItem.push([key, ""])
    }
  })
  arrayItem.sort();
  arrayItem.map((item) => criarLinhaTabela(item, tBody, map))
}
const criarLinhaTabela = (objeto, tabela, mapDiff) => {
  let row = tabela.insertRow(-1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  if (mapDiff.has(objeto[0])) {
    row.classList.add("diferente");
  }
  cell1.innerHTML = objeto[0];
  cell2.innerHTML = objeto[1];
}
const criarHeaderTabela = (tabela) => {
  let header = tabela.createTHead();
  let row = header.insertRow(0);
  let cell1 = document.createElement("TH");
  let cell2 = document.createElement("TH");
  cell1.innerHTML = "Coluna";
  cell2.innerHTML = "Valor"
  row.appendChild(cell1);
  row.appendChild(cell2)
}
const criarTabelaDiferenca = (container, vetorDiferenca) => {
  container.style.display = "none";
  let tabela = document.createElement("table");
  tabela.className = "tbl";
  tabela.setAttribute("border", 2);
  tabela.innerHTML = criarTabelaHeaderDiferenca();
  tabela.appendChild(criarTabelaBodyDiferenca(vetorDiferenca));
  container.appendChild(tabela);
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
function highlightHTML(newElem, oldElem) {
  var oldText = oldElem.innerText,
    text = '';
  newElem.innerText.split('').forEach(function (val, i) {
    if (val != oldText.charAt(i))
      text += "<span class='highlight'>" + val + "</span>";
    else
      text += val;
  });
  newElem.innerHTML = text;
}
function highlightString(newStr, oldStr) {
  var oldText = String(oldStr),
    text = "";
  String(newStr)
    .split("")
    .forEach(function (val, i) {
      if (val != oldText.charAt(i))
        text += "<span class='highlight'>" + val + "</span>";
      else text += val;
    });
  return text;
}
const atualizaEstilosTabela = (isInitialized) => {
  let [tbl1, tbl2] = document.querySelectorAll('.tbl');
  let btnAvancar = document.getElementById('btn-avancar');
  let btnVoltar = document.getElementById('btn-voltar');
  let checkBoxDiv = document.getElementById('checkboxDiff');

  if (!isInitialized) {
    btnAvancar.disabled = false;
    btnVoltar.disabled = false;
    checkBoxDiv.disabled = true;
    for (let i = 0; i < tbl1.tBodies[0].children.length; i++) {
      let rowTbl1 = tbl1.tBodies[0].children.item(i);
      let rowTbl2 = tbl2.tBodies[0].children.item(i);

      if (rowTbl1.className == "diferente") {
        posicaoTabelaSet.add(i)
      }

      if ([...posicaoTabelaSet][selectedIndex] != i) {
        rowTbl1.style.opacity = 0.4;
        rowTbl1.style.fontSize = "small"
        rowTbl2.style.fontSize = "small";
        rowTbl2.style.opacity = 0.4;
      }
      else {
        rowTbl1.scrollIntoView({ alignToTop: false, behavior: "smooth", block: "center" })
        highlightHTML(rowTbl1.children[1], rowTbl2.children[1]);
        highlightHTML(rowTbl2.children[1], rowTbl1.children[1])
        rowTbl1.style.fontSize = "medium";
        rowTbl1.style.opacity = 1;
        rowTbl2.style.fontSize = "medium";
        rowTbl2.style.opacity = 1;
      }
    }
  }
  else {
    btnAvancar.disabled = true;
    btnVoltar.disabled = true;
    checkBoxDiv.disabled = false;
    for (let i = 0; i < tbl1.tBodies[0].children.length; i++) {
      let rowTbl1 = tbl1.tBodies[0].children.item(i);
      let rowTbl2 = tbl2.tBodies[0].children.item(i);
      rowTbl1.style.opacity = 1;
      rowTbl1.style.fontSize = "small";
      rowTbl2.style.fontSize = "small";
      rowTbl2.style.opacity = 1;
    }
  }
}
