+++
title = "Fakturagenerator i Python"
date = "2021-02-24T16:41:49+01:00"

#
# description is optional
#
# description = "Jeg beskriver et fakturaprogram jeg har laget for frilanservirksomheten min. Som frilanser og oversetter vil jeg dra nytte av denne fakturageneraturen, som automatisere det å opprette fakturaer."

tags = ["automatisering","effektivisering","python","xtrf",]
+++

I denne bloggposten beskriver jeg en fakturagenerator jeg har laget i Python. Fakturageneratoren kan i løpet av få milisekunder opprette en faktura i HTML-format basert på data.

Nedenfor vil jeg gå litt gjennom prosjektet og vise hvordan det fungerer med et praktisk eksempel. [Koden til fakturageneratoren min finner du her!](https://github.com/Oleham/hammer_faktura)

**Oversikt:**
1. [Hammer Faktura](#hammer-faktura)
2. [Slik fungerer det](#slik-fungerer-det)
3. [Den ferdige fakturaen](#den-ferdige-fakturaen)
4. [Eksempel på bruk av Hammer Faktura](#eksempel-på-bruk-av-hammer-faktura)
5. [Veien videre](#veien-videre)

## Hammer Faktura

I løpet av februar har jeg gjort over 500 (små) oppdrag for én og samme kunde. Disse skal faktureres til tre ulike organsiasjonsnumre avhengig av hvilket land oppdraget kom fra. Da ble det klart for meg at jeg behøver en automatisert måte å opprette fakturaer på – litt på samme måte som [GUI-programmet mitt simpleVP](https://www.olehammersland.com/blogg/simplevp-xtrf-gjort-enkelt/), som jeg bruker til å automatisere nedlastning av oppdrag fra XTRF-portalen.

Det startet altså som et prosjekt skreddersydd én eneste kunde, men det kjentes ikke ut som noen elegant løsning. Hva så når jeg får en annen kunde med andre behov?

Jeg vil jo egentlig ha et fakturaprogram som kan:

* tilpasses ulike kunder.
* skape enhetlige fakturaer.
* ellers automatisere alt det praktiske med faktura-nr. og datoer.

Noen kunder vil ha faktura på jobb-basis, mens andre vil ha månedlige fakturaer. Derfor er det viktig å kunne tilpasse fakturaene og layoutet litt, samtidig som det hele skal ha et visst enhetlig format.

Løsningen på dette ble å todele det opprinnelige prosjektet mitt. Den ene delen er skriptet som laster ned data fra XTRF og sorterer det. Det er spesialtilpasset en viss kunde og et visst CMS-system. 

Resten av programmet flyttet jeg over i en hjemmelaget modul som jeg gav navnet **Hammer Faktura** og by-linen *einfach der Hammer*. Denne modulen har kun én jobb – ta i mot data og lage en faktura på bakgrunn av denne. Målet er at jeg skal kunne bruke den samme modulen med alle mine kunder.

## Slik fungerer det

Slik er Hammer Faktura bygget opp:
```
hammer_faktura
├── README.md
├── __init__.py
└── maler
    ├── faktura.css
    ├── fakturamal.html
    └── tabellmal.html
```
Den inneholder en python-fil med to klasser, og en mappe med byggeklosser i HTML og CSS. Jobben til modulen er å hente inn informasjon, plassere det inn i HTML-byggeklossene og så sette sammen et ferdig dokument.

Vi starter med kundeklassen:

![Kunde.klassen initaliseres](/images/blogg/hammer-faktura-kunde-klasse.jpg)

Kunde-klassen inneholder så langt bare tre nøkkelinformasjoner: navn, organisasjonsnummer og adresse. Dette skal skrives ut på fakturaen. Etter hvert vil det også være aktuelt å legge til flere variabler og metoder – for eksempel om kunden vil ha 30 dagers eller 14 dagers frist.

Nå som vi har initialisert en kunde, kan vi initialisere selve fakturaen.

![Faktura-klassen initaliseres](/images/blogg/hammer-faktura-faktura-klasse.jpg)

I det Faktura-klassen initialiseres, fyller den automatisk ut feltet dato med dagens dato, og legger til en forfallsdato 1 måned senere. Dessuten genererer den et tilfeldig fakturanummer.

I tillegg inneholder den en liten html-snutt som representerer en rad i en tabell, lagret som `tr_elem_mal`. Det er den som skal fylles opp med alle jobbene vi skal fakturere. Det gjøres trinn for trinn ved hjelp av metodene til Faktura-klassen.

1. **add_to_tr_elem**  
Denne metoden brukes til å legge oppdragets navn, referanse, type og avtalt beløp inn i html-snutten `Faktura.tr_elem_list`. Hver gang metoden kalles, vil en ny rad legges inn i listen. Om det er flere oppdrag som skal legges til en faktura, kan man altså loope over dem og kalle denne metoden.

2. **generate_table**  
Når alle radene er på plass i `Faktura.tr_elem_list`, kan selve tabellen genereres. Tabell-radene fra punkt 1 settes inn i `maler/tabellmal.html`. Totalen legges så inn, og bruttopris regnes ut basert på momssatsen.

3. **generate_body**  
Til slutt kan man generere selve fakturaen. Den ferdige tabellen med total fra punkt 2 settes inn i `maler/fakturamal.html`.

Her er en eksemplarisk bruk av modulen:

```python
# Importer modulen
import hammer_faktura

# Last inn et datasett med alle oppdrag som skal på fakturaen
with open("oppdrag.json") as f:
	alle_oppdrag = json.load(f)

# Oppgi kunde og initialiser fakturaen.
kunde = hammer_faktura.Kunde("Kunde AS", "123456789", "Adresseveien 4")
faktura = hammer_faktura.Faktura(kunde)

# Loop over alle oppdragene i datasettet.
# Legg inn id, navn, type, beløp, enhet og leveringsdato.
# Gjenta for alle oppdragene som skal med.
for oppdrag in alle_oppdrag:
	faktura.add_to_tr_elem(oppdrag["id"],
							oppdrag["navn"],
							oppdrag["type"],
							oppdrag["beløp"],
							oppdrag["enhet"],
							oppdrag["leveringsdato"])

# Generer tabellen.
# Generer så selve fakturaen og lagre den i en variabel.
faktura.generate_table()
html_fil = faktura.generate_body()

# Skriv fakturaen til en fil.
# (Bruk fakturanummret i filnavnet for bedre oversikt.)
with open(f"faktura_{faktura.invoice_number}.html", "w") as f:
	f.write(html_fil)

```

## Den ferdige fakturaen

Resultatet er et HTML-dokument som f.eks. kan åpnes i nettleseren.

![Eksempel på hvordan en ferdig faktura kan se ut.](/images/blogg/hammer-faktura-faktura_hf.jpg)

Dette dokumentet består av to byggeklosser. 

`maler/fakturamal.html` inneholder selve rammen, med kontaktinformasjon, datoer og betalingsinformasjon. 

`maler/tabellmal.html` inneholder rammeverket for selve tabellen. Fordelen med denne oppgavedelingen er at jeg raskt kan utforme en annerledes tabell til en annen kunde, uten å påvirke utformingen til resten av fakturaen.

Selve stylingen gjøres i `maler/faktura.css`. Jeg har forsøkt å legge meg på en stil som ligner på [Faktura Larsen](#), et (gratis!) eldre hobbyprogram som fortsatt fungerer veldig bra.

![Faktura fra Faktura Larsen](/images/blogg/hammer-faktura-faktura_larsen.jpg)

Minus den (riktignok tidløse) giroen nederst, og kanskje pluss en liten logo.

Hvorfor et HTML-dokument? Vel, det er utrolig versatilt og kan enkelt konverteres til PDF og docx ved hjelp av verktøy som pandoc. Tanken er at det er et tidløst format som kan brukes til veldig mye, og som det er lett å endre stilen på.

## Eksempel på bruk av Hammer Faktura

Hvorfor alt styret? La oss gå tilbake og ta en titt på denne kunden som ville ha tre ulike fakturaer for over 500 småoppdrag som jeg gjorde i løpet av en måned.

I eksempelet nedenfor viser jeg hvor lett det nå har blitt for meg å generere 3 fakturaer med over 500 oppdrag som lastes direkte ned fra nettet:

```python
kontorer = ["NO", "DK", "SE"]

for kontor in kontorer:

	if kontor == "NO":
		gs = hammer_faktura.Kunde("NORSK KUNDE", "1234567", "Oslo")
	elif kontor == "DK":
		gs = hammer_faktura.Kunde("DANSK KUNDE", "7654321", "København")
	else:
		gs = hammer_faktura.Kunde("SVENSK KUNDE", "17262534", "Stockholm")

	invoice = hammer_faktura.Faktura(gs)

	populate_invoice_from_XTRF(invoice, oversikt, kontor)

	invoice.generate_table()
		
	faktura = invoice.generate_body()

	with open(os.path.join("invoices", f"faktura_{invoice.invoice_number}_{kontor}.html"), "w") as f:
		f. write(faktura)
```

Resultatet? 3 fine filer som dette:
```
─ faktura_13137_DK.html
─ faktura_2912_SE.html
─ faktura_35457_NO.html
```
Disse kan så gjøres om til Word med pandoc:

```
$ for file in *; do pandoc -o ${file%.html}.docx $file; done;
```

Det å skrive dette skriptet tar ikke så lang tid nå som selve fakturaens oppbygning og stil allerede er på plass.

## Veien videre

Jeg startet prosjetet på mandag og har kost meg veldig gjennom hele uken. Det har vært en spennende utfordring å rydde opp i koden min og prøve å gjøre oppbygningen så logisk som mulig. Prøve å finne den perfekte balansen mellom *enhetlig* og *fleksibel* – et program som skaper orden, men som likevel skal kunne utvides og endres på i fremtiden. 

Det er ikke så lett, fordi man må prøve å gjette på hvilke funksjoner som kan være nyttige i fremtiden. Muligheten for å endre språket i fakturaen? Kanskje bør kundene lagres i en database og hentes derfra? Kanskje skal det være mulig å oppdatere totalen etter at tabellen har blitt generert? Og så videre.

Uansett er jeg fornøyd med ukens fremgang på prosjektet. Nå skal jeg lage fakturaene mine, og så får jeg tenke over de neste utvidelsene en annen gang!

