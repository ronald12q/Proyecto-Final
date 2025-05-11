document.addEventListener('DOMContentLoaded', function() {
    
    const buttons = document.querySelectorAll('[link]');
    
   
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            
            const link = this.getAttribute('link');
            
            
            if(link) {
                window.location.href = link;
            }
        });
    });
});