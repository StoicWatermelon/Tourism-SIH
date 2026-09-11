import urllib.request

routes = ['/culture', '/circuits', '/food']
checks = {
    '/culture': ['cultureSearchInput', 'cultureQuizQuestionBox', 'chime-btn', 'playCultureBell'],
    '/circuits': ['portalSearchInput', 'portal-theme-pill', 'portalDossierModal', 'portalModalTitle'],
    '/food': ['superfood-calc-wrap', 'calcCarbonSaved', 'foodSearchInput', 'foodRecipeModal']
}

all_pass = True
for r in routes:
    try:
        url = f'http://127.0.0.1:8000{r}'
        req = urllib.request.urlopen(url)
        content = req.read().decode('utf-8', errors='ignore')
        print(f"ROUTE {r}: HTTP {req.status} (Length: {len(content)})")
        for chk in checks[r]:
            found = chk.lower() in content.lower()
            status = "PASS" if found else "FAIL"
            print(f"  - check '{chk}': {status}")
            if not found:
                all_pass = False
    except Exception as e:
        print(f"ROUTE {r} FAILED: {e}")
        all_pass = False

print("\nOVERALL STATUS:", "ALL TESTS PASSED!" if all_pass else "SOME CHECKS FAILED!")
