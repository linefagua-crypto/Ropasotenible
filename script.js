// --- FILTRO Y BUSCADOR EN TIEMPO REAL ---

document.addEventListener("DOMContentLoaded", () => {
    const inputBuscador = document.getElementById("buscador");
    const tarjetasProductos = document.querySelectorAll(".tarjeta-producto");

    // Función para filtrar productos
    function filtrarProductos() {
        const textoBusqueda = inputBuscador.value.toLowerCase().trim();

        tarjetasProductos.forEach(tarjeta => {
            // Obtenemos el texto del título y los detalles de la tarjeta
            const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
            const detalles = tarjeta.querySelector(".detalles").textContent.toLowerCase();

            // Verificamos si coincide con lo que el usuario escribió
            if (titulo.includes(textoBusqueda) || detalles.includes(textoBusqueda)) {
                tarjeta.style.display = "flex"; // Muestra la tarjeta
            } else {
                tarjeta.style.display = "none";  // Oculta la tarjeta si no coincide
            }
        });
    }

    // Escuchamos cuando el usuario escribe en el buscador
    if (inputBuscador) {
        inputBuscador.addEventListener("input", filtrarProductos);
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hojas-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Configuración de elementos
    const CANTIDAD_HOJAS = 15;
    const CANTIDAD_POLVO = 25;
    const elementos = [];

    // Clase para las Hojas y Partículas de Polvo
    class Particula {
        constructor(tipo) {
            this.tipo = tipo; // 'hoja' o 'polvo'
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            
            if (this.tipo === 'hoja') {
                this.tamano = Math.random() * 8 + 6;
                this.velocidadY = Math.random() * 0.8 + 0.4;
                this.velocidadX = Math.random() * 0.6 - 0.3;
                this.rotacion = Math.random() * Math.PI * 2;
                this.vRotacion = (Math.random() - 0.5) * 0.02;
                this.oscilacion = Math.random() * Math.PI * 2;
                this.vOscilacion = Math.random() * 0.02 + 0.01;
                // Tonos verdes y dorados suaves
                const tonos = ['#2e5a44', '#3d7256', '#88a070', '#c2b280'];
                this.color = tonos[Math.floor(Math.random() * tonos.length)];
                this.opacidad = Math.random() * 0.5 + 0.4;
            } else {
                // Partículas de polvo / brillo
                this.tamano = Math.random() * 2 + 1;
                this.velocidadY = Math.random() * 0.3 + 0.1;
                this.velocidadX = Math.random() * 0.4 - 0.2;
                this.color = '#ffffff';
                this.opacidad = Math.random() * 0.4 + 0.2;
            }
        }

        actualizar() {
            this.y += this.velocidadY;
            this.x += this.velocidadX;

            if (this.tipo === 'hoja') {
                this.oscilacion += this.vOscilacion;
                this.x += Math.sin(this.oscilacion) * 0.5;
                this.rotacion += this.vRotacion;
            }

            // Reiniciar cuando salgan de la pantalla
            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                this.reset();
                this.y = -10;
            }
        }

        dibujar() {
            ctx.save();
            ctx.globalAlpha = this.opacidad;

            if (this.tipo === 'hoja') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotacion);
                ctx.fillStyle = this.color;
                
                // Dibujar forma de hoja
                ctx.beginPath();
                ctx.moveTo(0, -this.tamano);
                ctx.quadraticCurveTo(this.tamano / 2, 0, 0, this.tamano);
                ctx.quadraticCurveTo(-this.tamano / 2, 0, 0, -this.tamano);
                ctx.fill();
            } else {
                // Dibujar partícula de polvo
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Crear la colección de partículas
    for (let i = 0; i < CANTIDAD_HOJAS; i++) elementos.push(new Particula('hoja'));
    for (let i = 0; i < CANTIDAD_POLVO; i++) elementos.push(new Particula('polvo'));

    // Bucle de animación continuo
    function animar() {
        ctx.clearRect(0, 0, width, height);
        elementos.forEach(p => {
            p.actualizar();
            p.dibujar();
        });
        requestAnimationFrame(animar);
    }

    animar();
});