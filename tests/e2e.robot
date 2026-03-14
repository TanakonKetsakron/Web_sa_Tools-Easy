*** Settings ***
Library    SeleniumLibrary    timeout=10
Suite Setup    Open App In Headless Chrome
Suite Teardown    Close All Browsers

*** Variables ***
${BASE_URL}    http://127.0.0.1:5500/index.html
${CART_URL}    http://127.0.0.1:5500/cart.html
${LOGIN_URL}    http://127.0.0.1:5500/login.html
${REGISTER_URL}    http://127.0.0.1:5500/register.html
${CHECKOUT_URL}    http://127.0.0.1:5500/checkout.html
${ORDERS_URL}    http://127.0.0.1:5500/orders.html

*** Test Cases ***
Home Page Loads And Shows Products
    Reset App State
    Go To    ${BASE_URL}
    Wait Until Element Is Visible    css:#product-grid
    Wait Until Keyword Succeeds    15x    1s    Element Should Be Visible    css:.product-card
    ${count}=    Get Element Count    css:.product-card
    Should Be True    ${count} > 0

Category Filter Can Expand And Collapse
    Reset App State
    Go To    ${BASE_URL}
    Wait Until Element Is Visible    css:#filter-bar
    ${before}=    Get Element Count    css:#filter-bar .filter-btn
    ${toggle_count}=    Get Element Count    css:#filter-bar [data-action="toggle-categories"]
    Run Keyword If    ${toggle_count} > 0    Scroll Element Into View    css:#filter-bar [data-action="toggle-categories"]
    Run Keyword If    ${toggle_count} > 0    Wait Until Keyword Succeeds    5x    500ms    Click Element    css:#filter-bar [data-action="toggle-categories"]
    ${expanded}=    Get Element Count    css:#filter-bar .filter-btn
    Run Keyword If    ${toggle_count} > 0    Should Be True    ${expanded} >= ${before}
    Run Keyword If    ${toggle_count} > 0    Wait Until Keyword Succeeds    5x    500ms    Click Element    css:#filter-bar [data-action="toggle-categories"]

Add Product To Cart Flow Works
    Reset App State
    Go To    ${BASE_URL}
    Wait Until Element Is Visible    css:#product-grid a[href*="product.html?id="]
    ${link}=    Get WebElement    css:#product-grid a[href*="product.html?id="]
    Execute JavaScript    arguments[0].click();    ARGUMENTS    ${link}
    Wait Until Location Contains    product.html
    Wait Until Element Is Visible    id:add-to-cart-btn
    Click Button    id:add-to-cart-btn
    Go To    ${CART_URL}
    Wait Until Element Is Visible    css:#cart-container
    ${items}=    Get Element Count    css:.cart-item
    Should Be True    ${items} > 0

Register And Login Flow Works
    Reset App State
    ${email}=    Create Unique Email

    Go To    ${REGISTER_URL}
    Wait Until Element Is Visible    id:register-form
    Input Text    id:reg-name    Robot Tester
    Input Text    id:reg-email    ${email}
    Input Text    id:reg-password    Robot@1234
    Input Text    id:reg-confirm    Robot@1234
    Click Button    css:#register-form button[type="submit"]
    Wait Until Location Contains    login.html    timeout=10s

    Input Text    id:login-email    ${email}
    Input Password    id:login-password    Robot@1234
    Click Button    css:#login-form button[type="submit"]
    Wait Until Location Is    ${BASE_URL}    timeout=10s
    Wait Until Element Is Visible    id:nav-logout

Checkout And Orders Success Flow Works
    Reset App State

    # Add one product into cart first
    Go To    ${BASE_URL}
    Wait Until Element Is Visible    css:#product-grid a[href*="product.html?id="]
    ${link}=    Get WebElement    css:#product-grid a[href*="product.html?id="]
    Execute JavaScript    arguments[0].click();    ARGUMENTS    ${link}
    Wait Until Location Contains    product.html
    Wait Until Element Is Visible    id:add-to-cart-btn
    Click Button    id:add-to-cart-btn

    Go To    ${CHECKOUT_URL}
    Wait Until Element Is Visible    id:checkout-form
    Input Text    id:shipping-address    123 Robot Road
    Select From List By Value    id:shipping-city    กรุงเทพมหานคร
    Input Text    id:shipping-phone    0812345678
    ${submit_btn}=    Get WebElement    css:#checkout-form button[type="submit"]
    Execute JavaScript    arguments[0].scrollIntoView({block: 'center'});    ARGUMENTS    ${submit_btn}
    Execute JavaScript    arguments[0].click();    ARGUMENTS    ${submit_btn}

    Wait Until Location Contains    orders.html?success=    timeout=15s
    Wait Until Element Is Visible    id:success-order-id
    ${order_id}=    Get Text    id:success-order-id
    Should Match Regexp    ${order_id}    ^ORD-[A-Z0-9]{4}$

    Go To    ${ORDERS_URL}
    Wait Until Element Is Visible    css:#orders-view
    ${rows}=    Get Element Count    css:#orders-tbody tr
    Should Be True    ${rows} > 0

*** Keywords ***
Open App In Headless Chrome
    Open Browser    ${BASE_URL}    Chrome    options=add_argument("--headless=new");add_argument("--disable-gpu");add_argument("--window-size=1440,900")
    Go To    ${BASE_URL}
    Wait Until Page Contains    Tools Easy

Reset App State
    Execute JavaScript    window.localStorage.removeItem('te_cart');
    Execute JavaScript    window.localStorage.removeItem('te_orders');
    Execute JavaScript    window.localStorage.removeItem('te_session');
    Execute JavaScript    window.localStorage.removeItem('te_products');
    Go To    ${BASE_URL}
    Wait Until Page Contains    Tools Easy

Create Unique Email
    ${ts}=    Evaluate    int(__import__('time').time()*1000)
    ${email}=    Set Variable    robot_${ts}@toolseasy.test
    RETURN    ${email}
