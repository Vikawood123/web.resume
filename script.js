// ТЕСТОВЫЙ КОД - добавьте в самое начало script.js
console.log('=== ТЕСТ ЗАГРУЗКИ JSON ===');

// Пробуем загрузить курсы
fetch('data/courses.json')
  .then(response => {
    console.log('Статус ответа courses.json:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Курсы загружены:', data.courses.length, 'курсов');
    console.log('Первый курс:', data.courses[0]?.title);
  })
  .catch(error => {
    console.error('Ошибка загрузки курсов:', error);
  });

// Пробуем загрузить проекты
fetch('data/projects.json')
  .then(response => {
    console.log('Статус ответа projects.json:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Проекты загружены:', data.projects?.length || 0, 'проектов');
  })
  .catch(error => {
    console.error('Ошибка загрузки проектов:', error);
  });
// ===== ОСНОВНОЙ СКРИПТ САЙТА =====

// Конфигурация
const CONFIG = {
    dataPath: 'data/',
    defaultTheme: 'light'
};

// Главная функция инициализации
class ResumeApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || CONFIG.defaultTheme;
        this.courses = [];
        this.projects = [];
    }

    // Инициализация приложения
    async init() {
        this.setupEventListeners();
        this.loadTheme();
        await this.loadData();
        this.renderCourses();
        this.renderProjects();
        this.setupNavigation();
        this.createThemeToggle();
    }

    // Настройка слушателей событий
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
    }

    // Когда DOM загружен
    onDOMLoaded() {
        console.log('Сайт загружен!');
    }

    // Загрузка данных из JSON
    async loadData() {
        try {
            const [coursesResponse, projectsResponse] = await Promise.all([
                fetch(`${CONFIG.dataPath}courses.json`),
                fetch(`${CONFIG.dataPath}projects.json`)
            ]);

            if (!coursesResponse.ok || !projectsResponse.ok) {
                throw new Error('Ошибка загрузки данных');
            }

            const coursesData = await coursesResponse.json();
            const projectsData = await projectsResponse.json();

            this.courses = coursesData.courses;
            this.projects = projectsData.projects;

            console.log('Данные загружены:', {
                courses: this.courses.length,
                projects: this.projects.length
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            // Используем дефолтные данные если JSON не загрузился
            this.loadDefaultData();
        }
    }

    // Дефолтные данные (на случай ошибки)
    loadDefaultData() {
        this.courses = [
            {
                id: 1,
                title: "Frontend разработка",
                platform: "Яндекс Лицей",
                image: "images/cert1.png",
                description: "Основы веб-разработки, HTML, CSS, JavaScript, создание адаптивных интерфейсов.",
                skills: ["HTML5", "CSS3", "JavaScript", "Адаптивный дизайн"],
                courseUrl: "https://yandexlyceum.ru"
            }
        ];
        this.projects = [
            {
                id: 1,
                title: "Документооборот в команде",
                image: "images/comanda.jpg",
                description: "Организация системы документооборота для командной работы с использованием Google Таблиц.",
                role: "Аналитик данных",
                status: "Завершен",
                duration: "1 месяц",
                teamSize: 4,
                technologies: ["Google Sheets", "Google Forms", "Data Analysis"],
                features: ["Создание структурированных Google Таблиц", "Оптимизация процессов"],
                links: [{ name: "Пример таблицы", url: "#", icon: "fab fa-google" }]
            }
        ];
    }

    // Рендер курсов из JSON
    renderCourses() {
        const coursesGrid = document.querySelector('.courses-grid');
        if (!coursesGrid || this.courses.length === 0) return;

        coursesGrid.innerHTML = this.courses.map(course => `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-header">
                    <h3>${course.title}</h3>
                    <p class="platform">${course.platform}</p>
                </div>
                <div class="course-content">
                    <div class="certificate-image">
                        <img src="${course.image}" alt="Сертификат ${course.title}" class="certificate-img">
                    </div>
                    <div class="course-description">
                        <p><strong>Краткое описание:</strong> ${course.description}</p>
                    </div>
                    <div class="course-skills">
                        <div class="skills-list">
                            ${course.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    <a href="${course.courseUrl}" target="_blank" class="certificate-btn">
                        <i class="fas fa-external-link-alt"></i> Сайт курса
                    </a>
                </div>
            </div>
        `).join('');

        // Добавляем анимации
        this.animateCards('.course-card');
    }

    // Рендер проектов из JSON
    renderProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || this.projects.length === 0) return;

        projectsGrid.innerHTML = this.projects.map(project => `
            <div class="project-card" data-project-id="${project.id}">
               <div class="project-image">
                 <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                      <div class="project-badge">${project.status}</div>
                     </div>
                </div>
                <div class="project-info">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-status">${project.role}</span>
                    </div>
                    
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-details">
                        <div class="project-role">
                            <i class="fas fa-user-tie"></i>
                            <span><strong>Моя роль:</strong> ${project.role}</span>
                        </div>
                        <div class="project-duration">
                            <i class="fas fa-calendar-alt"></i>
                            <span><strong>Длительность:</strong> ${project.duration}</span>
                        </div>
                        ${project.teamSize ? `
                        <div class="project-team">
                            <i class="fas fa-users"></i>
                            <span><strong>Команда:</strong> ${project.teamSize} человека</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    
                    <div class="project-features">
                        <h4>Что было сделано:</h4>
                        <ul class="features-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-links">
                        ${project.links.map(link => `
                            <a href="${link.url}" target="_blank" class="project-link">
                                <i class="${link.icon}"></i> ${link.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        // Добавляем анимации
        this.animateCards('.project-card');
    }

    // Анимация карточек
    animateCards(selector) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            card.style.animationDelay = `${0.1 * (index + 1)}s`;
            card.classList.add('animated');
        });
    }

    // Настройка навигации
    setupNavigation() {
        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Активная навигация при скролле
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Управление темой
    loadTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    toggleTheme() {
        if (this.currentTheme === 'light') {
            this.currentTheme = 'dark';
            document.body.classList.add('dark-theme');
        } else {
            this.currentTheme = 'light';
            document.body.classList.remove('dark-theme');
        }
        
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeToggleIcon();
    }

    createThemeToggle() {
        // Удаляем старую кнопку если есть
        const oldToggle = document.querySelector('.theme-toggle');
        if (oldToggle) oldToggle.remove();

        // Создаем новую кнопку
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        toggleBtn.title = 'Сменить тему';
        toggleBtn.addEventListener('click', () => this.toggleTheme());
        
        document.body.appendChild(toggleBtn);
    }

    updateThemeToggleIcon() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Запуск приложения
const app = new ResumeApp();
app.init();