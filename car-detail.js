// car-detail-SYTNER-STYLE.js - Car detail page with image gallery

let currentCar = null;
let currentImageIndex = 0;
let allImages = [];

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        showError('No car specified');
        return;
    }
    
    await loadCarDetails(carId);
    setupMobileMenu();
});

async function loadCarDetails(carId) {
    try {
        // Load car from GitHub
        const car = await loadCarFromGitHub(carId);
        
        if (!car) {
            showError('Car not found');
            return;
        }
        
        currentCar = car;
        displayCarDetails(car);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('car-detail-content').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading car details:', error);
        showError('Failed to load car details');
    }
}

async function loadCarFromGitHub(carId) {
    try {
        const response = await fetch(`https://api.github.com/repos/shaanaks99/elite-auto-gallery/contents/_cars/${carId}.md`);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        const content = atob(data.content);
        return parseCarMarkdown(content, carId);
        
    } catch (error) {
        console.error('Error loading car:', error);
        return null;
    }
}

function parseCarMarkdown(content, carId) {
    try {
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            return null;
        }
        
        const frontmatter = frontmatterMatch[1];
        const car = { id: carId };
        
        const lines = frontmatter.split('\n');
        let currentKey = null;
        let currentArray = null;
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('- ') && currentArray) {
                currentArray.push(trimmed.substring(2).trim());
                continue;
            }
            
            const match = trimmed.match(/^(\w+):\s*(.*)$/);
            if (match) {
                const [, key, value] = match;
                currentKey = key;
                
                if (value === '') {
                    currentArray = [];
                    car[key] = currentArray;
                } else {
                    currentArray = null;
                    if (value === 'true') {
                        car[key] = true;
                    } else if (value === 'false') {
                        car[key] = false;
                    } else if (!isNaN(value) && value !== '') {
                        car[key] = Number(value);
                    } else {
                        car[key] = value.replace(/^["']|["']$/g, '');
                    }
                }
            }
        }
        
        const descriptionMatch = content.match(/---\n[\s\S]*?---\n\n([\s\S]*)/);
        if (descriptionMatch) {
            car.body = descriptionMatch[1].trim();
            car.description = descriptionMatch[1].trim();
        }
        
        return car;
    } catch (error) {
        console.error('Error parsing car markdown:', error);
        return null;
    }
}

function displayCarDetails(car) {
    // Title
    const title = `${car.year} ${car.make} ${car.model}${car.trim ? ' ' + car.trim : ''}`;
    document.getElementById('car-title').textContent = title;
    document.title = `${title} - Elite Auto Gallery`;
    
    // Price
    const formattedPrice = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0
    }).format(car.price);
    document.getElementById('car-price').textContent = formattedPrice;
    
    // Badges
    const badgesContainer = document.getElementById('car-badges');
    let badges = '';
    if (car.featured) {
        badges += '<span class="badge featured">Featured</span>';
    }
    if (car.availability === 'available') {
        badges += '<span class="badge available">Available</span>';
    }
    badgesContainer.innerHTML = badges;
    
    // Images
    setupImageGallery(car);
    
    // Key Specs
    displayKeySpecs(car);
    
    // Description
    const descriptionEl = document.getElementById('car-description');
    descriptionEl.innerHTML = car.body || car.description || '<p>No description available.</p>';
    
    // Features
    if (car.features && car.features.length > 0) {
        document.getElementById('car-features-section').style.display = 'block';
        const featuresList = document.getElementById('car-features');
        featuresList.innerHTML = car.features.map(feature => 
            `<li><i class="fas fa-check"></i> ${feature}</li>`
        ).join('');
    }
    
    // Additional Details
    displayAdditionalDetails(car);
}

function setupImageGallery(car) {
    allImages = car.images && car.images.length > 0 ? car.images : ['https://via.placeholder.com/800x600?text=No+Image'];
    currentImageIndex = 0;
    
    // Display main image
    const mainImage = document.getElementById('main-image');
    mainImage.src = allImages[0];
    mainImage.alt = `${car.year} ${car.make} ${car.model}`;
    
    // Show navigation if multiple images
    if (allImages.length > 1) {
        document.getElementById('prev-image').style.display = 'flex';
        document.getElementById('next-image').style.display = 'flex';
        document.getElementById('thumbnail-container').style.display = 'block';
        
        // Create thumbnails
        const thumbnailGallery = document.getElementById('thumbnail-gallery');
        thumbnailGallery.innerHTML = allImages.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${img}" alt="Image ${index + 1}">
            </div>
        `).join('');
        
        // Thumbnail click handlers
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.index);
                showImage(index);
            });
        });
        
        // Navigation button handlers
        document.getElementById('prev-image').addEventListener('click', () => {
            showImage(currentImageIndex - 1);
        });
        
        document.getElementById('next-image').addEventListener('click', () => {
            showImage(currentImageIndex + 1);
        });
        
        // Thumbnail scroll buttons
        const thumbnailGalleryEl = document.getElementById('thumbnail-gallery');
        document.getElementById('scroll-left').addEventListener('click', () => {
            thumbnailGalleryEl.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        document.getElementById('scroll-right').addEventListener('click', () => {
            thumbnailGalleryEl.scrollBy({ left: 200, behavior: 'smooth' });
        });
    }
}

function showImage(index) {
    if (index < 0) index = allImages.length - 1;
    if (index >= allImages.length) index = 0;
    
    currentImageIndex = index;
    
    // Update main image
    document.getElementById('main-image').src = allImages[index];
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // Scroll thumbnail into view
    const activeThumbnail = document.querySelector(`.thumbnail[data-index="${index}"]`);
    if (activeThumbnail) {
        activeThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function displayKeySpecs(car) {
    const specs = [
        { icon: 'fa-calendar', label: 'Year', value: car.year },
        { icon: 'fa-tachometer-alt', label: 'Mileage', value: `${car.mileage.toLocaleString()} miles` },
        { icon: 'fa-cog', label: 'Transmission', value: car.transmission },
        { icon: 'fa-gas-pump', label: 'Fuel Type', value: car.fuelType },
    ];
    
    if (car.engineSize) {
        specs.push({ icon: 'fa-engine', label: 'Engine', value: car.engineSize });
    }
    
    if (car.power) {
        specs.push({ icon: 'fa-bolt', label: 'Power', value: `${car.power} BHP` });
    }
    
    if (car.bodyType) {
        specs.push({ icon: 'fa-car', label: 'Body Type', value: car.bodyType });
    }
    
    if (car.color) {
        specs.push({ icon: 'fa-palette', label: 'Exterior Color', value: car.color });
    }
    
    const specsContainer = document.getElementById('key-specs');
    specsContainer.innerHTML = specs.map(spec => `
        <div class="spec-item">
            <i class="fas ${spec.icon}"></i>
            <div>
                <p class="spec-label">${spec.label}</p>
                <p class="spec-value">${spec.value}</p>
            </div>
        </div>
    `).join('');
}

function displayAdditionalDetails(car) {
    const details = [];
    
    if (car.doors) {
        details.push({ label: 'Doors', value: car.doors });
    }
    
    if (car.seats) {
        details.push({ label: 'Seats', value: car.seats });
    }
    
    if (car.interiorColor) {
        details.push({ label: 'Interior Color', value: car.interiorColor });
    }
    
    if (car.registration) {
        details.push({ label: 'Registration', value: car.registration });
    }
    
    if (details.length > 0) {
        const detailsContainer = document.getElementById('additional-details');
        detailsContainer.innerHTML = `
            <h2>Additional Details</h2>
            <div class="details-grid">
                ${details.map(detail => `
                    <div class="detail-item">
                        <span class="detail-label">${detail.label}:</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

function showError(message) {
    document.getElementById('loading').innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <p>${message}</p>
        <a href="gallery.html" class="btn">Back to Inventory</a>
    `;
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}
