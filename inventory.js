// inventory.js - Handle inventory page functionality

let allCars = [];
let currentFilter = 'default'; // default shows available + reserved

document.addEventListener('DOMContentLoaded', async () => {
    await loadAndDisplayCars();
    setupFilterButtons();
    setupMobileMenu();
});

async function loadAndDisplayCars() {
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const inventoryGrid = document.getElementById('inventory-grid');
    
    try {
        // Load cars from GitHub _cars folder
        allCars = await loadCarsFromGitHub();
        
        // Filter out draft cars (only show published)
        allCars = allCars.filter(car => car.status !== 'draft');
        
        if (allCars.length === 0) {
            loadingIndicator.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.querySelector('p').textContent = 'No vehicles available at the moment.';
            return;
        }
        
        // Sort by date (newest first) or by featured status
        allCars.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        });
        
        loadingIndicator.style.display = 'none';
        inventoryGrid.style.display = 'grid';
        
        // Display with default filter (available + reserved)
        displayCars(currentFilter);
        
    } catch (error) {
        console.error('Error loading cars:', error);
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

function displayCars(filterStatus) {
    const inventoryGrid = document.getElementById('inventory-grid');
    const noResults = document.getElementById('no-results');
    const carCount = document.getElementById('car-count');
    
    // Filter cars based on status
    let filteredCars = [];
    
    switch(filterStatus) {
        case 'all':
            filteredCars = allCars;
            break;
        case 'available':
            filteredCars = allCars.filter(car => car.availability === 'available');
            break;
        case 'reserved':
            filteredCars = allCars.filter(car => car.availability === 'reserved');
            break;
        case 'sold':
            filteredCars = allCars.filter(car => car.availability === 'sold');
            break;
        case 'default':
        default:
            // Default: show available + reserved only
            filteredCars = allCars.filter(car => 
                car.availability === 'available' || car.availability === 'reserved'
            );
            break;
    }
    
    // Update count
    carCount.textContent = `${filteredCars.length} vehicle${filteredCars.length !== 1 ? 's' : ''}`;
    
    if (filteredCars.length === 0) {
        inventoryGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    inventoryGrid.style.display = 'grid';
    
    // Clear existing content
    inventoryGrid.innerHTML = '';
    
    // Create car cards
    filteredCars.forEach(car => {
        const carCard = createCarCard(car);
        inventoryGrid.appendChild(carCard);
    });
}

function createCarCard(car) {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.dataset.availability = car.availability || 'available';
    
    // Status badge
    let statusBadge = '';
    if (car.availability === 'sold') {
        statusBadge = '<span class="status-badge status-sold">Sold</span>';
    } else if (car.availability === 'reserved') {
        statusBadge = '<span class="status-badge status-reserved">Reserved</span>';
    }
    
    // Featured badge
    let featuredBadge = car.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : '';
    
    // Main image
    const mainImage = car.images && car.images.length > 0 ? car.images[0] : 'https://via.placeholder.com/400x300?text=No+Image';
    
    // Price formatting
    const priceText = car.price ? `£${Number(car.price).toLocaleString()}` : 'POA';
    
    card.innerHTML = `
        <div class="car-image">
            <img src="${mainImage}" alt="${car.make} ${car.model}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Available'">
            ${featuredBadge}
            ${statusBadge}
        </div>
        <div class="car-details">
            <h3>${car.year} ${car.make} ${car.model}</h3>
            ${car.trim ? `<p class="car-trim">${car.trim}</p>` : ''}
            <div class="car-specs">
                <span><i class="fas fa-tachometer-alt"></i> ${Number(car.mileage).toLocaleString()} miles</span>
                <span><i class="fas fa-cog"></i> ${car.transmission || 'N/A'}</span>
                <span><i class="fas fa-gas-pump"></i> ${car.fuelType || 'N/A'}</span>
            </div>
            <div class="car-footer">
                <span class="car-price">${priceText}</span>
                <a href="car-detail.html?id=${car.id}" class="btn-primary">View Details</a>
            </div>
        </div>
    `;
    
    return card;
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter status and display
            currentFilter = button.dataset.status;
            displayCars(currentFilter);
        });
    });
}

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
}
