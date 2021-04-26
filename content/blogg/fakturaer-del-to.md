+++
title = "Fakturaer del to"
date = "2021-03-03T20:34:36+01:00"

#
# description is optional
#
description = "Jeg har forbedret min hjemmelagde fakturagenerator. Den tar nå i mye større grad hensyn til formkravene ved MVA-meldingen fra Skatteetaten. Det er automatisering av en kjedelig oppgave, som mange med enkeltpersonforetak sikkert kjenner seg igjen i."

tags = ["automatisering","effektivisering","python","xtrf","enkeltpersonforetak",]

include_toc = true

+++

Fakturaer, fakturaer. Jeg tenker fortsatt utelukkende på fakturaer.

I forrige blogginnlegg skrev jeg om [en fakturagenerator jeg har skrevet i Python](/blogg/fakturagenerator-i-python). Et gøy prosjekt som jeg satt sammen i løpet av noen dager innimellom oversettelsesoppdragene. Denne uken skulle Hammer Faktura settes på prøve, og den bestod!

I løpet av 3 sekunder hadde jeg lastet ned informasjonen om 500 mini-oppdrag fra XTRF, fordelt disse på tre fakturaer basert på avdeling og tegnet opp tre fine fakturaer med fakturanummer, forfallsdato, bankopplysninger og kundenes adresser.

![Den forrige fakturaen!](/images/blogg/hammer-faktura-faktura_hf.jpg)

Resultatet ser fint ut. I prinsippet speiler det opplysningene i XTRF helt og holdent.

## Utfordringene

Den siste uken har jeg imidlertid hatt den tvilsomme gleden av å fylle ut min første MVA-melding. Nå som jeg har vært i gjennom den prosessen, skjønner jeg mer av hva som er nyttig i forbindelse med fakturaer. Jeg måtte for eksempel stadig konsultere kalkulatoren for å finne tall som ikke var skrevet eksplisitt på fakturaen, bruttoprisen på enkeltjobber eller sammenlagt MVA. Om jeg en dag må føre opplysningene inn i andre skjemaer eller regnskapsark, vil det potensielt bety masse omregning.

Det jeg på den andre *siden ikke hadde bruk for i det hele tatt*, var opplysninger som den interne jobb-ID-en til XTRF, oppdragstypen, etc. En faktura er en salgsdokumentasjon som skal dokumentere salget, pengene som skifter hånd og hvilke forpliktelser som oppstår med hensyn til MVA-registeret. Det er et dokument som skal regnskapsføres og være etterettelig. I MVA-meldingen er det helt ubetydelig om oppdraget var oversettelse eller korrekturlesning – man trenger bare ha en passe god beskrivelse av hva slags arbeid som har blitt utført. Det er beløpene som teller.

Derfor har jeg gitt programmet en ordentlig overhaling, oppdatert fakturamalene og ellers fikset opp i en del småting som jeg har manglet.

## Ny utforming

![Ny utforming på fakturaen](/images/blogg/hammer-faktura-eksempel-ny-faktura.jpg)

Nå har jeg presset de tidligere spaltene navn + type, som jo egentlig var kategorier fra XTRF, inn på en linje som heter "Beskrivelse". Her kan jeg legge inn en generell varebeskrivelse. Jeg beholder ID-kolonnen, fordi jeg ser for meg at den kan brukes i mange sammenhenger. Jeg har lagt til en egen MVA-utregning på hver eneste post, hvilket gjør at fakturaen er mye mer eksplisitt. Dessuten har jeg lagt til en utregning for totalt beregnet MVA.

Jeg kunne ikke dy meg, og la også til en liten gul farge nederst – i tråd med den klassiske norske giroen.

## Gjennomgang av nye Hammer Faktura

I det nye programmet har jeg lagt til to nye klasser: Bank og Faktura. Det slo meg at jeg ikke ville oppgi min egen bankinformasjon på Github, så nå er ikke lenger bankopplysningene statiske inne i programmet. 

Nå som mye av informasjonen var blitt sortert etter Kunde og Bank, slo deg meg som inkonsekvent at fakturanummer og forfallsdato ligger lagret direkte i fakturageneratoren. Derfor ligger den informasjonen nå i en egen Faktura-klasse.

```python
class Bank():

	def __init__(self, konto, iban, bic, bank):
		self.konto = konto
		self.iban = iban
		self.bic = bic
		self.bank = bank

class Faktura():

	def __init__(self):
		self.id = self.make_invoice_number()
		self.dato, self.forfall = self.get_invoice_dates()
```

Jobben med å faktisk skape fakturaen har blitt flyttet til en fjerde klasse, som heter Generator. Dermed er oppgavefordelingen slik:

`Kunde()`
:  Holder informasjon om kunden. Dette inkluderer også informasjon om MVA-sats og valuta.

`Faktura()`
: Inneholder metainformasjon om fakturaen:  dato, forfall og fakturanr.

`Bank()`
: Inneholder betalingsinformasjon som kontonr, IBAN etc.

`Generator()`
: har som oppgave å skape fakturaen. Skaper en tabell med metoden `add_to_invoice` og fyller inn metainformasjon fra Kunde, Faktura og Bank.

### 1. Initialisere kunde, bank og faktura

Det første som må gjøres, er å initialisere Kunde og Bank. Faktura skapes fortsatt automatisk.

```python
# Importer modulen
import hammer_faktura

# Initialiser Kunde og Bank.
# Initialiser selve Generatoren.
# Faktura initialiseres automatisk med datoer og id.
kunde = hammer_faktura.Kunde("Kunde AS", "123456789", "Adresseveien 4")
bank = hammer_faktura.Bank("XX.XXX.XXX..XX",
        	"NOXX.XXXX.XXXX.XX",
        	"NKSVP",
        	"Banken AS")

generator = hammer_faktura.Generator(kunde, bank)
```
Viktig å merke seg at man også kan legge til to valgfrie argumenter når man initialiserer kunden for å endre MVA-sats og valuta. Som standard initialiseres kunden med 0,25 % MVA og «NOK» som valuta. 

```python
# Kunde med null MVA og amerikanske dollar som valuta.
kunde = hammer_faktura.Kunde("Kunde AS", "123456789", "Adresseveien 4", vat=0.00, valuta="USD")
```

På dette stadiet har man også mulighet til å endre andre standarder. For eksempel kan forfallsdato eller fakturadato endres manuelt, om du vil gi kunden litt lenger frist.

```python
# Endre fakturadato og forfallsdato manuelt
generator.faktura.dato = "10.05.1997"
generator.faktura.forfall = "10.07.1997"
```

### 2. Mat inn alle oppdrag

Nå som rammeopplysningene er på plass, kan vi legge inn noen oppdrag vi vil fakturere kunden for. For hvert oppdrag må vi legge inn en leveringsdato, en id, en beskrivelse og et beløp. Leveringsdato, ID og bekreftelse er tekst, mens beløpet er et naturlig tall (floating point) som vi skal utføre mattestykker på.

```python
# Her lager jeg en liste med 3 fiktive oppdrag
# Hvert av de fiktive oppdragene ligger i en dictionary.
alle_oppdrag = [{"leveringsdato": "01.01.2020",
                "id": "001",
                "navn": "Oversettelse nettside",
                "beløp": 1200.00
                },
                {"leveringsdato": "05.01.2020",
                "id": "002",
                "navn": "Korrekturlesning",
                "beløp": 432.30
                },
                {"leveringsdato": "06.01.2020",
                "id": "004",
                "navn": "Skjønnlitteratur oversettelse",
                "beløp": 1223.00
                }]
```

Det er lurt å på en eller annen måte strukturere dataene på en forutsigbar måte. I dette tilfellet har jeg laget en liste. Listen inneholder 3 unike gjenstander. Hver gjenstand representerer én jobb, og inneholder 4 nøkkel-verdi-par som inneholder de fire opplysningene jeg behøver (i Python er dette en *dictonary*, en samling med data strukturert som nøkkel-verdi-par)

```python
# Loop over alle oppdragene i datasettet.
# Legg inn id, navn, type, beløp, enhet og leveringsdato.
# Gjenta for alle oppdragene som skal med.
for oppdrag in alle_oppdrag:
	generator.add_to_invoice(oppdrag["leveringsdato"],
							oppdrag["id"],
							oppdrag["navn"],
							oppdrag["beløp"])
```

Nå kan jeg loope over de tre gjenstandene i listen min. Jeg kaller metoden `faktura.add_to_invoice` på hver gjenstand, slik at informasjonen blir lagt inn i faktura-generatoren.

Takket være den nye fordelingen med netto-brutto-utregning for hver eneste fakturapost, kan vi nå også endre MVA-satsen på enkelte poster. Dette kan være nyttig om du skal fakturere med ulike MVA-satser. 

I eksempelet nedenfor skal jeg fakturere en jobb som av en eller annen grunn har en annen MVA-sats. Da legger jeg til et fjerde, valgfritt argument som sier at MVA-satsen på denne jobben skal være 12 %, i stedet for de 25 %-ene som er standard på overordnet nivå (fra `generator.kunde.vat`)

```python
generator.add_to_invoice("07.01.2020", "0007", "Oversettelse skatteregler", 1310.23, vat=0.12)
```

### 3. Generer fakturaen og skriv til fil

```python
# Generer tabellen.
# Generer så selve fakturaen og lagre den i en variabel.
generator.generate_table()
html_fil = generator.generate_body()

# Skriv fakturaen til en fil.
# (Bruk fakturanummret i filnavnet for bedre oversikt.)
with open(f"invoices/obs_faktura_{generator.faktura.id}.html", "w") as f:
	f.write(html_fil)
```

Resten fungerer som før. Ved å kalle `generator.generate_table()`, vil tabellen til fakturaen skapes. Neste kall til `generator.generate_body()` legger tabellen, kundeinformasjon, bankinformasjon og fakturainformasjon inn i selve HTML-dokumentet og returnerer det. Jeg lagrer det returnerte objektet i variabelen html_fil, og skriver den til en fil. Filen markerer jeg med fakturanummeret, som jeg har tilgang til via `generator.faktura.id`.

[Her kan du se den ferdige fakturaen.](/obs_faktura_9159.html)

Det er alt som trengs for å «programmatisk» skape en faktura. Nå burde det meste ligge til rette for å automatisere hele prosessen, for eksempel ved å binde Hammer Faktura inn i et skript som laster informasjonen om utførte oppdrag ned fra XTRF-installasjonen til kunden din.

## Andre forbedringer

Det er også noen andre forbedringer jeg er fornøyd med med tanke på organisering av kode.

Nå ligger alle byggesteinene til dokumentet lagret som maler i HTML-format i en og samme mappe. Det gjør det enda enklere å arbeide med utformingen til fakturaene, uten å gjøre endringer i Python-koden.

```python
hammer_faktura/
├── __init__.py
└── maler
    ├── fakturamal.html
    ├── style.html
    ├── tabellmal.html
    └── tr_elem_mal.html
```

Dessuten har jeg lagt CSS-stilene inn i et eget HTML-dokument, som jeg legger inn i headeren til fakturaen. Dermed er fakturaen et helt frittstående HTML-dokument hvor alt er synlig, litt som HTML-dokumentene til hjemmesiden min.

---
**Obs:**

Siden jeg la ut denne bloggposten har jeg oppdatert Hammer Faktura igjen. Nå har jeg lagt til støtte for databaser.

[Les bloggposten om versjon 3 av Hammer Faktura her](/blogg/hammer-faktura-versjon-3).

[Les bloggposten om den første utgaven av Hammer Faktura her](/blogg/fakturagenerator-i-python).
