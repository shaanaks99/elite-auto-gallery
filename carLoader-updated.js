// carLoader.js - Utility to load cars from _cars/*.md files
// Updated to work with editorial workflow (no status field needed)

async function loadCarsFromGitHub() {
  try {
    const response = await fetch('https://api.github.com/repos/shaanaks99/elite-auto-gallery/contents/_cars');
    
    if (!response.ok) {
      console.error('Failed to fetch cars directory:', response.statusText);
      return [];
    }
    
    const files = await response.json();
    const carFiles = files.filter(file => file.name.endsWith('.md'));
    
    const cars = await Promise.all(
      carFiles.map(async (file) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        return parseCarMarkdown(content, file.name);
      })
    );
    
    // Return all cars (editorial workflow handles draft/publish status in GitHub branches)
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
      
      // Skip empty lines
      if (!trimmed) continue;
      
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
    
    // Extract description from content after frontmatter
    const descriptionMatch = content.match(/---\n[\s\S]*?---\n\n([\s\S]*)/);
    if (descriptionMatch && !car.description) {
      car.description = descriptionMatch[1].trim();
    }
    
    return car;
  } catch (error) {
    console.error('Error parsing car markdown:', filename, error);
    return null;
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadCarsFromGitHub, parseCarMarkdown };
}
