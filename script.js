/**
 * Chhaya Distributors - Dynamic Frontend Controller
 * Handles dynamic catalog rendering, search, category filters, sorting,
 * interactive order modal, WhatsApp checkout, and Discord webhook integration.
 */

// ─── Feature Flags ───────────────────────────────────────────────────────────
// Set to true to re-enable discount badges, crossed-out MRP, and savings text
const SHOW_DISCOUNTS = false;

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('catalogSearchInput');
    const sortSelect = document.getElementById('catalogSortSelect');
    const productCountDisplay = document.getElementById('productCountDisplay');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Modal Elements
    const productModal = document.getElementById('productModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalGeneric = document.getElementById('modalGeneric');
    const modalCategory = document.getElementById('modalCategory');
    const modalManufacturer = document.getElementById('modalManufacturer');
    const modalDosage = document.getElementById('modalDosage');
    const modalColdChain = document.getElementById('modalColdChain');
    const modalDescription = document.getElementById('modalDescription');
    const modalIndications = document.getElementById('modalIndications');
    const modalUnitPrice = document.getElementById('modalUnitPrice');
    const modalUnitSavings = document.getElementById('modalUnitSavings');
    const modalQtyInput = document.getElementById('modalQtyInput');
    const modalQtyMinus = document.getElementById('modalQtyMinus');
    const modalQtyPlus = document.getElementById('modalQtyPlus');
    const modalTotalCalc = document.getElementById('modalTotalCalc');
    const modalTotalSavings = document.getElementById('modalTotalSavings');
    const btnWhatsappOrder = document.getElementById('btnWhatsappOrder');
    const btnToggleOrderForm = document.getElementById('btnToggleOrderForm');
    const modalOrderForm = document.getElementById('modalOrderForm');
    const directOrderForm = document.getElementById('directOrderForm');
    const btnDetectLocation = document.getElementById('btnDetectLocation');
    const orderAddressInput = document.getElementById('orderAddress');

    // Current State
    let activeCategory = 'All';
    let currentSearchQuery = '';
    let currentSort = 'recommended';
    let activeProduct = null;

    // Hamburger Mobile Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

        // Populate category dropdown
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            const categories = new Set(['All']);
            window.VaccineStore.getAllVaccines().forEach(v => categories.add(v.category));
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                if (cat === 'All') option.selected = true;
                categorySelect.appendChild(option);
            });
            categorySelect.addEventListener('change', () => {
                activeCategory = categorySelect.value;
                renderCatalog();
            });
        }

    // Search Input Listener
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentSearchQuery = searchInput.value.toLowerCase().trim();
            renderCatalog();
        });
    }

    // Sort Select Listener
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            renderCatalog();
        });
    }

    // Render Catalog Function
    function renderCatalog() {
        if (!productsGrid || !window.VaccineStore) return;

        let items = window.VaccineStore.getAllVaccines();

        // 1. Filter by Category
        if (activeCategory === 'on-sale') {
            items = items.filter(v => (v.discountPercent || 0) > 0);
        } else if (activeCategory !== 'All') {
            items = items.filter(v => v.category === activeCategory);
        }

        // 2. Filter by Search Query
        if (currentSearchQuery) {
            items = items.filter(v => {
                const name = (v.name || '').toLowerCase();
                const generic = (v.genericName || '').toLowerCase();
                const manufacturer = (v.manufacturer || '').toLowerCase();
                const category = (v.category || '').toLowerCase();
                const indications = (v.indications || '').toLowerCase();
                return name.includes(currentSearchQuery) || 
                       generic.includes(currentSearchQuery) || 
                       manufacturer.includes(currentSearchQuery) ||
                       category.includes(currentSearchQuery) ||
                       indications.includes(currentSearchQuery);
            });
        }

        // 3. Sort Items
        if (currentSort === 'price-low') {
            items.sort((a, b) => (a.discountPrice || a.mrp || 0) - (b.discountPrice || b.mrp || 0));
        } else if (currentSort === 'price-high') {
            items.sort((a, b) => (b.discountPrice || b.mrp || 0) - (a.discountPrice || a.mrp || 0));
        } else if (currentSort === 'discount') {
            items.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        } else if (currentSort === 'alpha') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // Recommended: Featured first, then discounts
            items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }

        // Update count
        if (productCountDisplay) {
            productCountDisplay.textContent = `Showing ${items.length} ${items.length === 1 ? 'item' : 'vaccines & injections'}`;
        }

        // Render HTML
        if (items.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem; display:block;"></i>
                    <h3 style="color: var(--text-main); margin-bottom: 0.5rem;">No Vaccines Found</h3>
                    <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">We couldn't find any injections matching your criteria. Try searching for generic names (e.g., HPV, Flu, Rabies, Tirzepatide) or reset filters.</p>
                    <button class="btn-primary-lg" style="padding: 0.65rem 1.5rem; font-size: 0.9rem;" onclick="document.getElementById('catalogSearchInput').value=''; document.querySelector('.category-pill[data-category=All]').click();">
                        Reset All Filters
                    </button>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = items.map(item => {
            const mrp = item.mrp || 0;
            const finalPrice = SHOW_DISCOUNTS ? (item.discountPrice || mrp) : mrp;
            const discountPct = item.discountPercent || 0;
            const savings = mrp - (item.discountPrice || mrp);

            const badgeHtml = SHOW_DISCOUNTS && discountPct > 0 ? 
                `<span class="pill-badge badge-discount">${discountPct}% OFF</span>` : 
                (item.badge ? `<span class="pill-badge" style="background:#0284c7; color:white;">${item.badge}</span>` : '');

            return `
                <article class="product-card" data-id="${item.id}">
                    <div class="card-top-badges">
                        ${badgeHtml}
                        <span class="pill-badge badge-cold"><i class="fas fa-snowflake" style="color:#0284c7;"></i> 2°C - 8°C</span>
                    </div>

                    <div class="card-image-wrap">
                        <img src="${item.image || 'assets/logo.jpg'}" alt="${item.name} - Chhaya Distributors" loading="lazy" onerror="this.src='assets/logo.jpg'">
                    </div>

                    <div class="card-body">
                        <div class="card-meta-row">
                            <span class="card-category">${item.category || 'Vaccine'}</span>
                            <span class="card-brand">${item.manufacturer || ''}</span>
                        </div>

                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-generic">${item.genericName || item.dosageForm || 'Cold Chain Guaranteed'}</p>

                        <div class="card-price-row">
                            <div class="price-current">₹${finalPrice.toLocaleString('en-IN')}</div>
                            ${SHOW_DISCOUNTS && discountPct > 0 ? `<div class="price-original">₹${mrp.toLocaleString('en-IN')}</div>` : ''}
                            ${SHOW_DISCOUNTS && savings > 0 ? `<div class="price-savings">Save ₹${savings.toLocaleString('en-IN')}</div>` : ''}
                        </div>

                        <div class="card-actions-row">
                            <button class="btn-card-order" data-id="${item.id}">
                                <i class="fas fa-bolt"></i> Order Now
                            </button>
                            <button class="btn-card-details" data-id="${item.id}" title="View Clinical Details">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Attach Card Click Listeners
        productsGrid.querySelectorAll('.btn-card-order, .btn-card-details, .card-image-wrap, .card-title').forEach(el => {
            el.addEventListener('click', (e) => {
                const card = el.closest('.product-card');
                if (card) {
                    const id = card.getAttribute('data-id');
                    openProductModal(id);
                }
            });
        });
    }

    // Open Product Detail & Order Modal
    function openProductModal(id) {
        activeProduct = window.VaccineStore.getVaccineById(id);
        if (!activeProduct) return;

        modalImg.src = activeProduct.image || 'assets/logo.jpg';
        modalImg.alt = activeProduct.name;
        modalTitle.textContent = activeProduct.name;
        modalGeneric.textContent = activeProduct.genericName || activeProduct.name;
        modalCategory.textContent = activeProduct.category || 'Vaccine';
        modalManufacturer.textContent = activeProduct.manufacturer || 'Direct Manufacturer Sourced';
        modalDosage.textContent = activeProduct.dosageForm || 'Standard Cold Chain Packaging';
        modalColdChain.textContent = activeProduct.coldChain || '2°C to 8°C (Guaranteed Cold Chain Delivery)';
        modalDescription.textContent = activeProduct.description || 'Quality assured pharmaceutical vaccine supplied under rigorous cold chain compliance by Chhaya Distributors.';
        modalIndications.textContent = activeProduct.indications || 'Immunization / Medical Prophylaxis';

        const finalPrice = SHOW_DISCOUNTS ? (activeProduct.discountPrice || activeProduct.mrp || 0) : (activeProduct.mrp || 0);
        const mrp = activeProduct.mrp || finalPrice;
        const savingsPerUnit = mrp - finalPrice;

        modalUnitPrice.textContent = '₹' + finalPrice.toLocaleString('en-IN');
        modalUnitSavings.textContent = SHOW_DISCOUNTS && savingsPerUnit > 0 ? `(Save ₹${savingsPerUnit.toLocaleString('en-IN')} / unit)` : '';

        // Reset Qty to 1
        modalQtyInput.value = 1;
        updateModalTotals();

        // Reset order form state
        if (modalOrderForm) modalOrderForm.classList.remove('active');

        productModal.classList.add('open');
    }

    // Modal Qty Handlers
    if (modalQtyMinus) {
        modalQtyMinus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value) || 1;
            if (val > 1) {
                modalQtyInput.value = val - 1;
                updateModalTotals();
            }
        });
    }

    if (modalQtyPlus) {
        modalQtyPlus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value) || 1;
            modalQtyInput.value = val + 1;
            updateModalTotals();
        });
    }

    if (modalQtyInput) {
        modalQtyInput.addEventListener('input', updateModalTotals);
    }

    function updateModalTotals() {
        if (!activeProduct) return;
        const qty = Math.max(1, parseInt(modalQtyInput.value) || 1);
        const unitPrice = SHOW_DISCOUNTS ? (activeProduct.discountPrice || activeProduct.mrp || 0) : (activeProduct.mrp || 0);
        const mrp = activeProduct.mrp || unitPrice;
        const total = unitPrice * qty;
        const totalSavings = (mrp - unitPrice) * qty;

        if (modalTotalCalc) modalTotalCalc.textContent = '₹' + total.toLocaleString('en-IN');
        if (modalTotalSavings) {
            modalTotalSavings.textContent = SHOW_DISCOUNTS && totalSavings > 0 ? 
                `You Save: ₹${totalSavings.toLocaleString('en-IN')}` : '';
        }
    }

    // Close Modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => productModal.classList.remove('open'));
    }

    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) productModal.classList.remove('open');
        });
    }

    // Toggle Online Order Form inside Modal
    if (btnToggleOrderForm && modalOrderForm) {
        btnToggleOrderForm.addEventListener('click', () => {
            modalOrderForm.classList.toggle('active');
            if (modalOrderForm.classList.contains('active')) {
                modalOrderForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // WhatsApp Instant Order
    if (btnWhatsappOrder) {
        btnWhatsappOrder.addEventListener('click', () => {
            if (!activeProduct) return;
            const qty = Math.max(1, parseInt(modalQtyInput.value) || 1);
            const unitPrice = activeProduct.discountPrice || activeProduct.mrp || 0;
            const total = unitPrice * qty;

            const msg = `*New Order Inquiry - Chhaya Distributors*\n` +
                        `------------------------------\n` +
                        `*Product:* ${activeProduct.name}\n` +
                        `*Category:* ${activeProduct.category}\n` +
                        `*Quantity:* ${qty}\n` +
                        `*Price per unit:* ₹${unitPrice.toLocaleString('en-IN')}\n` +
                        `*Total Amount:* ₹${total.toLocaleString('en-IN')}\n` +
                        `*Cold Chain Delivery Required*\n` +
                        `------------------------------\n` +
                        `Please confirm availability and dispatch schedule.`;

            const waUrl = `https://wa.me/919811847638?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
        });
    }

    // Geolocation Auto-detection for Order Form
    if (btnDetectLocation && orderAddressInput) {
        btnDetectLocation.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert('Geolocation is not supported by your browser.');
                return;
            }

            btnDetectLocation.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting location...';
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const apiKey = '7f9adbb823fa4f0ea5c5130982cd5a49';
                    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

                    fetch(url)
                        .then(res => res.json())
                        .then(data => {
                            if (data.results && data.results.length > 0) {
                                orderAddressInput.value = data.results[0].formatted;
                            } else {
                                orderAddressInput.value = `GPS: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                            }
                            btnDetectLocation.innerHTML = '<i class="fas fa-check-circle" style="color:var(--accent);"></i> Location Detected';
                        })
                        .catch(() => {
                            orderAddressInput.value = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
                            btnDetectLocation.innerHTML = '<i class="fas fa-map-marker-alt"></i> Location Found';
                        });
                },
                (err) => {
                    btnDetectLocation.innerHTML = '<i class="fas fa-map-marker-alt"></i> Detect My Location';
                    alert('Unable to detect location. Please type your delivery address.');
                }
            );
        });
    }

    // Submit Online Order Form
    if (directOrderForm) {
        directOrderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!activeProduct) return;

            const name = document.getElementById('orderName').value.trim();
            const phone = document.getElementById('orderPhone').value.trim();
            const address = orderAddressInput.value.trim();
            const notes = document.getElementById('orderNotes').value.trim();
            const qty = Math.max(1, parseInt(modalQtyInput.value) || 1);
            const unitPrice = SHOW_DISCOUNTS ? (activeProduct.discountPrice || activeProduct.mrp || 0) : (activeProduct.mrp || 0);
            const totalPrice = unitPrice * qty;

            const orderData = {
                productName: activeProduct.name,
                productId: activeProduct.id,
                quantity: qty,
                unitPrice: unitPrice,
                totalPrice: totalPrice,
                name: name,
                phone: phone,
                address: address,
                notes: notes
            };

            // Save order record locally
            window.VaccineStore.saveOrder(orderData);

            // Discord Webhook Dispatch
            const webhookUrl = 'https://discord.com/api/webhooks/1353266195121442816/En4pTBJpinAvwOMEyteFU7lyu9uXNOA57J8NRLIxrmkZ8Fxakmi355Z74MH0CZpG4N2V';
            const discordPayload = {
                content: `**🚨 New Vaccine Order: ${activeProduct.name}**\n` +
                         `👤 **Customer:** ${name}\n` +
                         `📞 **Phone:** ${phone}\n` +
                         `📍 **Address:** ${address}\n` +
                         `📦 **Quantity:** ${qty} units\n` +
                         `💰 **Total:** ₹${totalPrice.toLocaleString('en-IN')}\n` +
                         `📝 **Notes:** ${notes || 'None'}\n` +
                         `🕒 **Time:** ${new Date().toLocaleString('en-IN')}`
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            }).catch(err => console.log('Webhook notify error:', err));

            alert(`Thank you, ${name}! Your order for ${qty}x ${activeProduct.name} (Total: ₹${totalPrice.toLocaleString('en-IN')}) has been received. Our cold-chain delivery team will call you shortly at ${phone} to confirm dispatch.`);

            directOrderForm.reset();
            productModal.classList.remove('open');
        });
    }

    // FAQ Accordion Handler
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // Initial Catalog Render
    renderCatalog();
});
