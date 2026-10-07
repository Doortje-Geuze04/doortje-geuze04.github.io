# ANIMA devlog

Jekyll-site voor GitHub Pages. Geen installatie nodig: GitHub bouwt de site zelf.

## Online zetten

1. Maak op GitHub een nieuwe **public** repository met de naam `<jouw-gebruikersnaam>.github.io`.
2. Klik op **uploading an existing file** en sleep de inhoud van deze map erin
   (de mappen `_layouts`, `_posts`, `assets` en de losse bestanden). Klik **Commit changes**.
3. Ga naar **Settings → Pages** en kies bij *Source*: **Deploy from a branch**, branch `main`, map `/ (root)`.
4. Na een minuut of twee staat je site op `https://<jouw-gebruikersnaam>.github.io`.

Pas in `_config.yml` je naam aan bij `author`.

## Een nieuwe sprint toevoegen

Kopieer `_posts/2026-10-09-sprint-1.md` en noem hem bijvoorbeeld `2026-10-30-sprint-2.md`.
Pas bovenin `sprint: 2`, de titel, periode en leeruitkomsten aan.
De piek op de hartslaglijn op de homepage wordt dan vanzelf klikbaar.

Foto's zet je in `assets/img/sprint-2/`.

## Liever een andere repo-naam?

Dat kan ook (bijv. `devlog`). Je site komt dan op `https://<naam>.github.io/devlog`.
Zet in dat geval in `_config.yml` de regel `baseurl: "/devlog"`.
