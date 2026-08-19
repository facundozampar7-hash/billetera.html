const slides = document.querySelectorAll(".foto-slide");
    let actualSlide = 0;
    slides.forEach((s, i) => s.classList.toggle("activa", i === 0));
    setInterval(() => {
      slides[actualSlide].classList.remove("activa");
      actualSlide = (actualSlide + 1) % slides.length;
      slides[actualSlide].classList.add("activa");
    }, 4000);

    function enviarWhatsApp() {
      const nombre   = document.getElementById("form-nombre").value.trim();
      const edad     = document.getElementById("form-edad").value.trim();
      const telefono = document.getElementById("form-telefono").value.trim();
      const mensaje  = document.getElementById("form-mensaje").value.trim();
      const errorEl  = document.getElementById("form-error");
      if (!nombre || !telefono) { errorEl.textContent = "Por favor completá tu nombre y teléfono."; return; }
      errorEl.textContent = "";
      const texto = `¡Hola! Me comunico desde la página web del Grupo Scout 👋\n\nNombre: ${nombre}\nEdad del interesado: ${edad || "No especificada"}\nTeléfono: ${telefono}\nMensaje: ${mensaje || "Sin mensaje adicional"}`;
      window.open(`https://wa.me/543424321882?text=${encodeURIComponent(texto)}`, "_blank");
      document.getElementById("form-nombre").value = "";
      document.getElementById("form-edad").value = "";
      document.getElementById("form-telefono").value = "";
      document.getElementById("form-mensaje").value = "";
    }
