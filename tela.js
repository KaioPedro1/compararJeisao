import verificaIgualdade from "./comparar.js";

var selectedIndex = 0; 
const containerDiv = document.getElementById("container");

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  document.getElementById('btn-inicio-pause').addEventListener("click", btnInicioPauseEvento);
  document.getElementById('btn-avancar').addEventListener("click", btnAvancarEvento);
  document.getElementById('btn-voltar').addEventListener("click", btnVoltarEvento);
});

async function fetchData() {
  let responseProduto = await fetch("./exemplo_json-_erro.json");
  let json = await responseProduto.json();
  let vetorDiferenca = verificaIgualdade(json[0], json[1]);
  vetorDiferenca.map((element) => criarTabela(containerDiv, element));
}

const atualizaEstilosTabela = (isInitialized) => {
  let tblList = document.querySelectorAll('.tbl');
  if (isInitialized) {
    tblList.forEach(tbl => {
      tbl.style.opacity = 1;
      tbl.style.fontSize = "small"
    });
  } else {
    tblList.forEach((tbl, i) => {
      if (i != selectedIndex) {
        tbl.style.opacity = 0.4;
        tbl.style.fontSize = "small"
      }
      else {
        tbl.style.fontSize = "medium";
        tbl.style.opacity = 1;
      }
    });
  }

}
const btnAvancarEvento = (event) => {
  selectedIndex++;
  atualizaEstilosTabela()
}
const btnVoltarEvento = (event) => {
  selectedIndex--;
  atualizaEstilosTabela()
}
const btnInicioPauseEvento = (event) => {
  let btn = event.srcElement;
  if (btn.textContent == "Iniciar") {
    atualizaEstilosTabela(false);
    btn.textContent = "Pausar";
  } else {
    atualizaEstilosTabela(true);
    btn.textContent = "Iniciar";
  }
}

const criarTabela = (container, vetorDiferenca) => {
  let tabela = document.createElement("table");
  tabela.className = "tbl";
  tabela.setAttribute("border", 2);
  tabela.innerHTML = criarTabelaHeader();
  tabela.appendChild(criarTabelaBody(vetorDiferenca));
  container.appendChild(tabela);
};
const criarTabelaHeader = () => {
  return `
 <thead>
    <th>Log</th>
    <th>Chave</th>
    <th>Valor</th>
</thead>`;
};
const criarTabelaBody = (vetorDiferenca) => {
  let tBody = document.createElement("tbody");
  let obj1 = vetorDiferenca[0];
  let obj2 = vetorDiferenca[1];
  tBody.innerHTML += `
    <tr>
    <td>Log ${obj1.Objeto}</td>
    <td>${obj1.key}</td>
    <td>${preencheValor(obj1.xValue, obj2.yValue)}</td>
    </tr>
    <tr>
    <td>Log ${obj2.Objeto}</td>
    <td>${obj2.key}</td>
    <td>${preencheValor(obj2?.yValue, obj1?.xValue)}</td>
    </tr>
  `;
  return tBody;
};
const preencheValor = (log1, log2) => {
  if (log1 == undefined) {
    log1 = "";
  }
  else if (log2 == undefined) {
    log2 = "";
  }
  return highlight(log1, log2)
}
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


