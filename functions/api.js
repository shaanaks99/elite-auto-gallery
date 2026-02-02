// Cloudflare Worker for W&M Autos CMS
// This handles authentication and GitHub commits

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Authentication endpoint
      if (path === '/api/auth' && request.method === 'POST') {
        const { password } = await request.json();
        
        // Simple password check (enhance with GitHub OAuth later)
        if (password === env.ADMIN_PASSWORD) {
          const token = btoa(`admin:${Date.now()}`);
          return jsonResponse({ success: true, token }, corsHeaders);
        }
        
        return jsonResponse({ success: false, message: 'Invalid password' }, corsHeaders, 401);
      }

      // Verify auth for all other endpoints
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return jsonResponse({ error: 'Unauthorized' }, corsHeaders, 401);
      }

      // Get all cars
      if (path === '/api/cars' && request.method === 'GET') {
        const cars = await getAllCars(env);
        return jsonResponse({ success: true, cars }, corsHeaders);
      }

      // Add new car
      if (path === '/api/cars' && request.method === 'POST') {
        const carData = await request.json();
        const result = await addCar(carData, env);
        return jsonResponse(result, corsHeaders);
      }

      // Update car
      if (path.startsWith('/api/cars/') && request.method === 'PUT') {
        const carId = path.split('/').pop();
        const carData = await request.json();
        const result = await updateCar(carId, carData, env);
        return jsonResponse(result, corsHeaders);
      }

      // Delete car
      if (path.startsWith('/api/cars/') && request.method === 'DELETE') {
        const carId = path.split('/').pop();
        const result = await deleteCar(carId, env);
        return jsonResponse(result, corsHeaders);
      }

      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
      
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ error: error.message }, corsHeaders, 500);
    }
  }
};

// Helper function for JSON responses
function jsonResponse(data, headers = {}, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

// GitHub API helper
async function githubRequest(path, method, body, env) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/${path}`;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'W&M-Autos-CMS'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Get all car markdown files from GitHub
async function getAllCars(env) {
  try {
    // Get all files in _cars directory with pagination support
    // GitHub API defaults to 30 items per page, we'll request 100 per page (max allowed)
    const contents = await githubRequest('contents/_cars?per_page=100', 'GET', null, env);
    
    const cars = [];
    
    for (const file of contents) {
      if (file.name.endsWith('.md')) {
        // Get file content
        const fileData = await githubRequest(`contents/_cars/${file.name}`, 'GET', null, env);
        const content = atob(fileData.content);
        
        // Parse frontmatter
        const car = parseFrontmatter(content);
        car.id = file.name.replace('.md', '');
        car.sha = fileData.sha; // Store SHA for updates
        cars.push(car);
      }
    }
    
    return cars;
  } catch (error) {
    console.error('Error getting cars:', error);
    return [];
  }
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return {};
  
  const frontmatter = match[1];
  const description = match[2].trim();
  
  const data = {};
  const lines = frontmatter.split('\n');
  
  let currentKey = null;
  let arrayValues = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('- ')) {
      // Array value
      arrayValues.push(line.trim().substring(2));
    } else if (line.includes(':')) {
      // Save previous array if exists
      if (currentKey && arrayValues.length > 0) {
        data[currentKey] = arrayValues;
        arrayValues = [];
      }
      
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      currentKey = key.trim();
      
      if (value) {
        // Parse value type
        if (value === 'true') data[currentKey] = true;
        else if (value === 'false') data[currentKey] = false;
        else if (!isNaN(value) && value !== '') data[currentKey] = Number(value);
        else data[currentKey] = value.replace(/^["']|["']$/g, '');
      }
    }
  }
  
  // Save last array if exists
  if (currentKey && arrayValues.length > 0) {
    data[currentKey] = arrayValues;
  }
  
  data.description = description;
  return data;
}

// Create markdown content from car data
function createMarkdown(carData) {
  let frontmatter = '---\n';
  
  const fields = [
    'make', 'model', 'year', 'trim', 'price', 'availability', 'featured',
    'mileage', 'transmission', 'fuelType', 'engineSize', 'bodyType',
    'doors', 'seats', 'color', 'registration'
  ];
  
  for (const field of fields) {
    if (carData[field] !== undefined && carData[field] !== null && carData[field] !== '') {
      let value = carData[field];
      
      // Format value based on type
      if (typeof value === 'string' && (value.includes(' ') || value.includes(':'))) {
        value = `"${value}"`;
      }
      
      frontmatter += `${field}: ${value}\n`;
    }
  }
  
  // Add images array
  if (carData.images && carData.images.length > 0) {
    frontmatter += 'images:\n';
    for (const image of carData.images) {
      const imagePath = typeof image === 'string' ? image : image.data;
      if (imagePath && !imagePath.startsWith('data:')) {
        frontmatter += `  - ${imagePath}\n`;
      }
    }
  }
  
  frontmatter += '---\n\n';
  
  // Add description
  if (carData.description) {
    frontmatter += carData.description;
  }
  
  return frontmatter;
}

// Add new car
async function addCar(carData, env) {
  try {
    // Generate filename from car details
    const filename = `${carData.year}-${carData.make}-${carData.model}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Handle image uploads
    const processedImages = [];
    if (carData.images && carData.images.length > 0) {
      for (const image of carData.images) {
        if (image.isNew && image.data && image.data.startsWith('data:')) {
          // Upload new image to GitHub
          const imageFilename = generateImageFilename(image.name);
          const imagePath = await uploadImage(image.data, imageFilename, env);
          processedImages.push(imagePath);
        } else if (typeof image === 'string') {
          processedImages.push(image);
        }
      }
    }
    
    carData.images = processedImages;
    
    // Create markdown content
    const content = createMarkdown(carData);
    
    // Commit to GitHub
    await githubRequest(`contents/_cars/${filename}.md`, 'PUT', {
      message: `Add car: ${carData.year} ${carData.make} ${carData.model}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: 'main'
    }, env);
    
    return { success: true, message: 'Car added successfully', id: filename };
  } catch (error) {
    console.error('Error adding car:', error);
    return { success: false, message: error.message };
  }
}

// Update existing car
async function updateCar(carId, carData, env) {
  try {
    // Get current file SHA
    const currentFile = await githubRequest(`contents/_cars/${carId}.md`, 'GET', null, env);
    
    // Handle image uploads
    const processedImages = [];
    if (carData.images && carData.images.length > 0) {
      for (const image of carData.images) {
        if (image.isNew && image.data && image.data.startsWith('data:')) {
          const imageFilename = generateImageFilename(image.name);
          const imagePath = await uploadImage(image.data, imageFilename, env);
          processedImages.push(imagePath);
        } else if (typeof image === 'string') {
          processedImages.push(image);
        } else if (image.data && !image.data.startsWith('data:')) {
          processedImages.push(image.data);
        }
      }
    }
    
    carData.images = processedImages;
    
    // Create updated markdown content
    const content = createMarkdown(carData);
    
    // Update file on GitHub
    await githubRequest(`contents/_cars/${carId}.md`, 'PUT', {
      message: `Update car: ${carData.year} ${carData.make} ${carData.model}`,
      content: btoa(unescape(encodeURIComponent(content))),
      sha: currentFile.sha,
      branch: 'main'
    }, env);
    
    return { success: true, message: 'Car updated successfully' };
  } catch (error) {
    console.error('Error updating car:', error);
    return { success: false, message: error.message };
  }
}

// Delete car
async function deleteCar(carId, env) {
  try {
    // Get file SHA
    const file = await githubRequest(`contents/_cars/${carId}.md`, 'GET', null, env);
    
    // Delete file from GitHub
    await githubRequest(`contents/_cars/${carId}.md`, 'DELETE', {
      message: `Delete car: ${carId}`,
      sha: file.sha,
      branch: 'main'
    }, env);
    
    return { success: true, message: 'Car deleted successfully' };
  } catch (error) {
    console.error('Error deleting car:', error);
    return { success: false, message: error.message };
  }
}

// Generate unique image filename
function generateImageFilename(originalName) {
  const ext = originalName.split('.').pop();
  const hash = Math.random().toString(36).substring(2, 15);
  return `${Date.now()}-${hash}.${ext}`;
}

// Upload image to GitHub
async function uploadImage(base64Data, filename, env) {
  try {
    // Remove data URL prefix
    const base64Content = base64Data.split(',')[1];
    
    // Upload to GitHub
    await githubRequest(`contents/images/cars/${filename}`, 'PUT', {
      message: `Upload car image: ${filename}`,
      content: base64Content,
      branch: 'main'
    }, env);
    
    return `/images/cars/${filename}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
