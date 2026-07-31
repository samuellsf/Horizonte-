const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

if (menuToggle && sidebar && overlay) {

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("open");
            overlay.classList.remove("show");
        }
    });

}