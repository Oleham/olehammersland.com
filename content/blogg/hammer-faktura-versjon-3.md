+++
title = "Hammer Faktura versjon 3"
date = "2021-03-21T18:16:42+01:00"

#
# description is optional
#
# description = "An optional description for SEO. If not provided, an automatically created summary will be used."

tags = ["automatisering","bash","effektivisering","enkeltpersonforetak","oversettelse","python",]

include_toc = true
+++

Jeg har oppdatert Hammer Faktura igjen! I denne bloggposten går jeg gjennom hva som er nytt, og gir litt dokumentasjon på hvordan man kan bruke programmet.

## Nytt i Hammer Faktura versjon 3:

* Støtte for sqlite-database muliggjør lagring av fakturaposter, kunder, bankinformasjon og fakturaer.
* Kommandolinjeverktøy for direkte samhandling med databasen.
* Wrapper-funksjoner som forenkler prosessen med å opprette faktuaene.
* Støtte for enkel flerspråklighet, slik at jeg kan skrive ut engelske fakturaer.

De tidligere utgavene av Hammer Faktura har kun hatt støtte for å opprette fakturaene. Fakturaene har blitt opprettet ved å kjøre data fra eksterne kilder gjennom programmet. Nå legger jeg til støtte for å lagre all relevant informasjon i en egen database. En database er i prinsippet som et Excel-regneark: den inneholder ulike tabeller som er knyttet sammen. Man kan samhandle med databasen med spørringsspråket SQL, eller med andre verktøy og drivere. 

Det er det som er fint med å lagre all informasjonen i en SQL-database: det er en ganske agnostisk måte å lagre data på. Det finnes utallige måter å hente dataene og kjøre regnestykker og analyser på dem, og det er ikke knyttet til noe spesielt program eller programmeringsspråk. Den sentraliserte datastrukturen burde tilfredsstille alle behovene mine for regnskapsføring: f.eks kan jeg regne ut hvor mye penger jeg tjente i løpet av en viss tidsperiode, hvor mye MVA jeg har betalt, hvor mange oppdrag jeg har fått fra kunde X, osv.

Hammer Faktura har fått en egen modul, `hfdb`(Hammer Faktura -database), som er ansvarlig for å samhandle med databasen og knytte informasjonen der sammen med programmet mitt.

Hammer Faktura kan nå dessuten [kjøres direkte som et skript](#kommandolinjeverktøy) med "-m" flagget til Python.

## Dokumentasjon

**Innhold:**

1. [Hurtigstart](#hurtigstart)
1. [Skape og bruke fakturageneratoren](#skape-og-bruke-fakturageneratoren)
1. [Samhandling med databasen](#samhandling-med-databasen)
1. [Navn og kontrakter](#navn-og-kontrakter)
1. [Kommandolinjeverktøy](#kommandolinjeverktøy)

### Hurtigstart

Last ned modulen:

```
git clone https://github.com/Oleham/hammer_faktura.git
```

Opprett en tom database i nåværende mappe. Navnet vil alltid være `hammer_faktura.db`.

```
$ python3 -m hammer_faktura.create_tables
```

Importer database-modulen `hammerfaktura.hfdb` i skriptet ditt. Den inneholder funksjoner for å samhandle med databasen.
Lag en enkel faktura for ett oppdrag:

```python
from hammer_faktura import hfdb

# Legg til en kunde i databasen.
client_pk = hfdb.addClient("Kunde", 
                            "934 343 343",
                            "Adresseveien 4, 1234 Oslo", 
                            0.25, 
                            "NOK")

# Legg til bankinformasjonen din i databasen.
bank_pk = hfdb.addBank("123.2312.2323", 
                        "NO87234233",
                        "NONKIRE",
                        "Banken AS")

# Verdien på jobben
value = 2320.3

generator = hfdb.quickGeneratorFromItem("01.01.1990",
                                        "ID-231",
                                        "Oversettelse kokebok",
                                        value,
                                        client_pk, 
                                        bank_pk)

invoice = generator.makeInvoiceBody()

with open("faktura.html", "w") as f:
    f.write(invoice)

```

`hfdb.quickGeneratorFromItem` lar oss legge til en jobb i databasen og umiddelbart skape en faktura for den. Med `hfdb.quickGeneratorFromList` kan vi på samme måte legge inn flere oppdrag og umiddelbart skape en faktura.

```python
jobber = [{"dato": 1615968966,
    "id": "1234",
    "beskrivelse": "Oversettelse avis",
    "netto": 320.12
    }, 
    {"dato": 1615968100,
    "id": "5678",
    "beskrivelse": "Korrekturlesning 4 timer",
    "netto": 1030.20
    }, 
    {"dato": 1616328966,
    "id": "ABCDF",
    "beskrivelse": "Kokebok",
    "netto": 365.06,
    "vat": 0.15 # obs!
    } 
]

generator = hfdb.quickGeneratorFromList(jobber, client_pk, bank_pk)

invoice = generator.makeInvoiceBody()
```
Merk at det er valgfritt å oppgi en mva-sats på enkeltjobbene. Om det ikke oppgis noen mva-sats, vil standardsatsen for den aktuelle kunden velges (i dette tilfellet 0.25, altså 25 %)

### Samhandling med databasen

La oss ta en titt på hva som skjer i bakgrunnen. Da er det nyttig å først kaste et blikk på strukturen til databasen:

![En skjematisk fremstilling av databasen](/images/blogg/hammer_faktura_database.jpg)

Som vi ser, består databasen av fire tabeller: invoices, invoice_items, clients og banks. Den viktigste tabellen som knytter alle tabellene sammen, er invoices. Det er alltid knyttet en client og en bank til hver invoice, i et én-til-én-forhold. Samtidig kan flere poster i invoice_items, som representerer de enkelte jobbene, være knyttet til en invoice i et mange-til-én-forhold (en faktura kan inneholde flere fakturaposter). 

I forrige avsnitt viste jeg hvordan man veldig raskt kan skape fakturaer med `hfdb.quickGeneratorFromItem` og `hfdb.quickGeneratorFromList`. Dette er faktisk to wrapper-funksjoner som «wrapper» en rekke funksjoner for samhandling med databasen, med den hensikt å gjøre det så enkelt så mulig å opprette en faktura hurtig. De gjør to ting med informasjonen som gis dem: de legger dem til i databasen, og så returnerer de en `hammer_faktura.Generator`, som vi kan bruke for å skape en faktura.

La oss ta en titt på hva som skjer i bakgrunnen når vi bruker disse wrapper-funksjonene:

```python
from hammer_faktura import hfdb

jobber = [{"dato": 1615968100,
    "id": "5678",
    "beskrivelse": "Korrekturlesning 4 timer",
    "netto": 1030.20,
    "client": client_pk  # obs!
    },
    […]

for jobb in jobber:
    hfdb.addItem(jobb)  

invoice_number = hfdb.addInvoice(client_pk, bank_pk, 
                    dato=timestamp, 
                    frist=30, 
                    language="NO")
                                                                                     
hfdb.assignItemsByDate(invoice_number, 
                    "16.03.2021",
                    "21.03.2021")  
  
```

I dette eksempelet lagrer vi jobbene manuelt i databasen med `hfdb.addItem()`. Jobbene lagres i tabellen invoice_items. Merk at vi nå er nødt til å oppgi hvem som er client for hver enkelt jobb, siden vi nå legger til jobbene «uavhengig» av en faktura. 

`hfdb.addInvoice()` lagrer en faktura i databasen, i tabellen invoices. Det er kun nødvendig å oppgi en kunde og bankinformasjon. Vi kan også oppgi følgende: en egendefinert fakturadato (som timestamp – standard er dagens dato), en egendefinert frist eller velge et annet språk enn norsk. I bakgrunnen blir det automatisk generert et fakturanummer som returneres og lagres i variabelen invoice_number.

`hfdb.assignItemsByDate()` knytter så en rekke invoice_item til en invoice i et én-til-flere-forhold. Dette forholdet etableres først når vi kjører denne funksjonen – fakturaposter som ennå ikke er blitt berørt, vil ikke være tilknyttet noen faktura i det hele tatt. Argumentene er fakturanummeret det gjelder og et datospenn. Alle poster i invoice_items med samme client som fakturaen og leveringsdato innenfor tidsspennet, blir knyttet til fakturaen.

### Skape og bruke fakturageneratoren

```python
[…]

generator = hfdb.makeGenerator(invoice_number)  

body = generator.makeInvoiceBody()

with open("faktura.html", "w") as f:
    f.write(body)

```

Til slutt skaper vi generatoren med funksjonen `hfdb.makeGenerator()`. Funksjonen tar et fakturanummer som argument, og forutsetter at det finnes poster i tabellen invoice_items som er knyttet til dette fakturanummeret. Det henter så all informasjon om client, bank, og invoice_items som er knyttet til fakturaen, og lagrer det i generatoren. 

Generatoren er en klasse med tre underklasser, client, invoice og bank, som til sammen inneholder all relevant informasjon om fakturaen fra databasen. Den har også en (wrapper-)metode `hammer_faktura.Generator.makeInvoiceBody` som returnerer et html-dokument som en string. [Se min forrige post for mer informasjon om Generator-objektet](/blogg/fakturaer-del-to/#1-initialisere-kunde-bank-og-faktura). `hfdb.makeGenerator()` er altså en nøkkelfunksjon som forvandler en post i tabellen invoices til en python-klasse vi kan bruke programmet vårt.Vi kan  manuelt overskrive feltene til hammer_faktura.Generator-objektet, f.eks slik:

```python
generator = hfdb.quickGeneratorFromList(jobber, client_pk, bank_pk)

generator.invoice.language = "en"        # endre språk.
generator.invoice.forfall = "01.01.2020" # overskrive forfallsdatoen
generator.client.vat = 0.3               # overskrive mva-satsen
generator.invoice_items[0]["beskrivelse"] += " m.m." # endre en jobb
```
Man skal imidlertid ha en ganske god grunn for å gjøre det, for endringene vil ikke gjenspeiles i databasen, kun på fakturaen man så genererer. Om man vil endre på innholdet i databasen, må det gjøre med funksjonene i `hfdb`-modulen.

### Navn og kontrakter

I dette prosjektet har jeg blitt inspirert av boken jeg leser for tiden, *The Go Programming Language*. Forfatterne av boken går nøye gjennom navnekonvensjonene i Go, og det har vært lærerikt å tilnærme seg en lignende konsekvenstenking når jeg definerer funksjoner og oppførsel i dette prosjektet.

Som den oppmerksomme leser kanskje har fått med seg, finnes det en rekke funksjoner i Hammer Faktura med prefikset «add», etterfulgt av et objekt i singular. «addInvoice», «addItem», «addClient» og «addBank». Alle disse korresponderer med en tabell i databasen. 

Wrapper-funksjonene starter med «quick» og gir allerede i navnet et hint om hvilke argumenter som må følge: «quickGeneratorFromList» eller «quickGeneratorFromItem».

Hva er poenget? Hvorfor ikke bare kalle funksjonene for «funksjon1» eller «asdfgh»?

Vel, ved å skape lignende navn og lignende oppførsel blir det lettere å lese og forstå koden. Det skaper en slags «kontrakt» mellom brukeren og modulen. Konsekvenstenkingen vil også gjøre det lettere for meg å plukke opp koden på et senere tidspunkt. Jeg har for eksempel bestemt at alle «addX»-funksjonene legger til noe i databasen, og at de returnerer primærnøkkelen for den posten de nettopp la til. Dette skal da gjennomføres konsekvent, selv om jeg som regel ikke bruker denne returverdien til noe, unntatt i «addInvoice». Om jeg i fremtiden vil bruke Hammer Faktura på en ny måte, vet jeg imidlertid at det er en mulighet. Det vil også gjøre det lettere å skumme gjennom listen over funksjoner og se hvilke nye funksjoner som kan legges til. Kanskje vil jeg legge til en funksjon kalt «assignItemsById» for å knytte fakturaposter til fakturaer etter jobb-id, i stedet for etter et datospenn med «assignItemsByDate».

* def addItem(values)
* def addClient(navn, org_nr, adresse, vat, valuta)
* def addBank(konto, iban, bic, bank)
* def addInvoice(client, bank, dato=int(time.time()), frist=30, language="NO")
* def assignItemsByDate(invoice, _from, to)
* def makeGenerator(id)
* def quickGeneratorFromList(items, client, bank)
* def quickGeneratorFromItem(dato, id, beskrivelse, netto, client, bank)

Når jeg ser på listen over funksjoner, vil jeg si at det ser ganske forståelig ut (selvskryt skal man lytte til, for det kommer fra hjertet)! 😬

I henhold til SQL-konvensjoner er tabellene databasen skrevet i såkalt *snake case* i stedet for *camel case*, altså *slik_som_dette* i stedet for *påDenneMåten*. Dessuten står tabellnavn alltid i flertall.

### Kommandolinjeverktøy

Jeg har begynt å lage støtte for å bruke Hammer Faktura i kommandolinjen. Inntil videre har jeg konsentrert meg spesielt om de operasjonene som ikke må gjøres så ofte: da tenker jeg på det å legge til en ny kunde eller en ny bankforbindelse. Jeg har også støtte for å legge til en enkelt jobb i invoice_item.

Slik kan Hammer Faktura brukes i kommandolinjen:

```
$ python3 -m hammer_faktura

Usage: python3 -m hammer_faktura [-l/-a] <args>

        list: -l or --list (table name in plural, i.e. "invoices")
        add: -a or --add (item, bank, client or invoice)

$ python3 -m hammer_faktura -l clients

3       Navn     Org        Adresse     0.25    NOK
4       Test     234234     Adresse     0.25    SEK
5       Navn     43443      Adresse     0.25    SEK
6       Probe    234233     Adresse     0.25    SEK

$ python3 -m hammer_faktura -a client "En ny kunde" 94233465 "Bakketoppen 4, 4567 Kristiansand" 0.25 NOK

        Name: En ny kunde
        Org_nr: 94233465
        Adresse: Bakketoppen 4, 4567 Kristiansand
        VAT rate: 0.25
        Valuta: NOK

Type Y to add client (Y)
Y
Added new client: En ny kunde, 94233465, Bakketoppen 4, 4567 Kristiansand, 0.25, NOK

$ python3 -m hammer_faktura -l clients

3       Navn            Org        Adresse               0.25    NOK
4       Test            234234     Adresse               0.25    SEK
5       Navn            43443      Adresse               0.25    SEK
6       Probe           234233     Adresse               0.25    SEK      
8       En ny kunde     94233465   Bakketoppen 4, 
                                   4567 Kristiansand     0.25    NOK
```

Neste punkt på programmet vil være støtte for å lage en faktura direkte i kommandolinjen, på samme måte som `hfdb.quickGeneratorFromItem`.

[Se Hammer Faktura på Github!](https://github.com/Oleham/hammer_faktura)

