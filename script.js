/*  Sopa de Letras. 
De un diccionario de 10 palabras tendremos que pintar la tan famosa sopa de letra,
 la cual tendrá 20 * 20 caracteres, y un campo de texto donde introduciremos la palabra a comprobar, 
 una vez pulsado el intro, si la palabra existe en la sopa de letras se pintara de otro color, 
 si la palabra no existe se pondrá en un listado junto a la sopa de letras,
  con el mismo sistema de marcador del jugador que hemos especificado en el ejercicio 1. */
const palabras = [
    "TEXTO", "DATOS", "CLAVE", "VALOR", "INDEX",
    "ARRAY", "OBJETO", "FUNCION", "VARIABLE", "CONSTANTE"
];

const FILAS = 20;
const COLUMNAS = 20;

let sopa = Array(FILAS)
    .fill()
    .map(() => Array(COLUMNAS).fill(""));

let posiciones = {};
let puntos = 0;
// Crear sopa
function crearSopa() {

    palabras.forEach(palabra => {
        let colocada = false;
        while (!colocada) {

            let direccion = Math.floor(Math.random() * 2); // 0=horizontal, 1=vertical
            let fila = Math.floor(Math.random() * FILAS);
            let columna = Math.floor(Math.random() * COLUMNAS);

            if (puedeColocar(palabra, fila, columna, direccion)) {

                posiciones[palabra] = [];

                for (let i = 0; i < palabra.length; i++) {

                    let f = direccion ? fila + i : fila;
                    let c = direccion ? columna : columna + i;

                    sopa[f][c] = palabra[i];

                    posiciones[palabra].push({
                        fila: f,
                        columna: c
                    });
                }

                colocada = true;
            }
        }
    });

    rellenarHuecos();
    dibujar();
}

// Comprobar si cabe
function puedeColocar(palabra, fila, columna, direccion) {

    if (direccion === 0 && columna + palabra.length > COLUMNAS) return false;

    if (direccion === 1 && fila + palabra.length > FILAS) return false;

    for (let i = 0; i < palabra.length; i++) {

        let f = direccion ? fila + i : fila;
        let c = direccion ? columna : columna + i;

        if (sopa[f][c] !== "" && sopa[f][c] !== palabra[i]) {
            return false;
        }
    }

    return true;
}

// Completar espacios vacíos
function rellenarHuecos() {

    for (let f = 0; f < FILAS; f++) {

        for (let c = 0; c < COLUMNAS; c++) {

            if (sopa[f][c] === "") {

                sopa[f][c] = String.fromCharCode(
                    65 + Math.floor(Math.random() * 26)
                );
            }
        }
    }
}

// Mostrar sopa
function dibujar() {

    const contenedor = document.getElementById("sopa-grid");

    contenedor.innerHTML = "";

    for (let f = 0; f < FILAS; f++) {

        for (let c = 0; c < COLUMNAS; c++) {

            let celda = document.createElement("div");

            celda.className = "celda";
            celda.id = `c-${f}-${c}`;
            celda.textContent = sopa[f][c];

            contenedor.appendChild(celda);
        }
    }
}
let palabrasEncontradas = new Set();
function actualizarMarcador() {

    document.getElementById("marcador").textContent =
        "Puntos: " + puntos;
}

function comprobarVictoria() {

    if (palabrasEncontradas.size === palabras.length) {

        document.body.innerHTML += `
            <div class="hola">
                🎉 HAS GANADO 🎉
            </div>
        `;
    }
}

// Comprobar palabra
document.getElementById("palabraInput")
    .addEventListener("keydown", function (e) {

        if (e.key !== "Enter") return;

        let palabra = this.value.trim().toUpperCase();

        // SI ACERTA
        if (palabras.includes(palabra) && !palabrasEncontradas.has(palabra)) {

            posiciones[palabra].forEach(pos => {
                document
                    .getElementById(`c-${pos.fila}-${pos.columna}`)
                    .classList.add("encontrada");
            });

            puntos += 5;
            palabrasEncontradas.add(palabra);

            actualizarMarcador();
            comprobarVictoria();

        } else {

            let lista = document.getElementById("listaNoExiste");

            let li = document.createElement("li");
            li.textContent = palabra;

            lista.appendChild(li);

            puntos -= 5;
            if (puntos < 0) puntos = 0;

            actualizarMarcador();
        }

        this.value = "";
    });


crearSopa();