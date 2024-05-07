fetch('./DatasetClean_VendingMachine_Team1JKT.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching JSON:', error));