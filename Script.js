class Parquimetro {
    constructor() {
        this.saldo = 0;
        this.planoSelecionado = null;
        this.intervalo = null;
        this.tempoRestante = 0;

        this.planos = {
            basic:  { valor: 1.00,  minutos: 30  },
            medium: { valor: 1.75,  minutos: 60  },
            full:   { valor: 3.00,  minutos: 120 }
        };

        this.iniciarEventos();
    }

    // Métodos
    atualizarSaldo() {
        document.getElementById("Saldo").textContent =
            "Saldo: R$ " + this.saldo.toFixed(2);
    }

    iniciarEventos() {
        ["basic", "medium", "full"].forEach(id => {
            document.getElementById(id)
                .addEventListener("click", () => this.selecionarPlano(id));
        });

        document.getElementById("btnAdicionar")
            .addEventListener("click", () => this.adicionar());

        document.querySelector(".calcular")
            .addEventListener("click", () => this.calcular());
    }

    adicionar() {
        const valor = parseFloat(document.getElementById("iptAdicionar").value);
        if (isNaN(valor) || valor < 0.50) {
            alert("Valor mínimo é R$ 0,50");
            return;
        }
        this.saldo += valor;
        this.atualizarSaldo();
        document.getElementById("iptAdicionar").value = "";
    }

    selecionarPlano(planoId) {
        this.planoSelecionado = planoId;
        const plano = this.planos[planoId];

        document.getElementById("valor").value =
            plano.valor.toFixed(2);

        ["basic", "medium", "full"].forEach(id => {
            document.getElementById(id).classList.remove("selecionado");
        });
        document.getElementById(planoId).classList.add("selecionado");
    }

    valorValido(raw) {
        const num = parseFloat(raw);
        const valoresPermitidos = [1.00, 1.75, 3.00];
        return valoresPermitidos.includes(num) ? num : null;
    }

    calcular() {
        const raw = document.getElementById("valor").value;
        const valorDigitado = this.valorValido(raw);

        if (!valorDigitado) {
            alert("Valor inválido. Use: 1,00 | 1,75 | 3,00");
            return;
        }

        if (this.saldo < valorDigitado) {
            alert("Saldo insuficiente!");
            return;
        }

        const planoId = Object.keys(this.planos).find(
            id => this.planos[id].valor === valorDigitado
        );

        this.saldo -= valorDigitado;
        this.atualizarSaldo();

        this.tempoRestante = this.planos[planoId].minutos * 60;
        this.iniciarContagem();
    }

    iniciarContagem() {
        if (this.intervalo) clearInterval(this.intervalo);

        this.intervalo = setInterval(() => {
            if (this.tempoRestante <= 0) {
                clearInterval(this.intervalo);
                document.getElementById("card1").innerHTML =
                    "<p>⏰ Tempo esgotado!</p>";
                return;
            }

            this.tempoRestante--;
            this.exibirTempo();
        }, 1000);

        this.exibirTempo();
    }

    exibirTempo() {
        const min = String(Math.floor(this.tempoRestante / 60)).padStart(2, "0");
        const seg = String(this.tempoRestante % 60).padStart(2, "0");

        document.getElementById("card1").innerHTML =
            `<h3>⏱ Tempo</h3><p>${min}:${seg}</p>`;
    }
}

const parquimetro = new Parquimetro();