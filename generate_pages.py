# generate_pages.py
"""Generate static HTML pages and absolute XML sitemap for Google SEO.

Reads `data.js`, extracts `DEFAULT_VACCINES`, writes static product pages
under `vaccines/` using `product_template.html`, and generates an authoritative
`sitemap.xml` with fully-qualified absolute URLs for Google Search Console.
"""
import os
import re
import json
from datetime import date

DATA_JS = 'data.js'
TEMPLATE = 'product_template.html'
OUTPUT_DIR = 'vaccines'
BASE_URL = 'https://chhaya-distributors.github.io/Home'

def slugify(name: str) -> str:
    """Create a URL-friendly slug from a product name."""
    slug = name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip('-')
    return slug

def load_products():
    with open(DATA_JS, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = re.search(r"const\s+DEFAULT_VACCINES\s*=\s*\[(.*?)]\s*;", txt, re.S)
    if not m:
        raise RuntimeError('DEFAULT_VACCINES array not found in data.js')
    array_body = m.group(1)
    
    # Convert JS object literal to valid JSON
    json_like = re.sub(r"(\w+)\s*:", r'"\1":', array_body)
    json_like = json_like.replace("'", '"')
    json_like = re.sub(r",\s*}", "}", json_like)
    json_like = re.sub(r",\s*]", "]", json_like)
    json_text = f'[{json_like}]'
    
    try:
        products = json.loads(json_text)
    except json.JSONDecodeError as e:
        raise RuntimeError(f'Failed to parse DEFAULT_VACCINES JSON: {e}')
    return products

def render_product(product, template, slug):
    html = template
    product_with_slug = dict(product)
    product_with_slug['slug'] = slug
    
    # Formatted MRP with Indian comma format
    mrp_val = product.get('mrp', 0)
    product_with_slug['mrp'] = f"{mrp_val:,}"

    # MedicalProduct JSON-LD schema
    jsonld = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.get('name'),
        "description": product.get('description'),
        "image": f"{BASE_URL}/{product.get('image')}",
        "brand": {
            "@type": "Brand",
            "name": product.get('manufacturer')
        },
        "category": product.get('category'),
        "offers": {
            "@type": "Offer",
            "url": f"{BASE_URL}/vaccines/{slug}.html",
            "price": str(mrp_val),
            "priceCurrency": "INR",
            "priceValidUntil": "2026-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "MedicalBusiness",
                "name": "Chhaya Distributors"
            }
        }
    }
    
    jsonld_str = json.dumps(jsonld, indent=4)
    html = html.replace('{{JSON_LD}}', jsonld_str)
    
    for key, val in product_with_slug.items():
        html = html.replace(f'{{{{{key}}}}}', str(val))
        
    return html

def generate_sitemap(products):
    today = date.today().isoformat()
    
    # Core pages
    entries = [
        f"""  <url>
    <loc>{BASE_URL}/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>""",
        f"""  <url>
    <loc>{BASE_URL}/About.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""",
        f"""  <url>
    <loc>{BASE_URL}/contact-us/contact-us.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>"""
    ]
    
    # Product pages
    for p in products:
        slug = slugify(p.get('name', 'product'))
        entries.append(f"""  <url>
    <loc>{BASE_URL}/vaccines/{slug}.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>""")

    sitemap_content = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + '\n'.join(entries) + '\n'
        '</urlset>\n'
    )
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    print(f'sitemap.xml updated with {len(entries)} absolute URLs.')

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(TEMPLATE, 'r', encoding='utf-8') as f:
        tpl = f.read()
        
    products = load_products()
    print(f'Loaded {len(products)} products from {DATA_JS}.')
    
    for p in products:
        slug = slugify(p.get('name', 'product'))
        out_path = os.path.join(OUTPUT_DIR, f"{slug}.html")
        content = render_product(p, tpl, slug)
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f'Generated {out_path}')
        
    generate_sitemap(products)

if __name__ == '__main__':
    main()
