(() => {
  // js/config.js
  var CONFIG = {
    DEFAULT_HOMA: "chandi",
    ASSET_BASE_PATH: "assets/homas/",
    ANIMATION_OBSERVER_OPTIONS: {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    },
    IMAGE_FALLBACK: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFOURFRDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM3NDZDNjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4="
  };

  // js/utils.js
  function getHomaSlug() {
    const params = new URLSearchParams(window.location.search);
    const paramSlug = params.get("homa");
    if (paramSlug) return paramSlug;
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0 && pathParts[pathParts.length - 2] === "homa") {
      return pathParts[pathParts.length - 1];
    }
    return CONFIG.DEFAULT_HOMA;
  }
  function escapeHTML(str) {
    if (typeof str !== "string") return "";
    return str.replace(
      /[&<>'"]/g,
      (tag) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[tag] || tag
    );
  }
  function formatCurrency(amount) {
    if (!amount && amount !== 0) return "";
    if (typeof amount === "string" && amount.includes("\u20B9")) return amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }
  function setImage(imgElement, src, alt, options = {}) {
    if (!imgElement) return;
    imgElement.src = src || CONFIG.IMAGE_FALLBACK;
    imgElement.alt = alt || "Image";
    if (options.lazy !== false) {
      imgElement.loading = "lazy";
    } else {
      imgElement.removeAttribute("loading");
    }
    if (options.objectFit) {
      imgElement.style.objectFit = options.objectFit;
    }
    if (options.objectPosition) {
      imgElement.style.objectPosition = options.objectPosition;
    }
    imgElement.onerror = () => {
      if (imgElement.src !== CONFIG.IMAGE_FALLBACK) {
        imgElement.src = CONFIG.IMAGE_FALLBACK;
      }
    };
  }
  function updateSEO(data) {
    if (!data) return;
    const title = `${data.title} | Sacred Homa`;
    const desc = data.seo?.description || data.subtitle || "";
    const img = window.location.origin + "/" + (data.seo?.image || data.hero?.image || "");
    const url = window.location.href;
    document.title = title;
    updateMetaTag("name", "description", desc);
    updateMetaTag("property", "og:title", title);
    updateMetaTag("property", "og:description", desc);
    updateMetaTag("property", "og:image", img);
    updateMetaTag("property", "og:url", url);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = url.split("?")[0];
    }
  }
  function updateMetaTag(attrName, attrValue, content) {
    let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (tag) {
      tag.setAttribute("content", content);
    }
  }

  // js/validator.js
  function validateHomaData(data) {
    if (!data || typeof data !== "object") {
      console.error("Invalid Homa data: Data is null or not an object");
      return false;
    }
    const requiredKeys = [
      "id",
      "title",
      "hero",
      "benefits",
      "about"
    ];
    for (const key of requiredKeys) {
      if (!data[key]) {
        console.warn(`Missing recommended key in Homa data: ${key}`);
      }
    }
    return true;
  }

  // js/countdown.js
  var countdownInterval = null;
  function initCountdown(targetDateString) {
    const timerElement = document.getElementById("countdown-timer");
    if (!timerElement || !targetDateString) return;
    const targetDate = new Date(targetDateString).getTime();
    if (countdownInterval) clearInterval(countdownInterval);
    function update() {
      const now = (/* @__PURE__ */ new Date()).getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(countdownInterval);
        timerElement.innerHTML = '<div class="time-box"><span class="time-val">00</span><span class="time-unit">Closed</span></div>';
        return;
      }
      const days = Math.floor(distance / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
      const minutes = Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(distance % (1e3 * 60) / 1e3);
      timerElement.innerHTML = `
            <div class="time-box">
                <span class="time-val">${days.toString().padStart(2, "0")}</span>
                <span class="time-unit">Days</span>
            </div>
            <div class="time-box">
                <span class="time-val">${hours.toString().padStart(2, "0")}</span>
                <span class="time-unit">Hours</span>
            </div>
            <div class="time-box">
                <span class="time-val">${minutes.toString().padStart(2, "0")}</span>
                <span class="time-unit">Mins</span>
            </div>
            <div class="time-box">
                <span class="time-val">${seconds.toString().padStart(2, "0")}</span>
                <span class="time-unit">Secs</span>
            </div>
        `;
    }
    update();
    countdownInterval = setInterval(update, 1e3);
  }

  // js/faq.js
  function initFAQ() {
    const container = document.getElementById("faq-container");
    if (!container) return;
    container.addEventListener("click", (e) => {
      const questionBtn = e.target.closest(".faq-question");
      if (!questionBtn) return;
      const faqItem = questionBtn.closest(".faq-item");
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const allItems = container.querySelectorAll(".faq-item");
        allItems.forEach((item) => {
          if (item !== faqItem) item.classList.remove("active");
        });
      }
      faqItem.classList.toggle("active");
      const isExpanded = faqItem.classList.contains("active");
      questionBtn.setAttribute("aria-expanded", isExpanded);
    });
  }

  // js/packages.js
  function initPackages() {
    const container = document.getElementById("packages-container");
    if (!container) return;
    container.addEventListener("click", (e) => {
      if (e.target.closest(".btn-primary")) {
        const packageCard = e.target.closest(".package-card");
        const packageId = packageCard.dataset.id;
        console.log(`Selected package: ${packageId}`);
        alert(`Proceeding with package: ${packageId}`);
      }
    });
  }

  // js/renderer.js
  function renderPage(data) {
    if (!data) return;
    document.querySelectorAll(".dynamic-homa-name").forEach((el) => {
      el.textContent = data.title;
    });
    renderHero(data);
    renderTrust(data);
    renderBenefits(data);
    renderHomaBenefits(data);
    renderAbout(data);
    renderOccasion(data);
    renderRitualProcess(data);
    renderTemple(data);
    renderExperience(data);
    renderPackages(data);
    renderTrustSecurity(data);
    renderTestimonials(data);
    renderFaq(data);
    renderFinalCTA(data);
    initFAQ();
    initPackages();
  }
  function renderHero(data) {
    document.getElementById("hero-label").textContent = data.occasionLabel || "Sacred Occasion";
    document.getElementById("hero-title").textContent = data.title;
    document.getElementById("hero-subtitle").textContent = data.subtitle;
    document.getElementById("hero-temple").textContent = `${data.location?.templeName || ""}, ${data.location?.city || ""}`;
    document.getElementById("hero-date").textContent = `${data.date} \u2022 ${data.day}`;
    document.getElementById("hero-devotees").textContent = `${data.stats?.devotees || "1,00,000+"} Devotees participated`;
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + "/";
    const isMobile = window.innerWidth <= 768;
    const heroBgImage = isMobile && data.hero.mobileImage ? data.hero.mobileImage : data.hero.image;
    const deityImg = document.getElementById("hero-deity-img");
    setImage(deityImg, basePath + data.deity.image, data.deity.name, {
      lazy: false,
      // Eager load hero
      objectPosition: data.hero.objectPosition || "center center"
    });
    if (data.bookingCloseDate) {
      initCountdown(data.bookingCloseDate);
    }
  }
  function renderTrust(data) {
    const container = document.getElementById("trust-grid-container");
    if (!container || !data.trustStrip) return;
    let html = "";
    data.trustStrip.forEach((item) => {
      html += `
            <div class="trust-item reveal scale-in">
                <span class="trust-icon">${item.icon || "\u2728"}</span>
                <span class="trust-text">${escapeHTML(item.text)}</span>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderBenefits(data) {
    const container = document.getElementById("benefits-container");
    if (!container || !data.benefits) return;
    let html = "";
    data.benefits.forEach((benefit, index) => {
      const delay = index * 100;
      html += `
            <div class="card reveal delay-${delay}">
                <div class="card-icon">${benefit.icon || "\u{1F64F}"}</div>
                <h3 class="card-title">${escapeHTML(benefit.title)}</h3>
                <p class="card-desc">${escapeHTML(benefit.description)}</p>
                <button class="btn btn-text mt-2" onclick="this.nextElementSibling.classList.toggle('hidden'); this.style.display='none'">Read more \u2193</button>
                <p class="card-desc hidden mt-2">${escapeHTML(benefit.fullDescription || benefit.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderHomaBenefits(data) {
    const container = document.getElementById("homa-benefits-container");
    if (!container || !data.homaBenefits) return;
    let html = "";
    data.homaBenefits.forEach((benefit, index) => {
      const num = (index + 1).toString().padStart(2, "0");
      const delay = index * 100;
      html += `
            <div class="card reveal delay-${delay}" style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
                <div class="step-number" style="width:40px;height:40px;font-size:1rem;margin:0;">${num}</div>
                <div>
                    <h3 class="card-title">${escapeHTML(benefit.title)}</h3>
                    <p class="card-desc">${escapeHTML(benefit.description)}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderAbout(data) {
    if (!data.about) return;
    document.getElementById("about-title").textContent = data.about.title;
    document.getElementById("about-description").textContent = data.about.description;
    const pointsContainer = document.getElementById("about-points");
    pointsContainer.innerHTML = data.about.points.map((p) => `<li>${escapeHTML(p)}</li>`).join("");
    const img = document.getElementById("about-image");
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + "/";
    setImage(img, basePath + data.about.image, "About Homa");
  }
  function renderOccasion(data) {
    const section = document.getElementById("occasion");
    if (!data.occasion) {
      section.classList.add("hidden");
      return;
    }
    section.classList.remove("hidden");
    document.getElementById("occasion-title").textContent = data.occasion.title;
    document.getElementById("occasion-desc").textContent = data.occasion.description;
    const hlContainer = document.getElementById("occasion-highlights");
    if (data.occasion.highlights) {
      hlContainer.innerHTML = data.occasion.highlights.map((h) => `<span class="occasion-label">${escapeHTML(h)}</span> `).join("");
    }
  }
  function renderRitualProcess(data) {
    const container = document.getElementById("process-timeline");
    if (!container || !data.ritualSteps) return;
    let html = "";
    data.ritualSteps.forEach((step, index) => {
      const delay = index * 100;
      const isHiddenMobile = index >= 3 ? "mobile-hidden" : "";
      html += `
            <div class="process-step reveal delay-${delay} ${isHiddenMobile}">
                <div class="step-number">${step.number}</div>
                <div class="card-icon" style="margin: 0 auto 1rem auto; width: 40px; height: 40px; font-size: 1.2rem;">${step.icon || "\u{1F549}\uFE0F"}</div>
                <h3 class="step-title">${escapeHTML(step.title)}</h3>
                <p class="card-desc">${escapeHTML(step.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderTemple(data) {
    if (!data.temple) return;
    document.getElementById("temple-name").textContent = data.temple.name;
    document.getElementById("temple-location-text").textContent = data.temple.location;
    document.getElementById("temple-desc").textContent = data.temple.description;
    const hlContainer = document.getElementById("temple-highlights");
    if (data.temple.highlights) {
      hlContainer.innerHTML = data.temple.highlights.map((h) => `<span class="occasion-label">${escapeHTML(h)}</span> `).join("");
    }
    const img = document.getElementById("temple-image");
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + "/";
    setImage(img, basePath + data.temple.image, data.temple.name);
  }
  function renderExperience(data) {
    const container = document.getElementById("experience-container");
    if (!container || !data.experience) return;
    let html = "";
    data.experience.forEach((exp, index) => {
      const delay = index * 100;
      html += `
            <div class="card reveal delay-${delay}" style="text-align: center;">
                <div class="card-icon" style="margin: 0 auto 1rem auto;">${exp.icon || "\u2728"}</div>
                <h3 class="card-title">${escapeHTML(exp.title)}</h3>
                <p class="card-desc">${escapeHTML(exp.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderPackages(data) {
    const container = document.getElementById("packages-container");
    if (!container || !data.packages) return;
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + "/";
    let html = "";
    data.packages.forEach((pkg, index) => {
      const delay = index * 100;
      const popularBadge = pkg.popular ? `<div class="package-popular-badge">Most Popular</div>` : "";
      const imagePath = basePath + pkg.image;
      html += `
            <div class="package-card reveal delay-${delay}" data-id="${pkg.id}">
                ${popularBadge}
                <div class="package-image">
                    <img src="${imagePath}" alt="${escapeHTML(pkg.title)}" loading="lazy" style="object-fit: ${data.imageFit || "cover"}">
                </div>
                <div class="package-content">
                    <div class="package-persons">${escapeHTML(pkg.persons)}</div>
                    <h3 class="card-title">${escapeHTML(pkg.title)}</h3>
                    <div class="package-price">${formatCurrency(pkg.price)}</div>
                    <p class="card-desc" style="margin-bottom: 1.5rem;">${escapeHTML(pkg.description || "")}</p>
                    <button class="btn btn-primary package-btn">Select Package</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderTrustSecurity(data) {
    if (data.stats?.devotees) {
      document.getElementById("stat-devotees").textContent = data.stats.devotees;
    }
  }
  function renderTestimonials(data) {
    const container = document.getElementById("testimonials-container");
    if (!container || !data.testimonials) return;
    container.style.display = "grid";
    container.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    container.style.gap = "1.5rem";
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + "/";
    let html = "";
    data.testimonials.forEach((test, index) => {
      const delay = index * 100;
      const stars = "\u2605".repeat(test.rating) + "\u2606".repeat(5 - test.rating);
      html += `
            <div class="card reveal delay-${delay}">
                <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem;">
                    <img src="${basePath + (test.image || "testimonials/default.webp")}" alt="${escapeHTML(test.name)}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;" onerror="this.src='${CONFIG.IMAGE_FALLBACK}'">
                    <div>
                        <h4 style="margin:0; font-family:var(--font-body);">${escapeHTML(test.name)}</h4>
                        <span style="font-size:0.8rem; color:var(--color-text-muted);">${escapeHTML(test.location)} \u2022 ${escapeHTML(test.date)}</span>
                    </div>
                </div>
                <div style="color:var(--color-primary-gold); margin-bottom:0.5rem;">${stars}</div>
                <p class="card-desc" style="font-style:italic;">"${escapeHTML(test.review)}"</p>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderFaq(data) {
    const container = document.getElementById("faq-container");
    if (!container || !data.faqs) return;
    let html = "";
    data.faqs.forEach((faq, index) => {
      const delay = index * 50;
      html += `
            <div class="faq-item reveal delay-${delay}">
                <button class="faq-question" aria-expanded="false">
                    ${escapeHTML(faq.question)}
                    <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer">
                    <p>${escapeHTML(faq.answer)}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
  }
  function renderFinalCTA(data) {
    if (!data.finalCta) return;
    document.getElementById("cta-title").textContent = data.finalCta.title;
    document.getElementById("cta-desc").textContent = data.finalCta.description;
    const btn = document.getElementById("cta-btn");
    btn.textContent = data.finalCta.buttonText;
    const stickyBtn = document.getElementById("sticky-btn-text");
    if (stickyBtn) {
      stickyBtn.textContent = data.finalCta.buttonText;
    }
  }

  // js/animations.js
  function initAnimations() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, CONFIG.ANIMATION_OBSERVER_OPTIONS);
    const animatedElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .scale-in");
    animatedElements.forEach((el) => observer.observe(el));
  }

  // data/chandi_homa.js
  var chandiHoma = {
    id: "chandi",
    title: "Chandi Homa",
    occasionLabel: "Masa Durga Ashtami Special",
    subtitle: "Seek divine grace, protection, strength and peace through the sacred Chandi Homa.",
    date: "20 August 2026",
    day: "Thursday",
    seo: {
      description: "Participate in the powerful Chandi Homa at Pratyangira Devi Temple for protection, peace, and spiritual strength.",
      image: "hero.webp"
    },
    location: {
      templeName: "Pratyangira Devi Temple",
      city: "Bengaluru",
      state: "Karnataka"
    },
    stats: {
      devotees: "1,20,000+"
    },
    hero: {
      image: "hero.webp",
      mobileImage: "hero-mobile.webp",
      objectPosition: "center center"
    },
    deity: {
      name: "Goddess Chandi",
      image: "deity.webp"
    },
    // Booking closes on 19th Aug 6 PM
    bookingCloseDate: "2026-08-19T18:00:00+05:30",
    trustStrip: [
      { icon: "\u{1FA94}", text: "Traditional Vedic Rituals" },
      { icon: "\u{1F549}\uFE0F", text: "Experienced Pandits" },
      { icon: "\u{1F4DD}", text: "Sankalpa in Your Name" },
      { icon: "\u{1F4F9}", text: "Homa Video" },
      { icon: "\u{1F512}", text: "Secure Booking" }
    ],
    benefits: [
      {
        icon: "\u{1F6E1}\uFE0F",
        title: "Protection",
        description: "Traditionally believed to shield from negative energies.",
        fullDescription: "The sacred Chandi Homa is performed with the intention of invoking the fierce form of the Divine Mother to act as a protective shield against all forms of negativity, evil eye, and unseen obstacles."
      },
      {
        icon: "\u{1F4AA}",
        title: "Inner Strength",
        description: "Devotees seek immense mental and spiritual strength.",
        fullDescription: "Through the powerful mantras of the Durga Saptashati, participants seek the inner fortitude required to face life's challenges with confidence and courage."
      },
      {
        icon: "\u{1F54A}\uFE0F",
        title: "Peace & Harmony",
        description: "Aims to restore balance and peace in the family.",
        fullDescription: "Traditionally associated with resolving familial disputes and bringing a sense of calm, harmony, and mutual understanding among family members."
      }
    ],
    homaBenefits: [
      {
        title: "Overcome Obstacles",
        description: "Performed with the intention of clearing blockages in career, business, and personal life."
      },
      {
        title: "Relief from Negativity",
        description: "Traditionally sought for relief from unknown fears, anxiety, and negative influences."
      },
      {
        title: "Overall Wellbeing",
        description: "Devotees seek the blessings of the Divine Mother for good health, wealth, and prosperity."
      }
    ],
    about: {
      title: "What is Chandi Homa?",
      description: "Chandi Homa is one of the most powerful and elaborate Vedic rituals dedicated to Goddess Chandi. It involves the chanting of 700 verses from the Durga Saptashati, invoking the Divine Mother's ultimate power.",
      image: "about.webp",
      points: [
        "Combines the energies of Maha Kali, Maha Lakshmi, and Maha Saraswati.",
        "Performed by highly experienced Vedic Pandits.",
        "Involves elaborate offerings to the sacred fire (Agni).",
        "Concludes with the powerful Purnahuti."
      ]
    },
    occasion: {
      title: "Why Masa Durga Ashtami?",
      description: "The eighth day (Ashtami) of the lunar month is deeply connected to Goddess Durga. Performing the Chandi Homa on this specific day is considered highly auspicious and amplifies the spiritual benefits.",
      highlights: [
        "Monthly Ashtami",
        "Special Divine Energy",
        "Ideal for Protection"
      ]
    },
    ritualSteps: [
      {
        number: 1,
        icon: "\u{1F4E6}",
        title: "Select Package",
        description: "Choose an individual or family package based on your preference."
      },
      {
        number: 2,
        icon: "\u{1F4DD}",
        title: "Sankalpa Details",
        description: "Provide your Name, Nakshatra, and Gotra during checkout."
      },
      {
        number: 3,
        icon: "\u{1F525}",
        title: "Sacred Homa",
        description: "Pandits will chant your name in the Sankalpa before the fire."
      },
      {
        number: 4,
        icon: "\u{1F4F9}",
        title: "Video Updates",
        description: "Receive a video clip of the Homa via WhatsApp."
      },
      {
        number: 5,
        icon: "\u{1F381}",
        title: "Prasad Delivery",
        description: "Sacred Prasad will be delivered to your address."
      }
    ],
    temple: {
      name: "Pratyangira Devi Temple",
      location: "Bengaluru, Karnataka",
      image: "temple.webp",
      description: "A powerful sacred space known for its intense spiritual vibrations and authentic Vedic practices. The temple specializes in invoking fierce forms of the Divine Mother.",
      highlights: [
        "Ancient Traditions",
        "Powerful Kshetra",
        "Dedicated to Divine Mother"
      ]
    },
    experience: [
      {
        icon: "\u{1F464}",
        title: "Personalized Sankalpa",
        description: "Your specific details are chanted by Pandits."
      },
      {
        icon: "\u{1F525}",
        title: "Authentic Ritual",
        description: "Strict adherence to Agamic and Vedic traditions."
      },
      {
        icon: "\u{1F4F1}",
        title: "Digital Access",
        description: "Watch the highlights of the Homa from your home."
      }
    ],
    imageFit: "cover",
    packages: [
      {
        id: "individual",
        title: "Individual Puja",
        persons: "1 Person",
        price: 851,
        image: "packages/individual.webp",
        popular: false,
        description: "Sankalpa for 1 person. Includes Homa video and energetic blessings."
      },
      {
        id: "couple",
        title: "Couple Puja",
        persons: "2 Persons",
        price: 1251,
        image: "packages/couple.webp",
        popular: true,
        description: "Sankalpa for Husband and Wife. Ideal for marital harmony."
      },
      {
        id: "family",
        title: "Family Puja",
        persons: "Up to 4 Persons",
        price: 2001,
        image: "packages/family.webp",
        popular: false,
        description: "Sankalpa for an entire family to seek collective protection and peace."
      }
    ],
    testimonials: [
      {
        name: "Rajesh Kumar",
        location: "Bengaluru",
        rating: 5,
        date: "08 August 2026",
        review: "Participating in the Chandi Homa brought an immense sense of peace to my family. The process was smooth and the video update was wonderful.",
        image: "testimonials/user-1.webp"
      },
      {
        name: "Priya Sharma",
        location: "Delhi",
        rating: 5,
        date: "02 August 2026",
        review: "Highly authentic. I could feel the positive vibrations even from far away. The Prasad arrived well-packed within a week."
      },
      {
        name: "Karthik R.",
        location: "Chennai",
        rating: 4,
        date: "15 July 2026",
        review: "Very professional setup. Sankalpa was done properly with our names. Will definitely participate again."
      }
    ],
    faqs: [
      {
        question: "What is Chandi Homa?",
        answer: "It is a grand fire ritual dedicated to Goddess Chandi, combining the recitation of 700 verses from the Devi Mahatmyam to seek protection and success."
      },
      {
        question: "Do I need to be physically present?",
        answer: "No, you do not need to be physically present. The Pandits will take the Sankalpa on your behalf using your Name, Nakshatra, and Gotra."
      },
      {
        question: "When will I receive the Prasad?",
        answer: "Prasad is typically dispatched within 3-5 days after the completion of the Homa and should reach you within 7-10 working days depending on your location."
      }
    ],
    finalCta: {
      title: "Invoke the Divine Grace of Goddess Chandi",
      description: "Join thousands of devotees in this sacred ritual for protection, prosperity, and peace.",
      buttonText: "Participate in Chandi Homa \u2192"
    }
  };

  // data/muruga_homa.js
  var murugaHoma = {
    id: "muruga",
    title: "Muruga Homa",
    occasionLabel: "Krittika Nakshatra Special",
    subtitle: "Seek courage, victory, and removal of debts through the sacred Muruga Homa.",
    date: "15 September 2026",
    day: "Tuesday",
    seo: {
      description: "Participate in the powerful Muruga Homa to overcome enemies, clear debts, and achieve victory in all endeavors.",
      image: "hero.webp"
    },
    location: {
      templeName: "Kumara Swamy Temple",
      city: "Chennai",
      state: "Tamil Nadu"
    },
    stats: {
      devotees: "85,000+"
    },
    hero: {
      image: "hero.webp",
      mobileImage: "hero-mobile.webp",
      objectPosition: "center top"
    },
    deity: {
      name: "Lord Muruga",
      image: "deity.webp"
    },
    // Booking closes on 14th Sept 6 PM
    bookingCloseDate: "2026-09-14T18:00:00+05:30",
    trustStrip: [
      { icon: "\u{1FA94}", text: "Traditional Vedic Rituals" },
      { icon: "\u{1F549}\uFE0F", text: "Experienced Pandits" },
      { icon: "\u{1F4DD}", text: "Sankalpa in Your Name" },
      { icon: "\u{1F4F9}", text: "Homa Video" },
      { icon: "\u{1F512}", text: "Secure Booking" }
    ],
    benefits: [
      {
        icon: "\u2694\uFE0F",
        title: "Victory",
        description: "Traditionally believed to grant victory in legal and personal battles.",
        fullDescription: "Lord Muruga is the divine warrior. This Homa is performed to invoke his warrior energy to overcome strong opposition and achieve success."
      },
      {
        icon: "\u{1F4B0}",
        title: "Debt Relief",
        description: "Devotees seek blessings to clear financial burdens.",
        fullDescription: "Muruga is strongly associated with Mars (Kuja). Propitiating him helps alleviate Kuja Dosha, which is often linked to financial debts and property disputes."
      },
      {
        icon: "\u{1F6E1}\uFE0F",
        title: "Courage",
        description: "Aims to remove fear and instill immense confidence.",
        fullDescription: "The vibrations of the Muruga Gayatri mantra help clear the mind of anxieties and grant the courage needed to take bold decisions."
      }
    ],
    homaBenefits: [
      {
        title: "Overcome Enemies",
        description: "Performed with the intention of neutralizing hidden enemies and jealousies."
      },
      {
        title: "Health & Vitality",
        description: "Traditionally sought for physical strength and recovery from ailments."
      },
      {
        title: "Favorable Mars (Kuja)",
        description: "Devotees seek to pacify adverse planetary effects of Mars in their horoscope."
      }
    ],
    about: {
      title: "What is Muruga Homa?",
      description: "Muruga Homa is a powerful fire ritual dedicated to Lord Kartikeya (Muruga), the commander of the celestial army. The ritual involves chanting the profound Subramanya mantras.",
      image: "about.webp",
      points: [
        "Invokes the six-faced God of war and wisdom.",
        "Specifically beneficial for those with Mars afflictions.",
        "Uses special offerings like red oleander flowers.",
        "Helps in awakening the Kundalini energy."
      ]
    },
    occasion: {
      title: "Why Krittika Nakshatra?",
      description: "Krittika is the birth star of Lord Muruga. Performing his Homa on this day aligns with his core energy, making the prayers highly receptive and powerful.",
      highlights: [
        "Birth Star of Muruga",
        "Powerful Cosmic Energy",
        "Monthly Special"
      ]
    },
    ritualSteps: [
      {
        number: 1,
        icon: "\u{1F4E6}",
        title: "Select Package",
        description: "Choose an individual or family package based on your preference."
      },
      {
        number: 2,
        icon: "\u{1F4DD}",
        title: "Sankalpa Details",
        description: "Provide your Name, Nakshatra, and Gotra during checkout."
      },
      {
        number: 3,
        icon: "\u{1F525}",
        title: "Sacred Homa",
        description: "Pandits will chant your name in the Sankalpa before the fire."
      },
      {
        number: 4,
        icon: "\u{1F4F9}",
        title: "Video Updates",
        description: "Receive a video clip of the Homa via WhatsApp."
      },
      {
        number: 5,
        icon: "\u{1F381}",
        title: "Prasad Delivery",
        description: "Sacred Prasad (Vibhuti) will be delivered to you."
      }
    ],
    temple: {
      name: "Kumara Swamy Temple",
      location: "Chennai, Tamil Nadu",
      image: "temple.webp",
      description: "A serene and powerful temple dedicated exclusively to Lord Muruga. It is known for its highly disciplined Agamic rituals and powerful vibrations.",
      highlights: [
        "Authentic Agamic Rituals",
        "Special Vel Worship",
        "Sacred Vibhuti"
      ]
    },
    experience: [
      {
        icon: "\u{1F464}",
        title: "Personalized Sankalpa",
        description: "Your specific details are chanted by Pandits."
      },
      {
        icon: "\u{1F525}",
        title: "Authentic Ritual",
        description: "Strict adherence to ancient Tamil and Vedic traditions."
      },
      {
        icon: "\u{1F4F1}",
        title: "Digital Access",
        description: "Watch the highlights of the Homa from your home."
      }
    ],
    imageFit: "cover",
    packages: [
      {
        id: "individual",
        title: "Individual Archana & Homa",
        persons: "1 Person",
        price: 751,
        image: "packages/individual.webp",
        popular: true,
        description: "Sankalpa for 1 person to seek courage and success."
      },
      {
        id: "family",
        title: "Family Homa",
        persons: "Up to 4 Persons",
        price: 1801,
        image: "packages/family.webp",
        popular: false,
        description: "Sankalpa for the family to seek collective protection from ill-wishers."
      }
    ],
    testimonials: [
      {
        name: "Suresh Menon",
        location: "Coimbatore",
        rating: 5,
        date: "12 March 2026",
        review: "I had a long-standing property dispute. After participating in this Homa, things finally started moving in my favor. Om Saravanabhava.",
        image: "testimonials/user-1.webp"
      },
      {
        name: "Anjali V.",
        location: "Mumbai",
        rating: 5,
        date: "04 March 2026",
        review: "Very smooth process. The video was clear and the Pandits pronounced the gotra perfectly."
      }
    ],
    faqs: [
      {
        question: "What is Muruga Homa?",
        answer: "It is a fire ritual dedicated to Lord Muruga, invoking his blessings for courage, debt relief, and victory over enemies."
      },
      {
        question: "How does this help with Mars (Kuja) dosha?",
        answer: "Lord Muruga is the presiding deity of the planet Mars. Worshipping him is the most recommended remedy for pacifying a malefic Mars in one's astrological chart."
      }
    ],
    finalCta: {
      title: "Invoke the Warrior Energy of Lord Muruga",
      description: "Step forward with courage and clear all obstacles in your path.",
      buttonText: "Participate in Muruga Homa \u2192"
    }
  };

  // data/index.js
  var homaDataMap = {
    chandi: chandiHoma,
    muruga: murugaHoma
  };

  // js/app.js
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const slug = getHomaSlug();
      const homaData = homaDataMap[slug];
      if (!homaData) {
        throw new Error(`Data for Homa '${slug}' not found.`);
      }
      if (!validateHomaData(homaData)) {
        console.warn("Homa data validation failed or is missing recommended fields.");
      }
      renderPage(homaData);
      updateSEO(homaData);
      document.getElementById("app-container").classList.remove("opacity-0");
      document.getElementById("error-state").classList.add("hidden");
      setTimeout(initAnimations, 100);
      const stickyCta = document.getElementById("sticky-cta");
      const heroBtn = document.getElementById("hero-cta-btn");
      if (stickyCta && heroBtn) {
        const observer = new IntersectionObserver((entries) => {
          if (!entries[0].isIntersecting) {
            stickyCta.classList.add("visible");
          } else {
            stickyCta.classList.remove("visible");
          }
        });
        observer.observe(heroBtn);
      }
    } catch (error) {
      console.error("Application Error:", error);
      document.getElementById("app-container").classList.add("hidden");
      document.getElementById("error-state").classList.remove("hidden");
      document.getElementById("error-message").textContent = error.message;
    }
  });
})();
