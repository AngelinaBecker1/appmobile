const musicas = [
    {
        id: 1,
        titulo: "Birds of a Feather",
        artista: "Billie Eilish",
        mood: ["Apaixonado", "Tranquilo"],
        cor: "art-green",
        simbolo: "B",
        tag: "AMOR LEVE"
    },
    {
        id: 2,
        titulo: "Die With A Smile",
        artista: "Lady Gaga, Bruno Mars",
        mood: ["Apaixonado", "Nostálgico"],
        cor: "art-rose",
        simbolo: "♡",
        tag: "SENTIMENTO"
    },
    {
        id: 3,
        titulo: "Golden Hour",
        artista: "JVKE",
        mood: ["Apaixonado", "Tranquilo"],
        cor: "art-gold",
        simbolo: "G",
        tag: "SONHO"
    },
    {
        id: 4,
        titulo: "The Night We Met",
        artista: "Lord Huron",
        mood: ["Nostálgico", "Reflexivo"],
        cor: "art-blue",
        simbolo: "☾",
        tag: "SAUDADE"
    },
    {
        id: 5,
        titulo: "Good Days",
        artista: "SZA",
        mood: ["Tranquilo", "Reflexivo"],
        cor: "art-violet",
        simbolo: "✧",
        tag: "PAZ"
    },
    {
        id: 6,
        titulo: "Levitating",
        artista: "Dua Lipa",
        mood: ["Feliz", "Confiante"],
        cor: "art-gold",
        simbolo: "✳",
        tag: "ENERGIA"
    },
    {
        id: 7,
        titulo: "Espresso",
        artista: "Sabrina Carpenter",
        mood: ["Feliz", "Confiante"],
        cor: "art-rose",
        simbolo: "E",
        tag: "GOOD VIBES"
    },
    {
        id: 8,
        titulo: "Sweater Weather",
        artista: "The Neighbourhood",
        mood: ["Nostálgico", "Reflexivo"],
        cor: "art-blue",
        simbolo: "N",
        tag: "NOITE"
    },
    {
        id: 9,
        titulo: "Training Season",
        artista: "Dua Lipa",
        mood: ["Confiante", "Feliz"],
        cor: "art-red",
        simbolo: "⚡",
        tag: "ATITUDE"
    },
    {
        id: 10,
        titulo: "Until I Found You",
        artista: "Stephen Sanchez",
        mood: ["Apaixonado", "Nostálgico"],
        cor: "art-gold",
        simbolo: "♡",
        tag: "ROMANCE"
    },
    {
        id: 11,
        titulo: "Ocean Eyes",
        artista: "Billie Eilish",
        mood: ["Tranquilo", "Nostálgico"],
        cor: "art-blue",
        simbolo: "O",
        tag: "CALMAR"
    },
    {
        id: 12,
        titulo: "Unstoppable",
        artista: "Sia",
        mood: ["Confiante", "Feliz"],
        cor: "art-violet",
        simbolo: "✦",
        tag: "PODER"
    }
];

const musicList = document.getElementById("musicList");
const favoritesList = document.getElementById("favoritesList");
const favoritesEmpty = document.getElementById("favoritesEmpty");
const favoriteCount = document.getElementById("favoriteCount");
const moodCards = document.querySelectorAll(".mood-card");
const toast = document.getElementById("toast");

let moodSelecionado = null;
let favoritos = [];
let visualizacao = "discover";
let timerToast;

function mostrarToast(texto) {
    toast.textContent = texto;
    toast.classList.add("show");

    clearTimeout(timerToast);

    timerToast = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function criarCartaoMusica(musica, listaFavoritos = false) {
    const linha = document.createElement("article");
    linha.className = "music-row";

    const capa = document.createElement("div");
    capa.className = `album-art ${musica.cor}`;

    const simbolo = document.createElement("span");
    simbolo.textContent = musica.simbolo;
    capa.appendChild(simbolo);

    const info = document.createElement("div");
    info.className = "track-info";

    const titulo = document.createElement("p");
    titulo.className = "track-title";
    titulo.textContent = musica.titulo;

    const artista = document.createElement("p");
    artista.className = "track-artist";
    artista.textContent = musica.artista;

    const tag = document.createElement("span");
    tag.className = "track-tag";
    tag.textContent = musica.tag;

    info.append(titulo, artista, tag);

    const acoes = document.createElement("div");
    acoes.className = "track-actions";

    const coracao = document.createElement("button");
    coracao.type = "button";
    coracao.className = "heart-button";
    coracao.textContent = favoritos.includes(musica.id) ? "♥" : "♡";
    coracao.classList.toggle(
        "favorited",
        favoritos.includes(musica.id)
    );
    coracao.setAttribute(
        "aria-label",
        favoritos.includes(musica.id)
            ? "Remover dos favoritos"
            : "Adicionar aos favoritos"
    );

    coracao.addEventListener("click", () => {
        alternarFavorito(musica.id);
    });

    const reproduzir = document.createElement("button");
    reproduzir.type = "button";
    reproduzir.className = "play-button";
    reproduzir.textContent = "▶";
    reproduzir.setAttribute("aria-label", "Ver detalhes da música");

    reproduzir.addEventListener("click", () => {
        mostrarDetalhes(musica);
    });

    acoes.append(coracao, reproduzir);
    linha.append(capa, info, acoes);

    if (listaFavoritos) {
        linha.dataset.favorita = String(musica.id);
    }

    return linha;
}

function renderizarMusicas() {
    musicList.replaceChildren();

    let selecionadas = musicas;

    if (moodSelecionado) {
        selecionadas = musicas.filter(musica =>
            musica.mood.includes(moodSelecionado)
        );
    }

    selecionadas.slice(0, 6).forEach(musica => {
        musicList.appendChild(criarCartaoMusica(musica));
    });

    document.getElementById("recommendationTitle").textContent =
        moodSelecionado
            ? `Vibes de ${moodSelecionado.toLowerCase()}.`
            : "Descobertas.";

    document.getElementById("recommendationEyebrow").textContent =
        moodSelecionado ? "SELECIONADAS PARA SEU MOOD" : "FEITAS PARA VOCÊ";

    document.getElementById("recommendationDescription").textContent =
        moodSelecionado
            ? "Uma seleção que combina com o que você está sentindo."
            : "Escolha seu mood e deixe a música falar por você.";
}

function renderizarFavoritos() {
    favoritesList.replaceChildren();

    const salvas = musicas.filter(musica =>
        favoritos.includes(musica.id)
    );

    salvas.forEach(musica => {
        favoritesList.appendChild(criarCartaoMusica(musica, true));
    });

    favoritesEmpty.hidden = salvas.length > 0;
    favoriteCount.textContent =
        `${salvas.length} ${salvas.length === 1 ? "salva" : "salvas"}`;
}

function alternarFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(item => item !== id);
        mostrarToast("Música removida dos favoritos.");
    } else {
        favoritos.push(id);
        mostrarToast("Música salva no seu universo ♥");
    }

    renderizarMusicas();
    renderizarFavoritos();
}

function selecionarMood(mood) {
    moodSelecionado = mood;

    moodCards.forEach(cartao => {
        const selecionado = cartao.dataset.mood === mood;
        cartao.classList.toggle("selected", selecionado);
        cartao.setAttribute("aria-pressed", String(selecionado));
    });

    renderizarMusicas();

    document.getElementById("recommendations").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    mostrarToast(`Mood selecionado: ${mood}`);
}

function mostrarDetalhes(musica) {
    document.getElementById("modalTitle").textContent = musica.titulo;

    document.querySelector(".modal-card p").textContent =
        `${musica.artista} • ${musica.tag}. ` +
        `Esta faixa combina com: ${musica.mood.join(", ")}. ` +
        "Esta demonstração apresenta informações da música, " +
        "mas não reproduz o áudio.";

    document.getElementById("modal").hidden = false;
    document.getElementById("modalClose").focus();
}

moodCards.forEach(cartao => {
    cartao.setAttribute("aria-pressed", "false");

    cartao.addEventListener("click", () => {
        selecionarMood(cartao.dataset.mood);
    });
});

document.getElementById("resetMood").addEventListener("click", () => {
    moodSelecionado = null;

    moodCards.forEach(cartao => {
        cartao.classList.remove("selected");
        cartao.setAttribute("aria-pressed", "false");
    });

    renderizarMusicas();
    document.getElementById("moodSection").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("nightButton").addEventListener("click", () => {
    selecionarMood("Reflexivo");
});

document.getElementById("profileButton").addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Bem-vindo ao VIBE";
    document.querySelector(".modal-card p").textContent =
        "Descubra músicas de acordo com seu humor, explore novas vibes " +
        "e guarde suas faixas favoritas. Este projeto foi desenvolvido " +
        "com HTML, CSS e JavaScript.";
    document.getElementById("modal").hidden = false;
});

document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("modal").hidden = true;
});

document.getElementById("modalOk").addEventListener("click", () => {
    document.getElementById("modal").hidden = true;
});

document.getElementById("modal").addEventListener("click", evento => {
    if (evento.target.id === "modal") {
        document.getElementById("modal").hidden = true;
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape") {
        document.getElementById("modal").hidden = true;
    }
});

document.querySelectorAll(".nav-item").forEach(botao => {
    botao.addEventListener("click", () => {
        visualizacao = botao.dataset.view;

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle("active", item === botao);
        });

        if (visualizacao === "discover") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (visualizacao === "favorites") {
            document.getElementById("favoritesSection").scrollIntoView({
                behavior: "smooth"
            });
        }

        if (visualizacao === "moods") {
            document.getElementById("moodSection").scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

renderizarMusicas();
renderizarFavoritos();
