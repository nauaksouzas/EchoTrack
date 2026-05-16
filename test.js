fetch('http://localhost:3000/api/users').then(r => r.text()).then(console.log).catch(console.error);
