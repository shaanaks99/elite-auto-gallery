// carLoader.js - Updated to fetch from Cloudflare Worker API
// Customized for YOUR inventory.html structure

const API_BASE = 'https://wm-autos-api.moinworks09.workers.dev';

// Main function to load cars from API
async function loadCarsFromAPI() {
    try {
        console.log('Fetching cars from API...');
        const response = await fetch(`${API_BASE}/cars`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const cars = await response.json();
        console.log('Cars loaded:', cars.length);
        
        return cars;
    } catch (error) {
        console.error('Error loading cars from API:', error);
        return [];
    }
}

// Legacy function - now fetches from API instead of _cars folder
async function loadAllCars() {
    return await loadCarsFromAPI();
}

// Filter cars by status
function filterCarsByStatus(cars, status) {
    if (!status || status === 'all') {
        return cars;
    }
    
    if (status === 'default') {
        // Default: Show Available + Reserved (hide Sold)
        return cars.filter(car => 
            !car.status || 
            car.status.toLowerCase() !== 'sold'
        );
    }
    
    return cars.filter(car => 
        car.status && car.status.toLowerCase() === status.toLowerCase()
    );
}

// Get featured cars (for homepage)
function getFeaturedCars(cars, limit = 3) {
    const featured = cars.filter(car => 
        car.featured === true || car.status === 'Featured'
    );
    return featured.slice(0, limit);
}

// Format price with £ symbol
function formatPrice(price) {
    if (!price) return 'POA';
    return `£${parseInt(price).toLocaleString()}`;
}

// Create car card HTML (matches your existing style)
function createCarCard(car) {
    const imageUrl = car.images && car.images[0] 
        ? car.images[0] 
        : 'https://via.placeholder.com/400x300?text=No+Image';
    
    // Status badge HTML
    let statusBadgeHTML = '';
    if (car.status) {
        const statusLower = car.status.toLowerCase();
        let badgeClass = 'status-badge';
        
        if (statusLower === 'sold') badgeClass += ' badge-sold';
        else if (statusLower === 'reserved') badgeClass += ' badge-reserved';
        else if (statusLower === 'featured') badgeClass += ' badge-featured';
        else badgeClass += ' badge-available';
        
        statusBadgeHTML = `<span class="${badgeClass}">${car.status}</span>`;
    }
    
    return `
        <div class="car-card" data-car-id="${car.id}" data-status="${car.status || 'available'}">
            <div class="car-image-wrapper">
                ${statusBadgeHTML}
                <img src="${imageUrl}" 
                     alt="${car.make} ${car.model}" 
                     class="car-image"
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            </div>
            <div class="car-info">
                <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
                <p class="car-price">${formatPrice(car.price)}</p>
                
                <div class="car-specs">
                    <span class="spec-item">
                        <i class="fas fa-calendar"></i> ${car.year}
                    </span>
                    <span class="spec-item">
                        <i class="fas fa-cog"></i> ${car.transmission || 'N/A'}
                    </span>
                    <span class="spec-item">
                        <i class="fas fa-gas-pump"></i> ${car.fuelType || 'N/A'}
                    </span>
                    <span class="spec-item">
                        <i class="fas fa-road"></i> ${car.mileage ? car.mileage.toLocaleString() + ' miles' : 'N/A'}
                    </span>
                </div>
                
                ${car.description ? `<p class="car-description">${car.description.substring(0, 120)}...</p>` : ''}
                
                <div class="car-actions">
                    <a href="car-detail.html?id=${car.id}" class="btn btn-primary">View Details</a>
                    <a href="contact.html?car=${encodeURIComponent(car.year + ' ' + car.make + ' ' + car.model)}" class="btn btn-secondary">Enquire</a>
                </div>
            </div>
        </div>
    `;
}

// Display cars on page - USES YOUR HTML IDs
function displayCars(cars) {
    const container = document.getElementById('inventory-grid');
    const loadingEl = document.getElementById('loading-indicator');
    const errorEl = document.getElementById('error-message');
    const noResultsEl = document.getElementById('no-results');
    const countEl = document.getElementById('car-count');
    
    // Hide loading
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    
    if (!container) {
        console.error('Container #inventory-grid not found');
        return;
    }
    
    // Update count
    if (countEl) {
        countEl.textContent = `${cars.length} vehicle${cars.length !== 1 ? 's' : ''} found`;
    }
    
    if (cars.length === 0) {
        container.style.display = 'none';
        if (noResultsEl) noResultsEl.style.display = 'block';
        return;
    }
    
    // Show grid and hide no results
    if (noResultsEl) noResultsEl.style.display = 'none';
    container.style.display = 'grid';
    
    // Render cars
    container.innerHTML = cars.map(car => createCarCard(car)).join('');
}

// Initialize inventory page - USES YOUR HTML STRUCTURE
async function initInventoryPage() {
    const loadingEl = document.getElementById('loading-indicator');
    const errorEl = document.getElementById('error-message');
    const container = document.getElementById('inventory-grid');
    
    if (loadingEl) loadingEl.style.display = 'block';
    if (errorEl) errorEl.style.display = 'none';
    if (container) container.style.display = 'none';
    
    try {
        const allCars = await loadCarsFromAPI();
        
        // Store globally for filtering
        window.allCars = allCars;
        
        // Default filter: Show Available + Reserved (hide Sold)
        window.filteredCars = filterCarsByStatus(allCars, 'default');
        
        // Display cars
        displayCars(window.filteredCars);
        
        // Setup filter buttons
        setupStatusFilters();
        
    } catch (error) {
        console.error('Failed to initialize inventory:', error);
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) {
            errorEl.style.display = 'block';
            errorEl.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>Unable to load vehicles. Please try again later.</p>
                <button class="btn btn-primary" onclick="initInventoryPage()">Retry</button>
            `;
        }
    }
}

// Setup status filter buttons - USES YOUR FILTER STRUCTURE
function setupStatusFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter status
            const status = this.getAttribute('data-status');
            
            // Filter and display
            window.filteredCars = filterCarsByStatus(window.allCars, status);
            displayCars(window.filteredCars);
        });
    });
}

// Initialize homepage featured cars (if on homepage)
async function initHomepage() {
    try {
        const allCars = await loadCarsFromAPI();
        const featured = getFeaturedCars(allCars);
        
        const featuredContainer = document.getElementById('featured-cars-grid');
        if (featuredContainer && featured.length > 0) {
            featuredContainer.innerHTML = featured.map(car => createCarCard(car)).join('');
        }
        
    } catch (error) {
        console.error('Failed to load featured cars:', error);
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadCarsFromAPI,
        loadAllCars,
        filterCarsByStatus,
        getFeaturedCars,
        formatPrice,
        createCarCard,
        displayCars,
        initInventoryPage,
        initHomepage
    };
}
