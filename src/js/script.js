// -------- Navbar Fixed --------
const navbar = document.getElementById('navbar');
const hiddenMenu = document.getElementById('hidden-menu');
const reserveButton = document.getElementById('reserve-button');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/1', 'backdrop-blur-lg');
        hiddenMenu.classList.add('hidden');
        reserveButton.classList.remove('hidden');
    } else {
        navbar.classList.remove('bg-white/1', 'backdrop-blur-lg');
        hiddenMenu.classList.remove('hidden');
        reserveButton.classList.add('hidden');
    }
});



// -------- Hamburger Menu --------
const hamburger = document.querySelector('#hamburger');
const navMenu = document.querySelector('#nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('hamburger-active');
    navMenu.classList.toggle('hidden');
});



// -------- Dropdown Menu --------
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('dropdown-container');
    if (!container) return; // Keluar jika container tidak ditemukan

    const toggleButton = document.getElementById('dropdown-toggle');
    const menu = document.getElementById('dropdown-menu');

    // --- Konfigurasi ---
    const defaultDelay = 200;
    let closeDelay = parseInt(container.dataset.closeDelay, 10);
    if (isNaN(closeDelay)) {
        closeDelay = defaultDelay;
    }
    // --- Akhir Konfigurasi ---

    let closeTimeoutId = null; // Untuk menyimpan ID timeout
    let isStickyOpen = false; // State baru: lacak mode "klik"

    if (!toggleButton || !menu) {
        console.error("Dropdown toggle button or menu not found.");
        return; // Keluar jika elemen hilang
    }

    // --- Fungsi Bantuan ---
    const showMenu = () => {
        cancelCloseTimer(); // Selalu batalkan timer tutup saat membuka
        menu.classList.remove('hidden');
        toggleButton.setAttribute('aria-expanded', 'true');
    };

    const hideMenu = () => {
        menu.classList.add('hidden');
        toggleButton.setAttribute('aria-expanded', 'false');
        isStickyOpen = false; // Penting: reset state sticky saat menu ditutup
    };

    const startCloseTimer = () => {
        clearTimeout(closeTimeoutId);
        closeTimeoutId = setTimeout(hideMenu, closeDelay);
    };

    const cancelCloseTimer = () => {
        clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
    };

    // --- Event Listeners ---

    // --- LOGIKA KLIK (BARU) ---
    toggleButton.addEventListener('click', (event) => {
        event.preventDefault(); // Cegah perilaku default jika tombol adalah link/submit

        if (isStickyOpen) {
            // Jika sudah sticky (terbuka karena klik), maka tutup
            hideMenu(); // hideMenu akan mereset isStickyOpen ke false
        } else {
            // Jika belum sticky, buat jadi sticky dan buka
            isStickyOpen = true;
            showMenu(); // showMenu akan membatalkan timer tutup yang mungkin ada
        }
    });

    // --- LOGIKA HOVER (DIMODIFIKASI) ---
    // Hanya jalankan logika hover jika menu TIDAK dalam mode sticky

    // Tampilkan menu saat mouse masuk ke tombol trigger (jika tidak sticky)
    toggleButton.addEventListener('mouseenter', () => {
        if (!isStickyOpen) { // Cek kondisi sticky
            cancelCloseTimer(); // Batalkan operasi penutupan yang tertunda
            showMenu();
        }
    });

    // Mulai timer untuk menutup menu saat mouse meninggalkan tombol trigger (jika tidak sticky)
    toggleButton.addEventListener('mouseleave', () => {
        if (!isStickyOpen) { // Cek kondisi sticky
            startCloseTimer();
        }
    });

    // Jaga menu tetap terbuka dan batalkan timer saat mouse masuk ke menu itu sendiri (jika tidak sticky)
    menu.addEventListener('mouseenter', () => {
        if (!isStickyOpen) { // Cek kondisi sticky
            cancelCloseTimer();
        }
    });

    // Mulai timer untuk menutup menu saat mouse meninggalkan menu (jika tidak sticky)
    menu.addEventListener('mouseleave', () => {
        if (!isStickyOpen) { // Cek kondisi sticky
            startCloseTimer();
        }
    });


    // Opsional: Tutup menu jika pengguna mengklik di luar (handle kedua mode)
    document.addEventListener('click', (event) => {
        // Jika klik BUKAN di dalam container DAN menu sedang tidak tersembunyi
        if (!container.contains(event.target) && !menu.classList.contains('hidden')) {
             hideMenu(); // hideMenu akan otomatis mereset isStickyOpen
        }
    });

    // Opsional: Handle focus out untuk aksesibilitas (lebih kompleks)
    // container.addEventListener('focusout', (event) => {
    //    if (!isStickyOpen && !container.contains(event.relatedTarget)) {
    //        startCloseTimer();
    //    }
    // });
    // toggleButton.addEventListener('focusin', () => {
    //     if (!isStickyOpen) cancelCloseTimer();
    // });
    // menu.addEventListener('focusin', () => {
    //     if (!isStickyOpen) cancelCloseTimer();
    // });

});



// -------- Language Toggle --------
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded, script running."); // Pesan debug

    const toggleButton = document.getElementById('lang-toggle-btn');
    const flagImage = document.getElementById('lang-toggle-flag');
    const htmlElement = document.documentElement; // Target <html> tag

    // Konfigurasi bahasa (PASTIKAN PATH GAMBAR BENAR)
    const languages = {
        ja: { name: 'jp to en', flag: '/src/img/index/flag-en.svg' },
        en: { name: 'en to jp', flag: '/src/img/index/flag-jp.svg' } // Sesuaikan path jika perlu
    };

    // Fungsi untuk memperbarui tampilan tombol dan atribut lang
    function setLanguage(langCode) {
        if (!languages[langCode]) {
            console.warn(`Invalid language code requested: ${langCode}`);
            return;
        }

        console.log(`Attempting to set language to: ${langCode}`);
        const langConfig = languages[langCode];

        // Perbarui atribut lang pada tag <html>
        htmlElement.lang = langCode;
        console.log(`html lang attribute set to: ${htmlElement.lang}`);

        // Perbarui state pada tombol
        toggleButton.dataset.currentLang = langCode;

        // Perbarui gambar bendera dan alt text
        flagImage.src = langConfig.flag;
        flagImage.alt = `lang: ${langConfig.name}`;
        console.log(`Flag image src set to: ${flagImage.src}`);

        // **Logika Penggantian Bahasa Aktual Anda DI SINI**
        // (Reload halaman, panggil library i18n, dll.)
        // Contoh sederhana: Log ke konsol (seperti sebelumnya)
        console.log(`Website language conceptually switched to: ${langConfig.name}`);

        // Simpan preferensi di localStorage
        try {
             localStorage.setItem('preferredLang', langCode);
             console.log(`Saved preferredLang=${langCode} to localStorage.`);
        } catch (e) {
             console.warn("Could not save language preference to localStorage.", e);
        }

        // Trigger reflow/repaint jika perlu (biasanya tidak diperlukan untuk perubahan attr)
        // document.body.offsetHeight;
    }

    // Event listener untuk tombol toggle
    toggleButton.addEventListener('click', () => {
        const currentLang = toggleButton.dataset.currentLang;
        const nextLang = currentLang === 'ja' ? 'en' : 'ja';
        console.log(`Button clicked. Current: ${currentLang}, Switching to: ${nextLang}`);
        setLanguage(nextLang);
    });

    // Inisialisasi saat halaman dimuat
    let initialLang = htmlElement.lang || 'ja'; // Ambil dari HTML tag sebagai default utama
    try {
        const preferredLang = localStorage.getItem('preferredLang');
         if (preferredLang && languages[preferredLang]) {
            initialLang = preferredLang;
            console.log(`Found preferred language in localStorage: ${initialLang}`);
         } else {
            console.log(`No valid preferred language in localStorage, using default: ${initialLang}`);
         }
    } catch (e) {
         console.warn("Could not access localStorage to get preferred language.", e);
    }


    // Set bahasa awal saat load (setelah memeriksa localStorage)
    // Pastikan setLanguage dipanggil hanya sekali saat inisialisasi
    setLanguage(initialLang);
});



// -------- Hero Section --------
const images = [
    document.getElementById('hero-bg-1'),
    document.getElementById('hero-bg-2'),
    document.getElementById('hero-bg-3')
];

let currentIndex = 0;

function changeBackground() {
    images[currentIndex].style.opacity = 0;
    images[currentIndex].style.transform = 'scale(1.2)'; // Zoom out sedikit

    currentIndex = (currentIndex + 1) % images.length;

    images[currentIndex].style.opacity = 1;
    images[currentIndex].style.transform = 'scale(1)'; // Reset zoom
}

images.forEach(img => {
    img.style.transform = 'scale(1.2)';
    img.style.transition = 'transform 10s ease-out, opacity 1s ease-in-out';
});// Animasi awal

setTimeout(() => {
    images[0].style.transform = 'scale(1)';
}, 500); // Delay sedikit untuk animasi awal

setInterval(changeBackground, 5000); // Ganti gambar setiap 5 detik
// setInterval(nextImage, 5000); // Ganti gambar setiap 5 detik



// -------- Card Slider --------
// Ambil elemen-elemen yang dibutuhkan
const viewport = document.getElementById('sliderViewport');
const track = document.getElementById('sliderTrack');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const counterElement = document.getElementById('sliderCounter');
const cards = track.children; // Dapatkan semua elemen kartu

// Variabel state slider
let currentPage = 1;
let totalPages = 1;
let slideAmountPx = 0;
let cardsPerPage = 1;

// Fungsi untuk menghitung ulang parameter slider (lebar, halaman, dll.)
function calculateSliderParams() {
    // Pastikan elemen ada sebelum melanjutkan
    if (!viewport || !track || !cards || cards.length === 0) {
        console.error("Slider elements not found or no cards present.");
        return; // Keluar jika elemen penting tidak ada
    }

    const viewportWidth = viewport.offsetWidth;
    const trackGapStyle = window.getComputedStyle(track).gap;
    const gap = trackGapStyle && trackGapStyle !== 'normal' ? parseFloat(trackGapStyle) : 24;

    const firstCardWidth = cards[0].offsetWidth;
    if (firstCardWidth > 0) {
         cardsPerPage = Math.max(1, Math.round((viewportWidth + gap) / (firstCardWidth + gap)));
    } else {
         cardsPerPage = 1;
    }

    slideAmountPx = viewportWidth + gap;

    const totalCards = cards.length;
     if (totalCards <= cardsPerPage || viewportWidth >= track.scrollWidth) {
         totalPages = 1;
     } else {
        totalPages = Math.ceil(totalCards / cardsPerPage);
        const remainingScroll = track.scrollWidth - viewportWidth;
        let totalPagesScroll = 1 + Math.ceil(remainingScroll / slideAmountPx);
        if ((totalPagesScroll - 1) * slideAmountPx > remainingScroll + 5) {
            totalPagesScroll = Math.max(1, totalPagesScroll - 1);
        }
        totalPages = Math.min(totalPages, totalPagesScroll);
        totalPages = Math.max(1, totalPages);
     }

    // Override spesifik untuk 4 kartu
    const isLikelyMobile = viewportWidth < 640;
    if (!isLikelyMobile && totalCards === 4) {
        totalPages = 2;
        cardsPerPage = 2;
        slideAmountPx = viewportWidth + gap; // Geser per viewport tetap
    } else if (isLikelyMobile && totalCards === 4) {
         totalPages = 4;
         cardsPerPage = 1;
         slideAmountPx = viewportWidth + gap;
    }


    if (currentPage > totalPages) {
        currentPage = totalPages > 0 ? totalPages : 1;
    } else if (currentPage < 1) {
        currentPage = 1;
    }

     goToSlide(currentPage, false); // Update posisi tanpa animasi saat kalkulasi ulang
    updateUI();
}

// Fungsi untuk menggerakkan slider ke halaman tertentu
function goToSlide(pageNumber, useTransition = true) {
    // Pastikan track ada
     if (!track) return;

    currentPage = Math.max(1, Math.min(pageNumber, totalPages));

    let targetTranslateX = 0;
    if (totalPages > 1) {
        targetTranslateX = - (currentPage - 1) * slideAmountPx;
        const maxTranslateX = -(track.scrollWidth - viewport.offsetWidth);
        targetTranslateX = Math.max(maxTranslateX, targetTranslateX);
    }

    track.style.transition = useTransition ? 'transform 0.5s ease-in-out' : 'none';
    track.style.transform = `translateX(${targetTranslateX}px)`;

    updateUI();
}

// Fungsi untuk memperbarui counter dan status tombol
function updateUI() {
    // Pastikan elemen UI ada
    if (!counterElement || !prevButton || !nextButton) return;

    counterElement.textContent = `${currentPage} / ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages || totalPages <= 1;
}

// --- Event Listeners ---

// Pastikan tombol ada sebelum menambahkan listener
if (nextButton) {
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            goToSlide(currentPage + 1);
        }
    });
}

if (prevButton) {
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            goToSlide(currentPage - 1);
        }
    });
}


// Recalculate on window resize (dengan debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
         // Reset posisi sebelum kalkulasi ulang bisa membantu akurasi
         if (track) {
             track.style.transition = 'none';
             track.style.transform = 'translateX(0)';
         }
         currentPage = 1; // Reset ke halaman 1 saat resize
        calculateSliderParams();
    }, 250);
});

// --- Initial Setup ---
// Tunggu sebentar agar layout stabil sebelum kalkulasi awal
// (berguna jika ada font loading atau elemen lain yg butuh waktu render)
setTimeout(calculateSliderParams, 100); // Sedikit delay bisa membantu
