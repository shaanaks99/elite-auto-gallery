// app.js - Gallery page with dynamic car loading from _cars folder

// Load cars from GitHub _cars folder
async function loadCarsFromGitHub() {
  try {
    const response = await fetch('https://api.github.com/repos/shaanaks99/elite-auto-gallery/contents/_cars');
    
    if (!response.ok) {
      console.error('Failed to fetch cars directory:', response.statusText);
      return [];
    }
    
    const files = await response.json();
    const carFiles = files.filter(file => file.name.endsWith('.md') && file.name !== '.gitkeep');
    
    const cars = await Promise.all(
      carFiles.map(async (file) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        return parseCarMarkdown(content, file.name);
      })
    );
    
    return cars.filter(car => car !== null);
  } catch (error) {
    console.error('Error loading cars:', error);
    return [];
  }
}

function parseCarMarkdown(content, filename) {
  try {
    // Extract frontmatter between --- markers
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      console.error('No frontmatter found in:', filename);
      return null;
    }
    
    const frontmatter = frontmatterMatch[1];
    const car = {
      id: filename.replace('.md', '')
    };
    
    // Parse YAML-style frontmatter
    const lines = frontmatter.split('\n');
    let currentKey = null;
    let currentArray = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Handle array items
      if (trimmed.startsWith('- ') && currentArray) {
        currentArray.push(trimmed.substring(2).trim());
        continue;
      }
      
      // Handle key-value pairs
      const match = trimmed.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        currentKey = key;
        
        // Check if this starts an array
        if (value === '') {
          currentArray = [];
          car[key] = currentArray;
        } else {
          currentArray = null;
          // Parse the value
          if (value === 'true') {
            car[key] = true;
          } else if (value === 'false') {
            car[key] = false;
          } else if (!isNaN(value) && value !== '') {
            car[key] = Number(value);
          } else {
            // Remove quotes if present
            car[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
    
    // Extract description from content after frontmatter (body)
    const descriptionMatch = content.match(/---\n[\s\S]*?---\n\n([\s\S]*)/);
    if (descriptionMatch) {
      car.body = descriptionMatch[1].trim();
      car.description = descriptionMatch[1].trim();
    }
    
    return car;
  } catch (error) {
    console.error('Error parsing car markdown:', filename, error);
    return null;
  }
}

let allCars = [];
let filteredCars = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Gallery page loaded, fetching cars...');
    
    // Load cars from GitHub
    allCars = await loadCarsFromGitHub();
    console.log('Loaded cars:', allCars);
    
    // Filter out draft cars and only show available ones
    allCars = allCars.filter(car => car.availability === 'available');
    
    filteredCars = [...allCars];
    displayCars(filteredCars);
    updateResultsCount(filteredCars.length);
    
    // Set up event listeners
    setupFilters();
    setupMobileMenu();
});

function displayCars(cars) {
    const carGrid = document.getElementById('car-grid');
    const resultsCount = document.getElementById('results-count');
    
    if (cars.length === 0) {
        carGrid.innerHTML = '<div class="no-results"><p>No vehicles found matching your criteria.</p></div>';
        resultsCount.textContent = '0 vehicles found';
        return;
    }
    
    carGrid.innerHTML = cars.map(car => createCarCard(car)).join('');
    resultsCount.textContent = `${cars.length} vehicle${cars.length !== 1 ? 's' : ''} found`;
}

function createCarCard(car) {
    // Get the first image or use a placeholder
    const imageUrl = car.images && car.images.length > 0 
        ? car.images[0] 
        : 'https://via.placeholder.com/400x300?text=No+Image';
    
    // Format price with UK currency
    const formattedPrice = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0
    }).format(car.price);
    
    // Get featured badge
    const featuredBadge = car.featured ? '<span class="badge featured">Featured</span>' : '';
    
    // Get availability badge (should all be available since we filtered)
    const availabilityBadge = '<span class="badge available">Available</span>';
    
    return `
        <div class="car-card animate-fade-in" onclick="window.location.href='car-detail.html?id=${car.id}'" style="cursor: pointer;">
            ${featuredBadge}
            ${availabilityBadge}
            <div class="car-image">
                <img src="${imageUrl}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
            </div>
            <div class="car-details">
                <h3 class="car-title">${car.year} ${car.make} ${car.model}</h3>
                ${car.trim ? `<p class="car-trim">${car.trim}</p>` : ''}
                <div class="car-specs">
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} miles</span>
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                </div>
                <div class="car-price-action">
                    <p class="car-price">${formattedPrice}</p>
                    <a href="car-detail.html?id=${car.id}" class="btn-secondary" onclick="event.stopPropagation();">View Details</a>
                </div>
            </div>
        </div>
    `;
}

function setupFilters() {
    const searchInput = document.getElementById('search');
    const bodyTypeSelect = document.getElementById('body-type');
    const fuelTypeSelect = document.getElementById('fuel-type');
    const transmissionSelect = document.getElementById('transmission');
    
    searchInput.addEventListener('input', applyFilters);
    bodyTypeSelect.addEventListener('change', applyFilters);
    fuelTypeSelect.addEventListener('change', applyFilters);
    transmissionSelect.addEventListener('change', applyFilters);
}

function applyFilters() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const bodyType = document.getElementById('body-type').value;
    const fuelType = document.getElementById('fuel-type').value;
    const transmission = document.getElementById('transmission').value;
    
    filteredCars = allCars.filter(car => {
        const matchesSearch = !searchTerm || 
            car.make.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.year.toString().includes(searchTerm);
            
        const matchesBodyType = bodyType === 'all' || car.bodyType === bodyType;
        const matchesFuelType = fuelType === 'all' || car.fuelType === fuelType;
        const matchesTransmission = transmission === 'all' || car.transmission === transmission;
        
        return matchesSearch && matchesBodyType && matchesFuelType && matchesTransmission;
    });
    
    displayCars(filteredCars);
    updateResultsCount(filteredCars.length);
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    resultsCount.textContent = `${count} vehicle${count !== 1 ? 's' : ''} found`;
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
