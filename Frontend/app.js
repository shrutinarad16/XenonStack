document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginButton = document.getElementById('loginButton');
  const addPropertyButton = document.getElementById('addPropertyButton');
  const logoutButton = document.getElementById('logoutButton');

  if (token) {
    // User is logged in
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';

    // Check if the user is a property dealer
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const userInfo = JSON.parse(atob(base64));

    if (userInfo.isPropertyDealer) {
      addPropertyButton.style.display = 'block';
    }
  } else {
    // User is not logged in
    loginButton.style.display = 'block';
    addPropertyButton.style.display = 'none';
    logoutButton.style.display = 'none';
  }

  // Logout functionality
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token'); // Remove token from storage
    alert('You have been logged out.');
    window.location.href = 'login.html'; // Redirect to login page
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Login Successful");
        localStorage.setItem('token', result.token);
        window.location.href = 'index.html'; // Redirect to the home page
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  })
})

document.addEventListener('DOMContentLoaded', () => {

  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let isPropertyDealer = document.getElementById('isDealer');
  
    if (isPropertyDealer.checked) {
      isPropertyDealer = true;
    } else {
      isPropertyDealer = false;
    }
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, isPropertyDealer }),
      });
  
      const result = await response.json();
      console.log(response);
  
      if (response.ok) {
        alert('Register successful');
        localStorage.setItem('token', result.token); // Save the token
      } else {
        alert(result.message || 'failed');
      }
  
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  })
})


document.addEventListener('DOMContentLoaded', () => {
  const addPropertyForm = document.getElementById('addPropertyForm');
  addPropertyForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add a property.');
      return (window.location.href = './login.html');
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const userInfo = JSON.parse(atob(base64));
  
    if(!userInfo.isPropertyDealer){
      alert("You must be a dealer to add any property");
      return (window.location.href = './index.html');
    }
  
    // Collect form data
    const title = document.getElementById('title').value;
    const location = document.getElementById('location').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const houseType = document.getElementById('houseType').value;
    const image = document.getElementById('image').value;
  
    try {
      // Make a POST request to the backend
      const response = await fetch('http://localhost:5000/add-properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
        body: JSON.stringify({ title, location, price, description, houseType, image }), // Send property data
      });
  
      const result = await response.json();
      console.log(response)
  
      if (response.ok) {
        alert('Property added successfully!');
        addPropertyForm.reset(); // Clear the form after successful submission
      } else {
        alert(result.message || 'Error adding property.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the property.');
    }
  });
})

document.addEventListener('DOMContentLoaded', () => {
  const propertyList = document.getElementById('propertyList');
  const sortBySelect = document.createElement('select');
  const orderSelect = document.createElement('select');

  // Add filter dropdowns
  sortBySelect.innerHTML = `
      <option value="">Sort By</option>
      <option value="createdAt">Date Created</option>
      <option value="price">Price</option>
  `;
  orderSelect.innerHTML = `
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
  `;
  propertyList.parentElement.insertBefore(sortBySelect, propertyList);
  propertyList.parentElement.insertBefore(orderSelect, propertyList);

  // Fetch and render properties
  async function fetchAndRenderProperties(sortBy = '', order = '') {
      try {
          const url = new URL('http://localhost:5000/properties');
          if (sortBy && order) {
              url.searchParams.append('sortBy', sortBy);
              url.searchParams.append('order', order);
          }

          const response = await fetch(url);
          const properties = await response.json();

          if (response.ok) {
              renderProperties(properties);
          } else {
              console.error(properties.message);
              propertyList.innerHTML = '<p>Error loading properties.</p>';
          }
      } catch (err) {
          console.error('Error fetching properties:', err);
          propertyList.innerHTML = '<p>Error fetching properties.</p>';
      }
  }

  // Render properties dynamically
  function renderProperties(properties) {
      propertyList.innerHTML = ''; // Clear existing properties
      properties.forEach((property) => {
          const propertyCard = document.createElement('div');
          propertyCard.className = 'property-card';
          propertyCard.innerHTML = `
              <img src="${property.image}" alt="${property.title}" />
              <h3>${property.title}</h3>
              <p>${property.location}</p>
              <p>Type: ${property.houseType || 'Contact dealer to know the type.'}</p>
              <p>Price: ₹${property.price}</p>
              <p>Description: ${property.description || 'No description provided'}</p>
              <p>Posted by: ${property.createdBy?.name || 'Anonymous'}</p>
               <p>Dealer Email: ${property.createdBy?.email || 'Error'}</p>
              <p>Created At: ${new Date(property.createdAt).toLocaleDateString()}</p>
          `;
          propertyList.appendChild(propertyCard);
      });
  }

  // Initial fetch
  fetchAndRenderProperties();

  // Add event listeners for filters
  sortBySelect.addEventListener('change', () => {
      fetchAndRenderProperties(sortBySelect.value, orderSelect.value);
  });
  orderSelect.addEventListener('change', () => {
      fetchAndRenderProperties(sortBySelect.value, orderSelect.value);
  });
});



