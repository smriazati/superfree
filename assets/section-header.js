function createMenuToggleBtn() {
    const btn = document.getElementById('menuToggle');
    const targetClass = 'collapsed';
    btn.addEventListener('click', (e) => {
        const target = e.target;
        const header = target.closest('header');
        if (!header) return
        header.classList.toggle(targetClass);
    })
}

document.addEventListener("DOMContentLoaded", function () {
    createMenuToggleBtn();
});
