# Campanii Google Ads – Mureș, Cluj, Sibiu

Fișierele din `csv/` se importă în **Google Ads Editor** (pe calculator):
Cont → **Import** → **Din fișier** → alegeți fișierele în ordine (1 → 8) → **Finalizare și verificare** → **Postare**.

Campaniile se creează **pe pauză**. Le porniți după verificare.

| Fișier | Ce conține |
|---|---|
| 1-campanii.csv | 3 campanii Search, buget zilnic, Maximize clicks, program L–S, sufix `judet=` |
| 2-locatii.csv | județul fiecărei campanii |
| 3-grupuri.csv | 5 grupuri / campanie |
| 4-cuvinte-cheie.csv | expresie + exact, plus variante cu orașe |
| 5-negative.csv | cuvinte negative la nivel de campanie |
| 6-anunturi.csv | 1 anunț RSA / grup, titlul 1 fixat |
| 7-sitelinks.csv / 8-callouts.csv | extensii |

## De verificat în Editor înainte de Postare
1. **Buget** (20 / 25 / 20 în moneda contului) – ajustați.
2. **Limită CPC maximă** la strategia Maximize clicks – setați-o din Keyword Planner.
3. **Locații**: opțiunea „Prezență: persoane din sau aflate regulat în locații”.
4. **Program**: e în ora contului (Germania) = ora României − 1 → RO 07:00–20:00, L–S.
5. **Rețele**: debifați Display și Parteneri de căutare.
6. **Extensie de apel** 0742 431 066 – se adaugă manual (Active → Apel).
7. **Obiective de conversie**: apel, WhatsApp, formular, apeluri din anunțuri.

Regenerare după modificări: `node ads/generate.mjs`.

## Create în cont (3 nov 2026, prin Supermetrics) – ACTIVE
| Campanie | ID | Buget/zi | Locație |
|---|---|---|---|
| RO - Mureș - Search | 24431570770 | 750 RON | 20905 |
| RO - Cluj - Search | 24425848475 | 750 RON | 20897 |
| RO - Sibiu - Search | 24420695493 | 750 RON | 20908 |

Maximize clicks, limită CPC 1000 RON (practic fără limită), program zilnic 08–20, doar Search, locație „Prezență”, sufix `judet=`.
