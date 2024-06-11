function feedback() {
    document.getElementById('popup').style.display = 'block';
    setTimeout(function() {
        document.getElementById('popup').style.display = 'none';
    }, 5000);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit-form').addEventListener('click', function() {
        event.preventDefault();
        var text = document.getElementById('feedback').value;
        if (text.trim() !== '') {
            feedback();
        } else {
            alert('Please enter your input first!');
        }
    });
  });