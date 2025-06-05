from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

# --- Setup headless browser ---
options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

# --- Step 1: Scrape All Section URLs ---
def get_section_urls(main_url):
    print(f"🌐 Opening {main_url}")
    driver.get(main_url)
    time.sleep(5)  # wait for JS to load
    
    soup = BeautifulSoup(driver.page_source, "html.parser")
    section_links = []

    all_links = soup.find_all("a", href=True)
    for link in all_links:
        text = link.text.strip()
        href = link['href']
        # Look for section codes like "22.02.010" or chapters like "Chapter 22.02"
        if "22." in text or "Chapter 22." in text:
            # Full URL if it's a relative link
            if href.startswith("/"):
                href = "https://library.municode.com" + href
            elif href.startswith("?"):
                href = "https://library.municode.com/ca/los_angeles_county/codes/code_of_ordinances" + href
            section_links.append((text, href))
    
    print(f"✅ Found {len(section_links)} sections.")
    return section_links

# --- Step 2: Extract Full Text of Each Section ---
def extract_section_text(url):
    driver.get(url)
    time.sleep(5)  # Let the JS fully load the chunks
    
    soup = BeautifulSoup(driver.page_source, "html.parser")

    # Find all chunks of text
    content_chunks = soup.find_all("div", class_="chunk-content")
    
    if content_chunks:
        # Join all paragraph text from each chunk
        all_text = []
        for chunk in content_chunks:
            ps = chunk.find_all("p")
            for p in ps:
                all_text.append(p.get_text())
        return "\n".join(all_text).strip()
    else:
        print("⚠️ No <div class='chunk-content'> found at", url)
        return "No content found."

# --- Run the Tool ---
main_url = "https://library.municode.com/ca/los_angeles_county/codes/code_of_ordinances?nodeId=TIT22PLZO"
sections = get_section_urls(main_url)

# Optional: limit for testing
# sections = sections[:3]

for title, url in sections:
    print(f"\n🔗 Scraping: {title} ({url})")
    text = extract_section_text(url)
    print("📝 Section Text (first 5000 chars):\n", text[:5000], "...\n")

driver.quit()
