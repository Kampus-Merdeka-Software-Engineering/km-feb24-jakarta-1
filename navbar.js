document.addEventListener('DOMContentLoaded', function() {
    const offset = 70; 
    const navLinks = document.querySelectorAll('.nav_links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(navLink => navLink.classList.remove('active'));

            this.classList.add('active');
            let targetPosition;
            if (this.getAttribute('href') === '#gtk') {
                targetPosition = 0; 
            } else {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            }

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.toggle_btn');
    const dropdownMenu = document.querySelector('.dropdown_menu');

    toggleBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('open');
    });
});
