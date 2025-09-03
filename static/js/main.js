// Main JavaScript for FITS Python application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips and interactive elements
    initializeTooltips();
    initializeFormValidation();
    initializeFileUpload();
});

function initializeTooltips() {
    // Add tooltip functionality if needed
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = event.target.getAttribute('data-tooltip');
    if (tooltip) {
        // Create and show tooltip
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'absolute z-50 px-2 py-1 text-sm text-white bg-zinc-800 rounded shadow-lg';
        tooltipElement.textContent = tooltip;
        tooltipElement.style.top = event.target.offsetTop - 30 + 'px';
        tooltipElement.style.left = event.target.offsetLeft + 'px';
        document.body.appendChild(tooltipElement);
    }
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.absolute.z-50');
    tooltips.forEach(tooltip => tooltip.remove());
}

function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('border-red-500');
    const errorElement = document.createElement('div');
    errorElement.className = 'text-red-400 text-sm mt-1';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorElement = field.parentNode.querySelector('.text-red-400');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initializeFileUpload() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(event) {
            const files = event.target.files;
            if (files.length > 0) {
                showFilePreview(files, input);
            }
        });
    });
}

function showFilePreview(files, input) {
    const previewContainer = input.parentNode.querySelector('.file-preview');
    if (!previewContainer) {
        const container = document.createElement('div');
        container.className = 'file-preview mt-2';
        input.parentNode.appendChild(container);
    }
    
    const container = input.parentNode.querySelector('.file-preview');
    container.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'flex items-center justify-between bg-zinc-800 p-2 rounded text-sm';
        fileElement.innerHTML = `
            <span class="text-zinc-300">${file.name}</span>
            <span class="text-zinc-400">${formatFileSize(file.size)}</span>
        `;
        container.appendChild(fileElement);
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white ${
        type === 'success' ? 'bg-green-600' :
        type === 'error' ? 'bg-red-600' :
        type === 'warning' ? 'bg-yellow-600' :
        'bg-blue-600'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}
