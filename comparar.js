export default function verificaIgualdade(x, y) {
  if (JSON.stringify(Object.entries(x).sort()) == JSON.stringify(Object.entries(y).sort())) return [];
  let mapX = new Map(Object.entries(x).sort());
  let mapY = new Map(Object.entries(y).sort());
  let arrDiff = [];
  //loop pelo primeiro map
  mapX.forEach((xValue, key) => {
    let yValue = mapY.get(key);
    if (yValue != xValue) {
      arrDiff = [...arrDiff, [{Objeto: 1, xValue, key },{ Objeto: 2, yValue, key }]];
    }
  });
  //loop pelo segundo map
  mapY.forEach((yValue, key) => {
    let xValue = mapX.get(key);
    //se valor for diferente e chave nao existir no mapa do obj 1, a segunda condição é para não colocar valores repetidos
    if (xValue != yValue && !mapX.has(key)) {
      arrDiff = [...arrDiff, [{Objeto: 1, xValue, key },{ Objeto: 2, yValue, key }]];
    }
  });
  //acho que não precisa disso, mas tá ai
  let setFromArray = [...new Set(arrDiff)];
  return setFromArray;
}
