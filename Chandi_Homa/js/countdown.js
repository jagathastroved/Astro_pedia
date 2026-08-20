let countdownInterval = null;

export function initCountdown(targetDateString) {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement || !targetDateString) return;

    const targetDate = new Date(targetDateString).getTime();

    // Clear existing interval if any
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            timerElement.innerHTML = '<div class="time-box"><span class="time-val">00</span><span class="time-unit">Closed</span></div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML = `
            <div class="time-box">
                <span class="time-val">${days.toString().padStart(2, '0')}</span>
                <span class="time-unit">Days</span>
            </div>
            <div class="time-box">
                <span class="time-val">${hours.toString().padStart(2, '0')}</span>
                <span class="time-unit">Hours</span>
            </div>
            <div class="time-box">
                <span class="time-val">${minutes.toString().padStart(2, '0')}</span>
                <span class="time-unit">Mins</span>
            </div>
            <div class="time-box">
                <span class="time-val">${seconds.toString().padStart(2, '0')}</span>
                <span class="time-unit">Secs</span>
            </div>
        `;
    }

    update(); // Initial call
    countdownInterval = setInterval(update, 1000);
}
