document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initAccordion();
  initForm();
  initSearch();
});

// Scroll Reveal via IntersectionObserver
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating once for better performance
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// Accordion Logic
function initAccordion() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isActive = header.classList.contains('active');
      
      // Close all
      headers.forEach(h => {
        h.classList.remove('active');
        h.nextElementSibling.style.maxHeight = null;
      });
      
      // Open if it wasn't active
      if (!isActive) {
        header.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

// Form Handling
function initForm() {
  const form = document.getElementById('calc-form');
  const btn = form.querySelector('button[type="submit"]');
  const resultSection = document.getElementById('result-section');
  const skeleton = document.getElementById('skeleton-loader');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add ripple effect
    createRipple(e, btn);
    
    // Show loading state
    btn.disabled = true;
    btn.innerHTML = `<i data-feather="loader" class="animate-spin"></i> Calculating...`;
    feather.replace();
    
    // Hide results, show skeleton
    resultSection.style.display = 'none';
    skeleton.style.display = 'block';
    skeleton.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Mock Calculation Delay
    setTimeout(() => {
      generateMockData();
      
      // Hide skeleton, show results
      skeleton.style.display = 'none';
      resultSection.style.display = 'block';
      
      // Reset button
      btn.disabled = false;
      btn.innerHTML = `<span id="btn-text">Regenerate Report</span><i id="btn-icon" data-feather="zap"></i>`;
      feather.replace();
      
      // Trigger scroll reveal on new elements
      initScrollReveal();
      
      // Animate numbers
      animateValue("total-count", 0, 12, 1500);
      animateValue("days-left", 0, 14, 1000);
      
    }, 2000);
  });
}

// Ripple Effect
function createRipple(event, button) {
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  
  const rect = button.getBoundingClientRect();
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');
  
  const ripple = button.querySelector('.ripple');
  if (ripple) {
    ripple.remove();
  }
  
  button.appendChild(circle);
}

// Number Animation
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Data Generation & Rendering
function generateMockData() {
  const name = document.getElementById('name').value || 'User';
  
  // Render Birth Info
  const birthInfoGrid = document.getElementById('birth-info-grid');
  birthInfoGrid.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;"><i data-feather="moon" style="color: var(--primary)"></i> <div><span style="font-size:0.8rem;color:var(--text-light);display:block;">Moon Sign</span><strong>Taurus</strong></div></div>
    <div style="display: flex; align-items: center; gap: 0.5rem;"><i data-feather="star" style="color: var(--accent)"></i> <div><span style="font-size:0.8rem;color:var(--text-light);display:block;">Birth Star</span><strong>Rohini</strong></div></div>
    <div style="display: flex; align-items: center; gap: 0.5rem;"><i data-feather="sunrise" style="color: var(--secondary)"></i> <div><span style="font-size:0.8rem;color:var(--text-light);display:block;">Lagna</span><strong>Leo</strong></div></div>
  `;
  feather.replace();
  
  // Render Timeline
  const container = document.getElementById('timeline-container');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let html = '';
  const now = new Date();
  
  months.forEach((month, index) => {
    let status = 'upcoming';
    let pillClass = 'pill-upcoming';
    let statusText = 'Upcoming';
    
    if (index < now.getMonth()) {
      status = 'safe';
      pillClass = 'pill-safe';
      statusText = 'Passed';
    } else if (index === now.getMonth()) {
      status = 'active';
      pillClass = 'pill-active';
      statusText = 'Active';
    }
    
    html += `
      <div class="ladder-item" data-month="${month.toLowerCase()}">
        <div class="ladder-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <strong style="font-size: 1.1rem; color: var(--primary);">${month} 2026</strong>
            <span class="pill ${pillClass}">${statusText}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem;">
            <div><i data-feather="calendar" style="width: 14px; height: 14px; color: var(--text-light); margin-right: 4px;"></i><span style="color: var(--text-light);">Starts:</span> 12 ${month}, 08:30 AM</div>
            <div><i data-feather="clock" style="width: 14px; height: 14px; color: var(--text-light); margin-right: 4px;"></i><span style="color: var(--text-light);">Ends:</span> 14 ${month}, 10:15 AM</div>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
  
  // Set next date
  document.getElementById('next-date').innerText = `12 ${months[now.getMonth() === 11 ? 0 : now.getMonth() + 1]}`;
  
  // Render new feather icons in timeline
  feather.replace();
}

// Search Filter
function initSearch() {
  const searchInput = document.getElementById('month-search');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.ladder-item');
    
    rows.forEach(row => {
      const month = row.getAttribute('data-month');
      if (month.includes(term)) {
        row.style.display = 'block';
      } else {
        row.style.display = 'none';
      }
    });
  });
}
