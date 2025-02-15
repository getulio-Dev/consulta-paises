// Objeto para armazenar os nomes dos países em português e inglês
let paisesEmIngles = {};

// Função para carregar os nomes dos países e criar o dicionário de tradução
function carregarPaises() {
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            data.forEach(pais => {
                if (pais.translations && pais.translations.por) {
                    let nomePortugues = pais.translations.por.common.toLowerCase();
                    let nomeIngles = pais.name.common.toLowerCase();
                    paisesEmIngles[nomePortugues] = nomeIngles;
                }
            });
        })
        .catch(error => console.error("Erro ao carregar países:", error));
}

// Carrega os países assim que a página é carregada
window.onload = carregarPaises;

// Função para buscar informações sobre um país
function buscarPais() {
    let paisNome = document.getElementById("pais").value.trim().toLowerCase();

    // Converte o nome para inglês, se necessário
    if (paisesEmIngles[paisNome]) {
        paisNome = paisesEmIngles[paisNome];
    }

    if (paisNome === "") {
        alert("Digite um nome de país válido!");
        return;
    }

    let url = `https://restcountries.com/v3.1/name/${paisNome}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 404) {
                document.getElementById("resultado").innerHTML = "País não encontrado!";
                return;
            }

            let pais = data[0];
            let continente = pais.region;
            let populacao = pais.population.toLocaleString();
            let latitude = pais.latlng[0];
            let longitude = pais.latlng[1];
            let oceanoProximo = determinarOceano(latitude, longitude);

            let resultadoHtml = `
                <p><strong>Continente:</strong> ${continente}</p>
                <p><strong>Oceano Próximo:</strong> ${oceanoProximo}</p>
                <p><strong>População:</strong> ${populacao} habitantes</p>
            `;
            document.getElementById("resultado").innerHTML = resultadoHtml;
        })
        .catch(error => {
            document.getElementById("resultado").innerHTML = "Erro ao buscar informações.";
            console.error("Erro:", error);
        });
}

// Função para determinar qual oceano está mais próximo do país
function determinarOceano(latitude, longitude) {
    const oceanos = [
        { nome: "Oceano Atlântico", latMin: -70, latMax: 70, lonMin: -80, lonMax: 20 },
        { nome: "Oceano Pacífico", latMin: -70, latMax: 70, lonMin: -180, lonMax: -80 },
        { nome: "Oceano Índico", latMin: -60, latMax: 30, lonMin: 20, lonMax: 120 },
        { nome: "Oceano Ártico", latMin: 70, latMax: 90, lonMin: -180, lonMax: 180 },
        { nome: "Oceano Antártico", latMin: -90, latMax: -60, lonMin: -180, lonMax: 180 }
    ];

    for (let oceano of oceanos) {
        if (latitude >= oceano.latMin && latitude <= oceano.latMax &&
            longitude >= oceano.lonMin && longitude <= oceano.lonMax) {
            return oceano.nome;
        }
    }

    return "Desconhecido";
}
