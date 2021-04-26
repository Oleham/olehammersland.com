+++
title = "Mitt første Go-prosjekt"
date = "2021-04-26T12:57:36+02:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["automatisering","effektivisering","enkeltpersonforetak","linux","oversettelse","translation","tysk","xtrf","go"]

include_toc = false
+++

Jeg har de siste ukene jobbet ganske jevnt og trutt på et nytt programmerings-prosjekt. Målet er å utvide simpleVP, et prosjekt jeg skapte for å automatisere filnedlastning og opplastning fra oversettelsesportalen XTRF \([se her](http://localhost:1313/blogg/simplevp-xtrf-gjort-enkelt/)\). I tillegg vil jeg smelte det sammen med faktura-generatoren min. Det nye prosjektet skal altså bli en one-stop klient for XTRF-systemet for oversettere!

Det første som er nytt med denne utgaven av simpleVP (simple Vendor Portal), er at den er skrevet i Go. Go er et såkalt *kompilert* språk som gjør det mye lettere for meg å distribuere programmet. Da jeg lagde det opprinnelige simpleVP i Python, skrev jeg lange instruksjoner til sluttbrukerne om hvordan man laster ned Python, bruker kommandolinjen, installerer ulike moduler og setter opp miljøvariabler. Nå er målet å lage en enkel kjørbar fil i et format som er velkjent for de fleste Windows-brukere (.exe). Det legger Go til rette for.

Det andre som er nytt, er at jeg skaper programmet med perspektivet til en frilansoversetter. Derfor skal systemet ha støtte for å koble seg til ulike XTRF-servere, slik at jeg kan samle oppdrag fra flere oversettelsesbyråer inn i én enkel oversikt. I min erfaring er XTRF noe slikt som en bransjestandard. Tar man oppdrag fra et oversettelsesbyrå, er sjansen for at de bruker XTRF temmelig stor. Derfor er det spesielt verdifullt å samle alle disse web-applikasjonene inn i ett enkelt grensesnitt. Dessuten baserer de fleste byråer seg på XTRF til regnskapet sitt. Derfor er det heller ikke så dumt å legge inn støtte for fakturering også.

Så langt har jeg jobbet mest med et enkelt grafisk brukergrensesnitt og databasen. Brukergrensesnittet er basert på en åpen kildekode-modul ved navn [Fyne](https://pkg.go.dev/fyne.io/fyne).

![Slik ser nye simpleVP ut.](/images/blogg/simplevp3-gui-first-look.jpg)

Bildet over viser den delen av programmet som er kommet lengst: siden for å opprette, endre og slette forbindelsene til de ulike XTRF-portalene. Når du bruker programmet, vil du kunne bruke alle disse XTRF-portalene samtidig, i samme programmet.

Prosjektet er delt opp i følgende pakker eller «delprogrammer»:

```
            main
           /    \
        gui  –-  db
                   \
                   xtrf

```
GUI tegner det grafiske grensnittet på skjermen. For å gjøre det, henter det informasjon fra databasen (db). Kunden kan kan også oppdatere databasen. Da bruker databasen delprogrammet som heter xtrf til å laste ned informasjonen via API-et til XTRF.

Databasen er med andre ord hjulnavet, *die Drehscheibe*, i programmet mitt. Den starter med en tabell for **settings**. En setting inneholder påloggingsinformasjonen for en XTRF-portal. Per setting kan man finne flere **jobs**, som representerer jobbene fra XTRF, enten de har statusen *in progress*, *pending* eller *to be invoiced*. Hver jobb kan igjen inneholde filer: tabellen **files** inneholder alle filene.

![Database-oversikt](/images/blogg/simplevp3-database.jpg)

Når hovedfunksjonaliteten er klar, kan det bli relevant med en tabell kalt **invoices**, som inneholder fakturaene brukeren skaper. Hver jobb vil da også knyttes til en faktura. Tabellen **banks** vil inneholde betalingsinformasjonen til brukeren, og så må **settings** oppdateres med kundens faktureringsinnstillinger.

Databasen, og logikken for å oppdatere den, er nesten fullført. I neste trinn må det grafiske brukergrensesnittet kunne vise jobber, beskrivelser, filer og annen informasjon på en passe oversiktlig måte. Deretter skal brukeren få muligheten til å laste ned jobber.

Gleder meg til å jobbe videre på dette prosjektet!