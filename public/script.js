// Theme Toggle Functions
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const mainContainer = document.getElementById('mainContainer');

// Set initial theme
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
themeIcon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', function () {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    themeIcon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        themeIcon.style.transform = 'rotate(0deg)';
    }, 150);
});

// Error display
function showError(message) {
    const errorDiv = document.querySelector(".error");
    const errorText = errorDiv.querySelector("p");
    errorText.textContent = message;
    errorDiv.classList.add('show');

    setTimeout(() => {
        errorDiv.classList.remove('show');
    }, 5000);
}

function hideError() {
    const errorDiv = document.querySelector(".error");
    errorDiv.classList.remove('show');
}

// Loading state
function setLoadingState(isLoading) {
    const searchBtn = document.querySelector(".search-btn");
    const searchText = searchBtn.querySelector(".search-text");
    const spinner = searchBtn.querySelector(".spinner-border");

    if (isLoading) {
        searchBtn.classList.add('loading');
        searchBtn.disabled = true;
        searchText.style.opacity = '0';
        spinner.classList.remove('d-none');
    } else {
        searchBtn.classList.remove('loading');
        searchBtn.disabled = false;
        searchText.style.opacity = '1';
        spinner.classList.add('d-none');
    }
}

// Show/hide weather
function showWeather() {
    const weatherDiv = document.querySelector(".weather");
    weatherDiv.classList.add('show');

    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.style.animation = 'fadeIn 0.6s ease-out forwards';
    });
}

function hideWeather() {
    const weatherDiv = document.querySelector(".weather");
    weatherDiv.classList.remove('show');
}

// Time formatter
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Icon mapper
function getWeatherIcon(weatherMain) {
    const iconMap = {
        'clouds': 'https://cdn-icons-png.flaticon.com/512/414/414825.png',
        'clear': 'https://cdn-icons-png.flaticon.com/512/869/869869.png',
        'rain': 'https://cdn-icons-png.flaticon.com/512/1163/1163624.png',
        'drizzle': 'https://cdn-icons-png.flaticon.com/512/4005/4005903.png',
        'mist': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'fog': 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png',
        'snow': 'https://cdn-icons-png.flaticon.com/512/642/642102.png',
        'thunderstorm': 'https://cdn-icons-png.flaticon.com/512/1146/1146860.png'
    };
    return iconMap[weatherMain.toLowerCase()] || 'https://cdn-icons-png.flaticon.com/512/869/869869.png';
}

// Weather fetch
async function checkWeather(city) {
    setLoadingState(true);
    hideError();

    try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        if (!response.ok) {
            const errData = await response.json();
            hideWeather();
            showError(errData.error || "Something went wrong.");
            return;
        }

        const data = await response.json();

        document.querySelector(".city-name").innerHTML = data.name;
        document.querySelector(".country-name").innerHTML = data.sys.country;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = Math.round(data.wind.speed * 3.6) + " km/h";
        document.querySelector(".visibility").innerHTML = Math.round(data.visibility / 1000) + " km";
        document.querySelector(".weather-condition").innerHTML = data.weather[0].main;
        document.querySelector(".weather-description").innerHTML = data.weather[0].description;
        document.querySelector(".sunrise-time").innerHTML = formatTime(data.sys.sunrise);
        document.querySelector(".sunset-time").innerHTML = formatTime(data.sys.sunset);

        document.querySelector(".weather-icon").src = getWeatherIcon(data.weather[0].main);
        showWeather();
    } catch (error) {
        hideWeather();
        showError("Failed to fetch weather data. Please try again.");
        console.error('Weather API Error:', error);
    } finally {
        setLoadingState(false);
    }
}

// Input events
const searchbox = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", () => {
    const city = searchbox.value.trim();
    if (city) {
        checkWeather(city);
    } else {
        showError("Please enter a city name");
    }
});

searchbox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = searchbox.value.trim();
        if (city) {
            checkWeather(city);
        } else {
            showError("Please enter a city name");
        }
    }
});

searchbox.addEventListener("input", () => {
    hideError();
});

// Table animation observer
document.addEventListener('DOMContentLoaded', function () {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.weather-table tbody tr').forEach((row, i) => {
        row.style.opacity = '0';
        row.style.animationDelay = `${i * 0.05}s`;
        observer.observe(row);
    });

    document.querySelectorAll('.continent-section').forEach((section, i) => {
        section.style.opacity = '0';
        section.style.animationDelay = `${i * 0.2}s`;
        observer.observe(section);
    });
});

// Ripple effect
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.search-btn, .theme-toggle');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Inject ripple style
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .search-btn, .theme-toggle {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);
