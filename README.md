# Sir Csomó Kutyakozmetika – weboldal

Statikus, egyoldalas weboldal a Sir Csomó Kutyakozmetikának (1142 Budapest, Erzsébet királyné útja 70/A, Zugló).
Nincs szükség build lépésre: a `public/` mappa bármilyen statikus tárhelyen kiszolgálható (Cloudflare Workers, Netlify, GitHub Pages).

## Fájlok

- `public/` – maga a weboldal (ez kerül ki a netre):
  - `index.html` – az oldal szerkezete és minden szövege
  - `styles.css` – megjelenés (színek a `:root` változókban)
  - `script.js` – a nyitókép gubanc→csokornyakkendő animációja, menü, élő nyitvatartás, térkép és minden mozgás
  - `404.html` – „Elkóborolt” oldal a nem létező címekhez
  - `_headers` – biztonsági és gyorsítótár-beállítások a Cloudflare-nek (nem jelenik meg az oldalon)
  - `assets/` – ikonok, megosztási kép (`og.jpg`) és betűtípusok
  - `robots.txt` – a keresőknek
- `wrangler.jsonc` – Cloudflare-beállítás (a `public/` mappát teszi ki, a 404-oldallal együtt)
- `tools/images.js` – újragyártja a megosztási képet és az iPhone-ikont (`node tools/images.js`, Playwright kell hozzá)

## Megjelenés

- „Úriember” elegancia: elefántcsont papír-háttér, tintafekete szöveg, egyetlen kiemelőszín (sárgaréz), hajszálvékony
  vonalak, sok levegő; két sötét szekció (Nóri, lábléc) – `public/styles.css`, `:root`
- Két betűtípus saját tárhelyről (SIL Open Font License, `public/assets/fonts/`): Playfair Display (címek, dőlt kiemelések,
  pl. „*úriember.*”) és Figtree (szöveg, címkék)
- Logó: csokornyakkendő sárgaréz csomóval – a „Sir” és a „Csomó” egyszerre (`#mark` az `index.html` alján, és `assets/favicon.svg`)
- Fejezetszámok római számokkal (I.–V.), mint egy régi, úri kiadványban
- Megszólítás: végig magázó, barátságos hangnem

## Szekciók

- **Nyitókép**: „Csomóból *úriember.*” – mellette egy keretezett „tábla”: egy összegubancolódott, sokszálú szál élőben
  kibomlik, és fekete szatén csokornyakkendővé áll össze (a kibomlás a csomó közepétől fut a szárnyak felé, a végén fény
  suhan át rajta). Az egérrel (ujjal) végighúzva a szál összeborzolódik, majd visszasimul. A ↺ gomb új gubancot köt.
  Alatta a tények: 5,0 ★ (113 értékelés), minden méret és fajta, okleveles kozmetikus 2019 óta, cím
- **I. Szolgáltatások**: étlapszerű „carte” négy fejezetben – Forma (nyírás, trimmelés), Tisztaság (fürdetés, kifésülés &
  csomótalanítás, szárítás), Részletek (fültisztítás & fülszőrtelenítés, karomvágás, anális mirigy tisztítás kis és közepes
  testű kutyáknál), Ifjú urak & hölgyek (kölyökkozmetika). Árat nem közöl – telefonon mondják meg
- **II. A csomóról**: miért nem csak szépséghiba – megelőzni, kibontani, újrakezdeni (rövidebb nyírás, mindig egyeztetve);
  a vonalrajzok görgetésre kirajzolódnak
- **Egy délután Sir Csomónál**: hét lépés az érkezéstől a „Sir.”-ig; a lépések görgetésre kigyulladnak
- **III. Nóri**: sötét szekció – Szűcs Nóra okleveles kutyakozmetikus, Kollár Dorottya mesterkozmetikus tanítványa, oklevél
  2019; óriási „5,0” (113 értékelés)
- **IV. Etikett**: az úri szabályok – legalább 1 héttel előre foglalni, 24 órával előtte lemondani, késői lemondásnál a díj
  50%-a, csak előzetes bejelentkezéssel
- **Gyakori kérdések**: ár, időtartam, gyakoriság, csomós bunda, kölyök, nagy testű kutya, lemondás
- **V. Kapcsolat**: **Időpontfoglalás telefonon** – sötét kártya két nagy hívógombbal (Nóri és Tina), és rövid lista, mit
  érdemes a hívás előtt tudni. Az oldalon nincs űrlap, és semmilyen adatot nem gyűjt. Mellette cím, útvonal (Google Térkép,
  Apple Térkép, Waze), nyitvatartás a mai nap kiemelésével és „Most nyitva / Most zárva” jelzéssel (budapesti idő szerint),
  térkép kattintásra (addig semmit nem tölt be a Google-tól), Facebook és TikTok
- **Lábléc**: „Minden csomóból *úriember* lesz.” és óriási „Sir *Csomó*” felirat
- Telefonon alul ott az **Útvonal** és a **Hívás időpontért** gomb – elbújik, amíg a nyitókép gombjai, a hívókártya vagy a
  lábléc látszik; a menü teljes képernyős, alján a két hívógombbal
- Telefonra optimalizálva (320 px-től): minden gomb legalább 44 px-es érintési felület, a fejléc nem átlátszó, a szövegek
  azonnal látszanak, nincs vízszintes görgetés
- A `styles.css` és a `script.js` hivatkozásában verziószám van (`?v=1`): tartalmi módosítás után érdemes növelni
- Aki kikapcsolta az animációkat (`prefers-reduced-motion`), annak a csokornyakkendő azonnal kész, és semmi nem mozog;
  a vászon csak akkor rajzol, amikor látszik
- Keresőknek: leírás, megosztási kép, strukturált adat (LocalBusiness, nyitvatartással és értékeléssel)

## Adatok és forrásuk

A tartalom a vállalkozás nyilvános adataiból állt össze (a korábbi szcs-kutyakozmetika.hu oldal, a Facebook-oldal,
az Ebadta.com adatlap):

- Név: Sir Csomó Kutyakozmetika – Szűcs Nóra, okleveles kutyakozmetikus (2019, Kollár Dorottya tanítványa)
- Cím: 1142 Budapest, Erzsébet királyné útja 70/A
- Telefon: Nóri +36 70 785 8888 · Tina +36 20 546 9113
- Nyitvatartás: szerda, péntek, vasárnap 9:00–20:00, csak előzetes bejelentkezéssel
- Értékelés: 5,0 ★, 113 értékelés (Ebadta.com)
- Facebook: facebook.com/SirCsomo.Kutyakozmetika · TikTok: @sircsomokutyakozmetika

**Élesítés előtt érdemes Nórival ellenőrizni:** a nyitvatartást (a nyilvános adatlapról való, szokatlan napokkal),
Tina szerepét, és hogy a 113 értékelés friss-e. A nyitvatartás két helyen van: `index.html` (táblázat + strukturált
adat) és `script.js` (`SALON.hours`, a „Most nyitva” jelzéshez).
