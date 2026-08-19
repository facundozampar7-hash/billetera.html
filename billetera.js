// =====================================================
    // 🔧 CONFIGURACIÓN
    // =====================================================
    const SUPABASE_URL = "https://wikzronmuohcirrqxeks.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpa3pyb25tdW9oY2lycnF4ZWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTI0NTcsImV4cCI6MjA4NzM2ODQ1N30.AV9P0w4ZnRWmlo88C3ErSgh-o0E_x3u1jSMaROSk14k";

    const { createClient } = supabase;
    const db = createClient(SUPABASE_URL, SUPABASE_KEY);

    const MESES = [
      "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre"
    ];
    const MESES_CORTO = [
      "ENE","FEB","MAR","ABR","MAY","JUN",
      "JUL","AGO","SEP","OCT","NOV","DIC"
    ];

    // Mostrar siempre desde marzo (índice 2) hasta mayo como mínimo (índice 4)
    const MES_INICIO = 2; // marzo
    const MES_ACTUAL = Math.max(new Date().getMonth(), 4);

    // Referencias DOM
    const loginCard     = document.getElementById("login-card");
    const billeteraCard = document.getElementById("billetera-card");
    const loginForm     = document.getElementById("login-form");
    const dniInput      = document.getElementById("dni");
    const errorMsg      = document.getElementById("error-msg");
    const tituloEl      = document.getElementById("billetera-titulo");
    const infoDni       = document.getElementById("info-dni");
    const infoFdn       = document.getElementById("info-fdn");
    const infoGrupo     = document.getElementById("info-grupo");
    const saldoBadge    = document.getElementById("saldo-badge");
    const saldoTexto    = document.getElementById("saldo-texto");
    const volverBtn     = document.getElementById("volver-btn");
    const btnIngresar   = document.getElementById("btn-ingresar");
    const theadRow      = document.getElementById("thead-row");
    const tbody         = document.getElementById("tbody");

    // =====================================================
    // FORMATEO
    // =====================================================
    function fmt(valor) {
      return `$${Number(valor).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // =====================================================
    // CONSTRUIR TABLA DINÁMICAMENTE
    // =====================================================
    function construirTabla(scout) {
      // Limpiar
      theadRow.innerHTML = "";
      tbody.innerHTML    = "";

      // ── CALCULAR VALORES ────────────────────────────
      const saldoInicial = Number(scout.saldo_inicial) || 0;
      let totalEntradas  = saldoInicial;
      let totalSalidas   = 0;

      // Arrays de valores por mes (desde marzo hasta MES_ACTUAL)
      const entradasMes = [];
      const salidasMes  = [];
      const netoMes     = [];

      for (let i = MES_INICIO; i <= MES_ACTUAL; i++) {
        const mes     = MESES[i];
        const entrada = Number(scout[`entradas_${mes}`]) || 0;
        const salida  = Number(scout[`salidas_${mes}`])  || 0;
        entradasMes.push(entrada);
        salidasMes.push(salida);
        netoMes.push(entrada - salida);
        totalEntradas += entrada;
        totalSalidas  += salida;
      }

      const totalNeto = totalEntradas - totalSalidas;

      // ── ENCABEZADO ──────────────────────────────────
      theadRow.innerHTML += `<th class="col-saldo-ini-header">Saldo inicial:<br>${fmt(saldoInicial)}</th>`;
      for (let i = MES_INICIO; i <= MES_ACTUAL; i++) {
        theadRow.innerHTML += `<th>${MESES_CORTO[i]}</th>`;
      }
      theadRow.innerHTML += `<th class="col-total">TOTAL SALDO</th>`;

      // ── FILA ENTRADAS ────────────────────────────────
      let trEnt = `<tr><td class="row-title">ENTRADAS</td>`;
      for (let i = 0; i < entradasMes.length; i++) {
        const v = entradasMes[i];
        trEnt += `<td${v > 0 ? ' class="has-value"' : ''}>${v > 0 ? fmt(v) : ''}</td>`;
      }
      trEnt += `<td class="col-total"></td></tr>`;

      // ── FILA SALIDAS ─────────────────────────────────
      let trSal = `<tr><td class="row-title">SALIDAS</td>`;
      for (let i = 0; i < salidasMes.length; i++) {
        const v = salidasMes[i];
        trSal += `<td${v > 0 ? ' class="has-value"' : ''}>${v > 0 ? fmt(v) : ''}</td>`;
      }
      trSal += `<td class="col-total"></td></tr>`;

      // ── FILA PAGO DE SEGURO (desde columnas boolean del scout) ──
      let trSeg = `<tr class="fila-seguro"><td class="row-title">PAGO DE SEGURO</td>`;
      for (let i = MES_INICIO; i <= MES_ACTUAL; i++) {
        const mes    = MESES[i];
        const pagado = scout[`seguro_${mes}`] === true;
        trSeg += `<td class="${pagado ? 'seguro-ok' : 'seguro-deuda'}">${pagado ? '✓' : '✗'}</td>`;
      }
      trSeg += `<td class="col-total"></td></tr>`;

      // ── FILA TOTAL ──
      const totalFinal = totalNeto;
      let trTot = `<tr class="fila-total"><td class="row-title">TOTAL</td>`;
      for (let i = 0; i < netoMes.length; i++) {
        const v = netoMes[i];
        const cls = v < 0 ? ' style="color:#dc2626"' : (v > 0 ? ' style="color:#16a34a"' : '');
        trTot += `<td${cls}>${v !== 0 ? fmt(v) : ''}</td>`;
      }
      trTot += `<td class="col-total" style="color:${totalFinal >= 0 ? '#16a34a' : '#dc2626'}">${fmt(totalFinal)}</td>`;
      trTot += `</tr>`;

      // Insertar filas
      tbody.innerHTML = trEnt + trSal + trTot + trSeg;

      // ── BADGE SALDO ──────────────────────────────────
      saldoTexto.textContent = `Saldo total: ${fmt(totalFinal)}`;
      saldoBadge.classList.toggle("negativo", totalFinal < 0);
    }

    // =====================================================
    // TRANSICIONES
    // =====================================================
    function mostrarBilletera(scout) {
      loginCard.classList.add("saliendo");
      setTimeout(() => {
        loginCard.style.display = "none";
        loginCard.classList.remove("saliendo");

        tituloEl.textContent    = `BILLETERA DE ${scout.nombre.toUpperCase()}`;
        infoDni.textContent     = scout.dni;
        infoFdn.textContent     = scout.fecha_nacimiento || "—";
        infoGrupo.textContent   = scout.grupo || "—";

        construirTabla(scout);

        billeteraCard.classList.add("visible");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }

    function mostrarLogin() {
      billeteraCard.classList.add("saliendo");
      setTimeout(() => {
        billeteraCard.classList.remove("visible", "saliendo");
        loginCard.style.display = "block";
        loginCard.style.animation = "none";
        void loginCard.offsetWidth;
        loginCard.style.animation = "";
        dniInput.value = "";
        errorMsg.textContent = "";
        dniInput.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    }

    // =====================================================
    // ERROR
    // =====================================================
    function mostrarError(msg) {
      errorMsg.textContent = msg;
      dniInput.classList.remove("error-shake");
      void dniInput.offsetWidth;
      dniInput.classList.add("error-shake");
    }
    dniInput.addEventListener("animationend", () => dniInput.classList.remove("error-shake"));

    // =====================================================
    // LOGIN
    // =====================================================
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dniValor = dniInput.value.trim();
      if (!dniValor) { mostrarError("Ingresá tu DNI."); return; }

      btnIngresar.classList.add("cargando");
      btnIngresar.disabled = true;
      errorMsg.textContent = "";

      try {
        const { data: scout, error: errScout } = await db.from("scouts").select("*").eq("dni", dniValor).single();

        if (errScout || !scout) {
          mostrarError("DNI no encontrado. Hablá con tu Jefe de Rama.");
          return;
        }

        mostrarBilletera(scout);

      } catch (err) {
        mostrarError("Error de conexión. Intentá de nuevo.");
        console.error(err);
      } finally {
        btnIngresar.classList.remove("cargando");
        btnIngresar.disabled = false;
      }
    });

    // =====================================================
    // SALIR
    // =====================================================
    volverBtn.addEventListener("click", () => mostrarLogin());