// car-detail.js - Handle individual car detail page

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    if (!carId) {
        window.location.href = 'inventory.html';
        return;
    }
    
    await loadCarDetails(carId);
});

async function loadCarDetails(carId) {
    const loadingIndicator = document.getElementById('loading-indicator');
    const detailContent = document.getElementById('car-detail-content');
    
    try {
        // Load all cars and find the specific one
        const cars = await loadCarsFromGitHub();
        const car = cars.find(c => c.id === carId);
        
        if (!car || car.status === 'draft') {
            alert('Car not found or not available');
            window.location.href = 'inventory.html';
            return;
        }
        
        loadingIndicator.style.display = 'none';
        detailContent.style.display = 'block';
        
        displayCarDetails(car);
        
    } catch (error) {
        console.error('Error loading car details:', error);
        alert('Error loading car details');
        window.location.href = 'inventory.html';
    }
}

function displayCarDetails(car) {
    // Set page title
    document.title = `${car.year} ${car.make} ${car.model} - Elite Auto Gallery`;
    
    // Display images
    displayGallery(car.images || []);
    
    // Display car information
    const carInfo = document.getElementById('car-info');
    
    // Status badge
    let statusHTML = '';
    if (car.availability === 'sold') {
        statusHTML = '<span class="status-badge status-sold">Sold</span>';
    } else if (car.availability === 'reserved') {
        statusHTML = '<span class="status-badge status-reserved">Reserved</span>';
    }
    
    // Price
    const priceText = car.price ? `£${Number(car.price).toLocaleString()}` : 'Price on Application';
    
    carInfo.innerHTML = `
        <h1>${car.year} ${car.make} ${car.model}</h1>
        ${car.trim ? `<p style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">${car.trim}</p>` : ''}
        ${statusHTML}
        
        <div class="car-price-section">
            <div class="car-price-large">${priceText}</div>
        </div>
        
        <div class="specs-grid">
            <div class="spec-item">
                <i class="fas fa-tachometer-alt"></i>
                <div class="spec-content">
                    <h4>Mileage</h4>
                    <p>${Number(car.mileage).toLocaleString()} miles</p>
                </div>
            </div>
            
            <div class="spec-item">
                <i class="fas fa-calendar"></i>
                <div class="spec-content">
                    <h4>Year</h4>
                    <p>${car.year}</p>
                </div>
            </div>
            
            <div class="spec-item">
                <i class="fas fa-cog"></i>
                <div class="spec-content">
                    <h4>Transmission</h4>
                    <p>${car.transmission || 'N/A'}</p>
                </div>
            </div>
            
            <div class="spec-item">
                <i class="fas fa-gas-pump"></i>
                <div class="spec-content">
                    <h4>Fuel Type</h4>
                    <p>${car.fuelType || 'N/A'}</p>
                </div>
            </div>
            
            ${car.engineSize ? `
            <div class="spec-item">
                <i class="fas fa-engine"></i>
                <div class="spec-content">
                    <h4>Engine</h4>
                    <p>${car.engineSize}</p>
                </div>
            </div>
            ` : ''}
            
            ${car.power ? `
            <div class="spec-item">
                <i class="fas fa-bolt"></i>
                <div class="spec-content">
                    <h4>Power</h4>
                    <p>${car.power} BHP</p>
                </div>
            </div>
            ` : ''}
            
            <div class="spec-item">
                <i class="fas fa-palette"></i>
                <div class="spec-content">
                    <h4>Color</h4>
                    <p>${car.color || 'N/A'}</p>
                </div>
            </div>
            
            ${car.interiorColor ? `
            <div class="spec-item">
                <i class="fas fa-couch"></i>
                <div class="spec-content">
                    <h4>Interior</h4>
                    <p>${car.interiorColor}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="spec-item">
                <i class="fas fa-door-closed"></i>
                <div class="spec-content">
                    <h4>Doors</h4>
                    <p>${car.doors || 'N/A'}</p>
                </div>
            </div>
            
            <div class="spec-item">
                <i class="fas fa-users"></i>
                <div class="spec-content">
                    <h4>Seats</h4>
                    <p>${car.seats || 'N/A'}</p>
                </div>
            </div>
            
            ${car.bodyType ? `
            <div class="spec-item">
                <i class="fas fa-car"></i>
                <div class="spec-content">
                    <h4>Body Type</h4>
                    <p>${car.bodyType}</p>
                </div>
            </div>
            ` : ''}
            
            ${car.registration ? `
            <div class="spec-item">
                <i class="fas fa-id-card"></i>
                <div class="spec-content">
                    <h4>Registration</h4>
                    <p>${car.registration}</p>
                </div>
            </div>
            ` : ''}
        </div>
        
        ${car.features && car.features.length > 0 ? `
        <div class="features-section">
            <h3>Features & Equipment</h3>
            <div class="features-list">
                ${car.features.map(feature => `
                    <div class="feature-item">
                        <i class="fas fa-check-circle"></i>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${car.description ? `
        <div class="description-section">
            <h3>Description</h3>
            <div>${car.description}</div>
        </div>
        ` : ''}
        
        <div class="cta-buttons">
            ${car.availability !== 'sold' ? `
                <a href="contact.html?car=${encodeURIComponent(car.year + ' ' + car.make + ' ' + car.model)}" class="btn-cta btn-cta-primary">
                    <i class="fas fa-envelope"></i> Enquire Now
                </a>
                <a href="tel:+442012345678" class="btn-cta btn-cta-secondary">
                    <i class="fas fa-phone"></i> Call Us
                </a>
            ` : `
                <a href="inventory.html" class="btn-cta btn-cta-primary">
                    <i class="fas fa-search"></i> View Available Stock
                </a>
            `}
        </div>
    `;
}

function displayGallery(images) {
    const mainImage = document.getElementById('main-image');
    const thumbnailGrid = document.getElementById('thumbnail-grid');
    
    if (!images || images.length === 0) {
        mainImage.innerHTML = '<img src="https://via.placeholder.com/800x600?text=No+Image" alt="No image available">';
        return;
    }
    
    // Display main image
    mainImage.innerHTML = `<img src="${images[0]}" alt="Car image" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Available'">`;
    
    // Display thumbnails if there are multiple images
    if (images.length > 1) {
        thumbnailGrid.innerHTML = images.map((img, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', ${index})">
                <img src="${img}" alt="Thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/100x80?text=Error'">
            </div>
        `).join('');
    }
}

function changeMainImage(imageUrl, index) {
    const mainImage = document.getElementById('main-image');
    mainImage.innerHTML = `<img src="${imageUrl}" alt="Car image" onerror="this.src='https://via.placeholder.com/800x600?text=Image+Not+Available'">`;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}
