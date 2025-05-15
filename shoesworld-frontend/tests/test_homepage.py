from selenium import webdriver
import time

def test_homepage_title():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173")

    # Đợi trang load (hoặc dùng WebDriverWait)
    time.sleep(3)

    assert "ShoesWorld" in driver.title

    driver.quit()
#test thanh cong